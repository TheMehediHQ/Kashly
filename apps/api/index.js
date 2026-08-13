const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});
const express = require("express");
const app = express();
app.set("trust proxy", 1);
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
const { verifyToken: verifyClerkToken } = require("@clerk/backend");
const { Webhook } = require("svix");
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
const allowedOrigins = ["http://localhost:3000"];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    token = req.cookies?.__session;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You are not logged in. Please login first.",
    });
  }

  try {
    const payload = await verifyClerkToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    req.auth = { userId: payload.sub };

    const My_Finance_db = client.db("My_Finance");
    let appUser = await My_Finance_db
      .collection("usersData")
      .findOne({ clerkId: payload.sub });

    // If found by clerkId but user has no real data, check for old user with same email to merge
    if (appUser && !appUser.credits && appUser.credits !== 0) {
      const { createClerkClient } = require("@clerk/backend");
      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      const clerkUser = await clerkClient.users.getUser(payload.sub);
      const email = clerkUser.emailAddresses?.[0]?.emailAddress;

      const oldUser = await My_Finance_db
        .collection("usersData")
        .findOne({ email, clerkId: { $exists: false } });

      if (oldUser) {
        // Move transactions and budgets from old user to clerk-linked user
        await My_Finance_db.collection("transactions").updateMany(
          { userId: oldUser._id.toString() },
          { $set: { userId: appUser._id.toString() } }
        );
        await My_Finance_db.collection("budgets").updateMany(
          { userId: oldUser._id.toString() },
          { $set: { userId: appUser._id.toString() } }
        );
        // Copy over credits and settings from old user
        await My_Finance_db.collection("usersData").updateOne(
          { _id: appUser._id },
          {
            $set: {
              credits: oldUser.credits || 1000,
              role: oldUser.role || "user",
              isTransactionAllowed: oldUser.isTransactionAllowed ?? true,
              fullName: oldUser.fullName || appUser.fullName,
              photoURL: oldUser.photoURL || appUser.photoURL,
            },
          }
        );
        // Remove the old duplicate user
        await My_Finance_db.collection("usersData").deleteOne({ _id: oldUser._id });
        // Re-fetch
        appUser = await My_Finance_db
          .collection("usersData")
          .findOne({ _id: appUser._id });
      }
    }

    // If not found by clerkId, try linking by email to existing user
    if (!appUser) {
      const { createClerkClient } = require("@clerk/backend");
      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      const clerkUser = await clerkClient.users.getUser(payload.sub);
      const email = clerkUser.emailAddresses?.[0]?.emailAddress;

      // Check if an existing user with this email exists (old auth system)
      const existingUser = await My_Finance_db
        .collection("usersData")
        .findOne({ email });

      if (existingUser) {
        // Link Clerk account to existing MongoDB user
        await My_Finance_db.collection("usersData").updateOne(
          { _id: existingUser._id },
          {
            $set: {
              clerkId: payload.sub,
              isVerified: true,
              ...(clerkUser.imageUrl && { photoURL: clerkUser.imageUrl }),
            },
          }
        );
        appUser = await My_Finance_db
          .collection("usersData")
          .findOne({ _id: existingUser._id });
      } else {
        // No existing user — create new one
        const fullName =
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          email;

        const result = await My_Finance_db.collection("usersData").insertOne({
          clerkId: payload.sub,
          fullName,
          email,
          role: "user",
          isVerified: true,
          isTransactionAllowed: true,
          credits: 1000,
          photoURL: clerkUser.imageUrl || "",
          createdAt: new Date(),
        });

        appUser = await My_Finance_db
          .collection("usersData")
          .findOne({ _id: result.insertedId });
      }
    }

    req.user = { id: appUser._id.toString(), ...appUser };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const My_Finance = client.db("My_Finance");
    const usersCollection = My_Finance.collection("usersData");
    const transactionsCollection = My_Finance.collection("transactions");
    const budgetsCollection = My_Finance.collection("budgets");
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // ─── Clerk Webhook: sync users to MongoDB (raw body for Svix verification) ───
    app.post(
      "/api/webhooks/clerk",
      express.raw({ type: "application/json" }),
      async (req, res) => {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

        if (!WEBHOOK_SECRET) {
          return res.status(500).json({ message: "Webhook secret not configured" });
        }

        const svix_id = req.headers["svix-id"];
        const svix_timestamp = req.headers["svix-timestamp"];
        const svix_signature = req.headers["svix-signature"];

        if (!svix_id || !svix_timestamp || !svix_signature) {
          return res.status(400).json({ message: "Missing Svix headers" });
        }

        let evt;
        try {
          const wh = new Webhook(WEBHOOK_SECRET);
          evt = wh.verify(req.body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
          });
        } catch (err) {
          return res.status(400).json({ message: "Invalid webhook signature" });
        }

        const { type, data } = evt;

      if (type === "user.created") {
        const { id, email_addresses, first_name, last_name, image_url } = data;
        const email = email_addresses?.[0]?.email_address;
        const fullName = [first_name, last_name].filter(Boolean).join(" ") || email;

        const existing = await usersCollection.findOne({ clerkId: id });
        if (!existing) {
          await usersCollection.insertOne({
            clerkId: id,
            fullName,
            email,
            role: "user",
            isVerified: true,
            isTransactionAllowed: true,
            credits: 1000,
            photoURL: image_url || "",
            createdAt: new Date(),
          });
        }
      }

      if (type === "user.updated") {
        const { id, first_name, last_name, email_addresses, image_url } = data;
        const fullName = [first_name, last_name].filter(Boolean).join(" ");
        const email = email_addresses?.[0]?.email_address;

        const updateFields = {};
        if (fullName) updateFields.fullName = fullName;
        if (email) updateFields.email = email;
        if (image_url !== undefined) updateFields.photoURL = image_url;

        if (Object.keys(updateFields).length > 0) {
          await usersCollection.updateOne(
            { clerkId: id },
            { $set: updateFields }
          );
        }
      }

      if (type === "user.deleted") {
        const { id } = data;
        const user = await usersCollection.findOne({ clerkId: id });
        if (user) {
          const userIdStr = user._id.toString();
          await transactionsCollection.deleteMany({ userId: userIdStr });
          await budgetsCollection.deleteMany({ userId: userIdStr });
          await usersCollection.deleteOne({ clerkId: id });
        }
      }

      res.status(200).json({ received: true });
    });

    // ─── Get current user (by Clerk ID) ───
    app.get("/api/me", verifyToken, async (req, res) => {
      try {
        const clerkUserId = req.auth.userId;

        const user = await usersCollection.findOne(
          { clerkId: clerkUserId },
          { projection: { password: 0 } },
        );

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({
          message: "User data fetched",
          user: {
            id: user._id,
            clerkId: user.clerkId,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            credits: user.credits,
            photoURL: user.photoURL,
            isTransactionAllowed: user.isTransactionAllowed ?? true,
            createdAt: user.createdAt,
          },
        });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    });

    // Update User Profile
    app.put("/api/me", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const { fullName, photoURL } = req.body;

        if (!fullName || fullName.trim() === "") {
          return res.status(400).json({ message: "Full name is required" });
        }

        // First check if user exists
        const existingUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!existingUser) {
          return res.status(404).json({ message: "User not found" });
        }

        // Update the user
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              fullName: fullName.trim(),
              ...(photoURL && { photoURL }),
            },
          }
        );

        // Fetch the updated user
        const updatedUser = await usersCollection.findOne(
          { _id: new ObjectId(userId) },
          { projection: { password: 0 } }
        );

        res.json({
          message: "Profile updated successfully",
          user: {
            id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            role: updatedUser.role,
            photoURL: updatedUser.photoURL,
            credits: updatedUser.credits,
          },
        });
      } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
    });

    app.get("/api/summary", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const { month, year } = req.query;

        let dateMatch = {};

        // Build date filter based on month and year parameters
        if (month && year) {
          // Specific month and year
          const regex = new RegExp(
            `^${year}-${String(month).padStart(2, "0")}-`
          );
          dateMatch = { date: { $regex: regex } };
        } else if (year && !month) {
          // Entire year
          const regex = new RegExp(`^${year}`);
          dateMatch = { date: { $regex: regex } };
        } else {
          // Default: current month
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          
          // Match createdAt date range for current month
          dateMatch = {
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          };
        }

        // 📊 helper: total amount based on date filtering
        const getTotal = async (type) => {
          const matchStage = {
            userId,
            transactionType: type,
            ...dateMatch,
          };

          const result = await transactionsCollection
            .aggregate([
              {
                $match: matchStage,
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$amount" },
                },
              },
            ])
            .toArray();

          return result.length > 0 ? result[0].total : 0;
        };

        // 📊 helper: transaction count
        const getCount = async (type) => {
          return await transactionsCollection.countDocuments({
            userId,
            transactionType: type,
            ...dateMatch,
          });
        };

        // 💰 income
        const thisMonthIncome = await getTotal("income");

        // 💸 expense
        const thisMonthExpense = await getTotal("expense");

        // 🔢 counts
        const incomeTransactions = await getCount("income");
        const expenseTransactions = await getCount("expense");

        res.json({
          success: true,
          data: {
            thisMonthIncome,
            thisMonthExpense,
            incomeTransactions,
            expenseTransactions,
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });

    app.get("/api/balance", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;

        const result = await transactionsCollection
          .aggregate([
            {
              $match: {
                userId,
              },
            },

            {
              $group: {
                _id: null,

                income: {
                  $sum: {
                    $cond: [
                      { $eq: ["$transactionType", "income"] },
                      "$amount",
                      0,
                    ],
                  },
                },

                expense: {
                  $sum: {
                    $cond: [
                      { $eq: ["$transactionType", "expense"] },
                      "$amount",
                      0,
                    ],
                  },
                },
              },
            },
          ])
          .toArray();

        const income = result[0]?.income || 0;
        const expense = result[0]?.expense || 0;
        const balance = income - expense;

        res.status(200).send({
          success: true,
          balance,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "Server Error",
        });
      }
    });

    app.get("/api/transactions", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const { type, month, year } = req.query;

        const allowedTypes = ["income", "expense"];
        if (type && type !== "all" && !allowedTypes.includes(type)) {
          return res.status(400).json({
            success: false,
            message: "Invalid type filter",
          });
        }

        let query = { userId };

        if (type && type !== "all") {
          query.transactionType = type;
        }

        // Add month/year filtering based on date field (YYYY-MM-DD format)
        if (month && year) {
          const regex = new RegExp(
            `^${year}-${String(month).padStart(2, "0")}-`
          );
          query.date = { $regex: regex };
        } else if (year && !month) {
          // Filter by year only
          const regex = new RegExp(`^${year}`);
          query.date = { $regex: regex };
        } else if (month && !year) {
          // If month provided without year, use current year
          const currentYear = new Date().getFullYear();
          const regex = new RegExp(
            `^${currentYear}-${String(month).padStart(2, "0")}-`
          );
          query.date = { $regex: regex };
        }

        const pageNum = parseInt(req.query.page) || 1;
        const limitNum = parseInt(req.query.limit) || 20;
        const skip = (pageNum - 1) * limitNum;

        const data = await transactionsCollection
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .toArray();

        const totalCount = await transactionsCollection.countDocuments(query);

        res.json({
          success: true,
          total: totalCount,
          hasMore: totalCount > skip + limitNum,
          data,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });

    app.get("/api/admin/users", verifyToken, async (req, res) => {
      try {
        const user = await usersCollection.findOne({
          _id: new ObjectId(req.user.id),
        });

        if (!user || user.role !== "admin") {
          return res
            .status(403)
            .json({ message: "Access denied. Admins only." });
        }

        const users = await usersCollection.find().sort({ _id: -1 }).toArray();

        res.status(200).json({ users });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    });

    app.post("/api/transactions", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;

        const {
          amount,
          category,
          method,
          date,
          time,
          note,
          attachment,
          transactionType,
        } = req.body;

        if (!amount || !transactionType) {
          return res.status(400).json({
            success: false,
            message: "Amount and transactionType are required",
          });
        }

        const allowedTypes = ["income", "expense"];
        if (!allowedTypes.includes(transactionType)) {
          return res.status(400).json({
            success: false,
            message: "Invalid transaction type",
          });
        }

        const user = await usersCollection.findOne({
          _id: new ObjectId(userId),
        });

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        if (!user.isTransactionAllowed) {
          return res.status(403).json({
            success: false,
            message: "Transaction is disabled for your account.",
          });
        }

        if (user.credits < 1) {
          return res.status(403).json({
            success: false,
            message:
              "No credits left. Please contact admin to add more credits to your account.",
          });
        }

        const newTransaction = {
          userId: userId,
          amount: Number(amount),
          category: category || "Others",
          method: method || "Cash",
          date,
          time,
          note,
          attachment,
          transactionType,
          createdAt: new Date(),
        };

        const result = await transactionsCollection.insertOne(newTransaction);

        if (result.insertedId) {
          await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $inc: { credits: -1 } },
          );

          return res.status(201).json({
            success: true,
            message: "Transaction added successfully.",
          });
        }

        return res.status(500).json({
          success: false,
          message: "Failed to add transaction",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });

    app.patch(
      "/api/admin/users/:id/transaction-status",
      verifyToken,
      async (req, res) => {
        try {
          const user = await usersCollection.findOne({
            _id: new ObjectId(req.user.id),
          });

          if (!user || user.role !== "admin") {
            return res
              .status(403)
              .json({ message: "Access denied. Admins only." });
          }

          const { id } = req.params;
          const { isTransactionAllowed } = req.body;

          if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
          }

          const result = await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { isTransactionAllowed } },
          );

          if (result.modifiedCount === 1) {
            return res.json({
              success: true,
              message: "Transaction status updated successfully",
            });
          }

          res.status(404).json({ message: "User not found" });
        } catch (error) {
          res.status(500).json({ message: "Server error" });
        }
      },
    );

    app.patch("/api/admin/users/:id/credits", verifyToken, async (req, res) => {
      try {
        const requester = await usersCollection.findOne({
          _id: new ObjectId(req.user.id),
        });

        if (!requester || requester.role !== "admin") {
          return res
            .status(403)
            .json({ message: "Access denied. Admins only." });
        }

        const { id } = req.params;
        const { credits } = req.body;

        const creditsToAdd = Math.round(Number(credits));

        if (!id || isNaN(creditsToAdd) || creditsToAdd <= 0) {
          return res
            .status(400)
            .json({ message: "Invalid ID or credit amount must be greater than 0" });
        }

        const userId = new ObjectId(id);

        const updateResult = await usersCollection.updateOne(
          { _id: userId },
          { $inc: { credits: creditsToAdd } },
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await usersCollection.findOne({ _id: userId });

        res.status(200).json({
          success: true,
          message: "Credits updated successfully",
          credits: updatedUser.credits,
        });
      } catch (error) {
        res.status(500).json({ message: "Failed to update credits" });
      }
    });

    // ─── Admin: Update user role ───
    app.patch("/api/admin/users/:id/role", verifyToken, async (req, res) => {
      try {
        const requester = await usersCollection.findOne({
          _id: new ObjectId(req.user.id),
        });

        if (!requester || requester.role !== "admin") {
          return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { id } = req.params;
        const { role } = req.body;

        if (!["admin", "user"].includes(role)) {
          return res.status(400).json({ message: "Role must be 'admin' or 'user'" });
        }

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid user ID" });
        }

        const result = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { role } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({ success: true, message: `Role updated to ${role}` });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    });

    // ─── Admin: Delete user + their data ───
    app.delete("/api/admin/users/:id", verifyToken, async (req, res) => {
      try {
        const requester = await usersCollection.findOne({
          _id: new ObjectId(req.user.id),
        });

        if (!requester || requester.role !== "admin") {
          return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid user ID" });
        }

        const targetUser = await usersCollection.findOne({ _id: new ObjectId(id) });
        if (!targetUser) {
          return res.status(404).json({ message: "User not found" });
        }

        if (targetUser._id.toString() === requester._id.toString()) {
          return res.status(400).json({ message: "Admin cannot delete themselves" });
        }

        const userObjId = new ObjectId(id);

        await transactionsCollection.deleteMany({ userId: id });
        await budgetsCollection.deleteMany({ userId: id });
        await usersCollection.deleteOne({ _id: userObjId });

        res.json({
          success: true,
          message: `User "${targetUser.fullName}" and all their data deleted`,
        });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    });

    app.put("/api/transactions/:id", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const { id } = req.params;
        const {
          amount,
          category,
          method,
          date,
          time,
          note,
          attachment,
        } = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            message: "Invalid transaction ID",
          });
        }

        if (!amount) {
          return res.status(400).json({
            success: false,
            message: "Amount is required",
          });
        }

        const updateTransaction = {
          amount: Number(amount),
          category: category || "Others",
          method: method || "Cash",
          date,
          time,
          note,
          attachment,
          updatedAt: new Date(),
        };

        const result = await transactionsCollection.updateOne(
          {
            _id: new ObjectId(id),
            userId,
          },
          { $set: updateTransaction },
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({
            success: false,
            message: "Transaction not found",
          });
        }

        if (result.matchedCount === 1) {
          return res.json({
            success: true,
            message: "Transaction updated successfully",
          });
        }

        return res.status(500).json({
          success: false,
          message: "Failed to update transaction",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });

    app.delete("/api/transactions/:id", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await transactionsCollection.deleteOne({
          _id: new ObjectId(id),
          userId,
        });

        if (result.deletedCount === 1) {
          return res.json({
            success: true,
            message: "Transaction deleted successfully",
          });
        }

        return res.status(404).json({
          success: false,
          message: "Transaction not found",
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });

    // ==================== BUDGET ENDPOINTS ====================

    // POST: Create a new budget
    app.post("/api/budgets", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const { category, limit, month, year, note } = req.body;

        if (!category || !limit || !month || !year) {
          return res.status(400).json({
            success: false,
            message: "Category, limit, month, and year are required",
          });
        }

        const normalizedCategory = category.trim();
        const monthNum = Number(month);
        const yearNum = Number(year);

        const existingBudget = await budgetsCollection.findOne({
          userId,
          category: normalizedCategory,
          month: monthNum,
          year: yearNum,
        });

        if (existingBudget) {
          return res.status(409).json({
            success: false,
            message: "Budget already exists",
          });
        }

        const newBudget = {
          userId,
          category: normalizedCategory,
          limit: Number(limit),
          month: monthNum,
          year: yearNum,
          note: typeof note === "string" ? note.trim() : "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await budgetsCollection.insertOne(newBudget);

        if (result.insertedId) {
          return res.status(201).json({
            success: true,
            message: "Budget created successfully",
            budget: { _id: result.insertedId, ...newBudget },
          });
        }

        return res.status(500).json({
          success: false,
          message: "Failed to create budget",
        });
      } catch (error) {
        if (error?.code === 11000) {
          return res.status(409).json({
            success: false,
            message: "Budget already exists",
          });
        }

        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });

    // GET: Fetch all budgets for current month
    app.get("/api/budgets", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const now = new Date();
        const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;
        const year = req.query.year ? Number(req.query.year) : now.getFullYear();

        const budgets = await budgetsCollection
          .find({
            userId,
            month,
            year,
          })
          .toArray();

        // Enhance budgets with actual spent amount
        const enhancedBudgets = await Promise.all(
          budgets.map(async (budget) => {
            const dateRegex = new RegExp(
              `^${year}-${String(month).padStart(2, "0")}-`
            );
            
            const spent = await transactionsCollection
              .aggregate([
                {
                  $match: {
                    userId,
                    transactionType: "expense",
                    category: budget.category,
                    date: { $regex: dateRegex },
                  },
                },
                {
                  $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                  },
                },
              ])
              .toArray();

            return {
              ...budget,
              spent: spent.length > 0 ? spent[0].total : 0,
            };
          })
        );

        res.json({
          success: true,
          data: enhancedBudgets,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });

    // GET: Fetch all budgets (history) for user
    app.get("/api/budgets/history/all", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;

        const pageNum = parseInt(req.query.page) || 1;
        const limitNum = parseInt(req.query.limit) || 20;
        const skip = (pageNum - 1) * limitNum;

        const filter = { userId };
        const totalCount = await budgetsCollection.countDocuments(filter);

        const budgets = await budgetsCollection
          .find(filter)
          .sort({ year: -1, month: -1 })
          .skip(skip)
          .limit(limitNum)
          .toArray();

        // Enhance budgets with actual spent amount
        const enhancedBudgets = await Promise.all(
          budgets.map(async (budget) => {
            const dateRegex = new RegExp(
              `^${budget.year}-${String(budget.month).padStart(2, "0")}-`
            );
            
            const spent = await transactionsCollection
              .aggregate([
                {
                  $match: {
                    userId,
                    transactionType: "expense",
                    category: budget.category,
                    date: { $regex: dateRegex },
                  },
                },
                {
                  $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                  },
                },
              ])
              .toArray();

            return {
              ...budget,
              spent: spent.length > 0 ? spent[0].total : 0,
            };
          })
        );

        res.json({
          success: true,
          total: totalCount,
          hasMore: totalCount > skip + limitNum,
          data: enhancedBudgets,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });

    // PUT: Update a budget
    app.put("/api/budgets/:id", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const { id } = req.params;
        const { category, limit, month, year, note } = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            message: "Invalid budget ID",
          });
        }

        if (!limit) {
          return res.status(400).json({
            success: false,
            message: "Limit is required",
          });
        }

        const budgetObjectId = new ObjectId(id);
        const existingBudget = await budgetsCollection.findOne({
          _id: budgetObjectId,
          userId,
        });

        if (!existingBudget) {
          return res.status(404).json({
            success: false,
            message: "Budget not found",
          });
        }

        const normalizedCategory =
          typeof category === "string" && category.trim()
            ? category.trim()
            : existingBudget.category;
        const monthNum = month ? Number(month) : existingBudget.month;
        const yearNum = year ? Number(year) : existingBudget.year;

        const duplicateBudget = await budgetsCollection.findOne({
          userId,
          category: normalizedCategory,
          month: monthNum,
          year: yearNum,
          _id: { $ne: budgetObjectId },
        });

        if (duplicateBudget) {
          return res.status(409).json({
            success: false,
            message: "Budget already exists",
          });
        }

        const updateBudget = {
          category: normalizedCategory,
          limit: Number(limit),
          month: monthNum,
          year: yearNum,
          note: typeof note === "string" ? note.trim() : undefined,
          updatedAt: new Date(),
        };

        // Remove undefined values
        Object.keys(updateBudget).forEach(
          (key) => updateBudget[key] === undefined && delete updateBudget[key]
        );

        const result = await budgetsCollection.updateOne(
          {
            _id: budgetObjectId,
            userId,
          },
          { $set: updateBudget }
        );

        if (result.matchedCount === 1) {
          return res.json({
            success: true,
            message: "Budget updated successfully",
          });
        }

        return res.status(500).json({
          success: false,
          message: "Failed to update budget",
        });
      } catch (error) {
        if (error?.code === 11000) {
          return res.status(409).json({
            success: false,
            message: "Budget already exists",
          });
        }

        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });

    // DELETE: Delete a budget
    app.delete("/api/budgets/:id", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            message: "Invalid budget ID",
          });
        }

        const result = await budgetsCollection.deleteOne({
          _id: new ObjectId(id),
          userId,
        });

        if (result.deletedCount === 1) {
          return res.json({
            success: true,
            message: "Budget deleted successfully",
          });
        }

        return res.status(404).json({
          success: false,
          message: "Budget not found",
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("My_Finance_Server is running");
});

module.exports = app;  // Vercel serverless এর জন্য

// শুধু লোকালি রান করার জন্য listen করুন, Vercel-এ না
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`My_Finance Server running on port ${port}`);
  });
}
