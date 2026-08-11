const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});
const express = require("express");
const app = express();
// Trust the first proxy hop so req.ip reflects the real client IP
// (X-Forwarded-For) when running behind Vercel / any reverse proxy.
// Required for express-rate-limit to key requests correctly on serverless.
app.set("trust proxy", 1);
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const { registerUser } = require("./api/register");
const { verifyUser } = require("./api/verify");
const { resendVerification } = require("./api/resendVerification");
const { logoutUser } = require("./api/logoutUser");
const { loginUser } = require("./api/loginUser");
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

const loginIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

const forgotPasswordIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many password reset requests. Please try again later.",
  },
});

const accountAttemptStore = new Map();

const normalizeEmail = (email) => {
  if (!email || typeof email !== "string") return "";
  return email.trim().toLowerCase();
};

const accountCooldownLimiter = ({ keyPrefix, maxAttempts, windowMs, message }) => {
  return (req, res, next) => {
    const email = normalizeEmail(req.body?.email);

    if (!email) {
      return next();
    }

    const key = `${keyPrefix}:${req.ip}:${email}`;
    const now = Date.now();
    const existing = accountAttemptStore.get(key);

    if (!existing || existing.resetAt <= now) {
      accountAttemptStore.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (existing.count >= maxAttempts) {
      return res.status(429).json({ message });
    }

    existing.count += 1;
    accountAttemptStore.set(key, existing);
    next();
  };
};

const loginAccountLimiter = accountCooldownLimiter({
  keyPrefix: "login",
  maxAttempts: 8,
  windowMs: 15 * 60 * 1000,
  message: "Too many attempts for this account. Please try again later.",
});

const forgotPasswordAccountLimiter = accountCooldownLimiter({
  keyPrefix: "forgot",
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
  message:
    "Too many password reset requests for this account. Please try again later.",
});

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You are not logged in. Please login first.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
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

    // Add your API Endpoints here
    app.post("/api/register", (req, res) => {
      registerUser(req, res, usersCollection);
    });

    app.get("/api/verify", (req, res) => {
      verifyUser(req, res, usersCollection);
    });

    app.post("/api/resend-verification", (req, res) => {
      resendVerification(req, res, usersCollection);
    });

    app.post("/api/login", loginIpLimiter, loginAccountLimiter, (req, res) => {
      loginUser(req, res, usersCollection);
    });

    // Forgot Password
    app.post(
      "/api/forgot-password",
      forgotPasswordIpLimiter,
      forgotPasswordAccountLimiter,
      async (req, res) => {
      try {
        const { email } = req.body;
        if (!email) {
          return res.status(400).json({ message: "Email is required" });
        }

        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.json({
            message: "If this account exists, a password reset link has been sent.",
          });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");
        const resetTokenExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await usersCollection.updateOne(
          { _id: user._id },
          {
            $set: {
              resetToken: resetTokenHash,
              resetTokenExpire,
            },
          }
        );

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
          from: `"Finance App" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Reset your password",
          html: `
            <div style="background-color: #f9fafb; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h1 style="font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 16px;">Reset Your Password</h1>
                <p style="font-size: 16px; line-height: 1.5; color: #6b7280; margin-bottom: 32px;">
                  We received a request to reset your password for your Finance App account. Click the button below to reset your password.
                </p>
                
                <div style="margin: 32px 0; text-align: center;">
                  <a href="${resetLink}" 
                     style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px;">
                    Reset Password
                  </a>
                </div>

                <p style="font-size: 14px; line-height: 1.5; color: #6b7280; margin-bottom: 0;">
                  This link will expire in 15 minutes. If you did not request a password reset, you can safely ignore this email.
                </p>
              </div>
            </div>
          `,
        });

        res.json({
          message: "If this account exists, a password reset link has been sent.",
        });
      } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Server error" });
      }
      },
    );

    // Reset Password
    app.post("/api/reset-password", async (req, res) => {
      try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
          return res.status(400).json({ message: "Token and new password are required" });
        }

        if (newPassword.length < 8) {
          return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const user = await usersCollection.findOne({
          resetToken: tokenHash,
          resetTokenExpire: { $gt: new Date() },
        });

        if (!user) {
          return res.status(400).json({ message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await usersCollection.updateOne(
          { _id: user._id },
          {
            $set: { password: hashedPassword },
            $unset: { resetToken: "", resetTokenExpire: "" },
          }
        );

        res.json({ message: "Password reset successful" });
      } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.get("/api/me", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;

        const user = await usersCollection.findOne(
          { _id: new ObjectId(userId) },
          { projection: { password: 0 } },
        );

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({
          message: "User data fetched",
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            credits: user.credits, // 🔥 now included
            photoURL: user.photoURL,
          },
        });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    });

    app.post("/api/logout", logoutUser);

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

    // Update Password
    app.put("/api/me/password", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
          return res.status(400).json({ message: "Old password and new password are required" });
        }

        if (newPassword.length < 8) {
          return res.status(400).json({ message: "New password must be at least 8 characters" });
        }

        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Old password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        );

        res.json({ message: "Password updated successfully" });
      } catch (error) {
        console.error("Password update error:", error);
        res.status(500).json({ message: "Server error" });
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

        if (!id || isNaN(creditsToAdd) || creditsToAdd === 0) {
          return res
            .status(400)
            .json({ message: "Invalid ID or credit amount must not be 0" });
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
