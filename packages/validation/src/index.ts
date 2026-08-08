import { z } from "zod";

// Shared validation schemas for the MoneyFlow application

export const emailSchema = z.string().email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

export const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const transactionSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  method: z.string().min(1, "Method is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  note: z.string().optional(),
  attachment: z.string().optional(),
  transactionType: z.enum(["income", "expense"]),
});

export const budgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  limit: z.number().positive("Limit must be greater than 0"),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
  note: z.string().optional(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: passwordSchema,
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  photoURL: z.string().url().optional(),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: passwordSchema,
});

export const creditsSchema = z.object({
  credits: z.number().int().min(1, "Credits must be at least 1"),
});

export const transactionStatusSchema = z.object({
  isTransactionAllowed: z.boolean(),
});
