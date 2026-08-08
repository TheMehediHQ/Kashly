const crypto = require("crypto");

const verifyUser = async (req, res, usersCollection) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await usersCollection.findOne({
      verificationToken: tokenHash,
      verificationTokenExpire: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          isVerified: true,
          isTransactionAllowed: true,
          credits: 1000,
        },
        $unset: {
          verificationToken: "",
          verificationTokenExpire: "",
        },
      },
    );

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { verifyUser };
