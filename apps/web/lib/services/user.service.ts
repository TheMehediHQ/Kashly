import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { hashPassword, comparePassword } from "../auth/password";
import { generateVerificationToken, hashToken, generateJwtToken } from "../auth/token";
import { getUsersCollection } from "../db/mongodb";
import { normalizeEmail } from "../utils/helpers";
import nodemailer from "nodemailer";

// Create a transporter for sending emails
export function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// Register a new user
export async function registerUser(req: Request, res: Response) {
  try {
    const { fullName, email, password } = req.body;

    // validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const usersCollection = getUsersCollection();

    // check existing user
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // generate token
    const { token, tokenHash } = generateVerificationToken();

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

    // create transporter
    const transporter = createTransporter();

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
}

// Login user
export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const usersCollection = getUsersCollection();

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // JWT CREATE
    const token = generateJwtToken({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });

    // COOKIE SET
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// Logout user
export function logoutUser(req: Request, res: Response) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
}

// Verify user email
export async function verifyUser(req: Request, res: Response) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const tokenHash = hashToken(token as string);

    const usersCollection = getUsersCollection();

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
}

// Resend verification email
export async function resendVerification(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const usersCollection = getUsersCollection();

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

    const { token, tokenHash } = generateVerificationToken();

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

    const transporter = createTransporter();

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
}
