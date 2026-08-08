const crypto = require("crypto");
const nodemailer = require("nodemailer");

const resendVerification = async (req, res, usersCollection) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await usersCollection.findOne({ email });

    // Return generic success when user does not exist to avoid email enumeration.
    if (!user) {
      return res.json({
        message: "If this account exists and is not verified, a new link has been sent.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Your email is already verified." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          verificationToken: tokenHash,
          verificationTokenExpire: new Date(Date.now() + 60 * 60 * 1000),
        },
      },
    );

    const verifyLink = `${process.env.BASE_URL}/verify?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Finance App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your new email verification link",
      html: `
        <div style="background-color: #f9fafb; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Finance App</h1>
            </div>

            <div style="padding: 40px 30px;">
              <h2 style="margin-top: 0; color: #111827; font-size: 20px; font-weight: 600;">New verification link</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                We received a request for a new verification email. Click the button below to verify your account.
              </p>

              <div style="margin: 32px 0; text-align: center;">
                <a href="${verifyLink}"
                   style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px;">
                  Verify Email Address
                </a>
              </div>

              <p style="font-size: 14px; line-height: 1.5; color: #6b7280; margin-bottom: 0;">
                This link will expire in 1 hour. If you did not request this, you can ignore this email.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    res.json({ message: "A new verification email has been sent." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { resendVerification };