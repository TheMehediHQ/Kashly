const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const registerUser = async (req, res, usersCollection) => {
  try {
    const { fullName, email, password } = req.body;

    // validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check existing user
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const newUser = {
      fullName,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
      verificationToken: tokenHash,
      verificationTokenExpire: new Date(Date.now() + 60 * 60 * 1000),
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // create transporter (better: move outside function later)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyLink = `${process.env.BASE_URL}/verify?token=${token}`;

    // send email safely
    try {
      await transporter.sendMail({
        from: `"Finance App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your email address",
        html: `
    <div style="background-color: #f9fafb; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        
        <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">Finance App</h1>
        </div>

        <div style="padding: 40px 30px;">
          <h2 style="margin-top: 0; color: #111827; font-size: 20px; font-weight: 600;">Confirm your email address</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
            Thanks for signing up! To get started with your Finance App account, please verify your email by clicking the button below.
          </p>
          
          <div style="margin: 32px 0; text-align: center;">
            <a href="${verifyLink}" 
               style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px;">
              Verify Email Address
            </a>
          </div>

          <p style="font-size: 14px; line-height: 1.5; color: #6b7280; margin-bottom: 0;">
            This link will expire in 1 hours. If you did not create an account, you can safely ignore this email.
          </p>
        </div>

        <div style="background-color: #f3f4f6; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="font-size: 12px; color: #4f46e5; margin: 8px 0 0; text-align: center; word-break: break-all;">
            <a href="${verifyLink}" style="color: #4f46e5;">${verifyLink}</a>
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <p style="font-size: 12px; color: #9ca3af;">
          © 2026 Finance App Inc. | 123 Financial District, NY
        </p>
      </div>
    </div>
  `,
      });
    } catch (emailError) {
      return res.status(201).json({
        message: "Registration successful but failed to send verification email. Please try resending verification later.",
        emailWarning: true,
        userId: result.insertedId,
      });
    }

    res.status(201).json({
      message: "Registration successful. Please check your email.",
      userId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser };
