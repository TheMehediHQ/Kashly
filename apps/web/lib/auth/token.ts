import crypto from "crypto";
import jwt from "jsonwebtoken";

export function generateVerificationToken(): {
  token: string;
  tokenHash: string;
} {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, tokenHash };
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateResetToken(): {
  token: string;
  tokenHash: string;
} {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, tokenHash };
}

export function generateJwtToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export function verifyJwtToken(token: string): any {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
