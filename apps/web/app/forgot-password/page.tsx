/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTheme } from "@/app/context/ThemeContext";
import { LuMail } from "react-icons/lu";
import toast from "react-hot-toast";

type ForgotInputs = {
  email: string;
};

const ForgotPassword = () => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotInputs>();

  const onSubmit: SubmitHandler<ForgotInputs> = async (data) => {
    try {
      await axios.post(`/api/forgot-password`, data);

      toast.success("Password reset link sent");

      reset();
    } catch (error: unknown) {
      console.error(error);

      const message = error instanceof Error && 'response' in error ? (error as any).response?.data?.message : "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center p-4 transition-colors ${isDark ? "bg-neutral-950" : "bg-white"}`}>
      <div className={`w-full max-w-md rounded-2xl p-8 shadow-sm border transition-colors ${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200/50"}`}>
        {/* Header */}
        <div className="mb-8 text-center">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4 transition-colors ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
            <LuMail className={`h-8 w-8 transition-colors ${isDark ? "text-neutral-300" : "text-neutral-700"}`} />
          </div>
          <h3 className={`text-2xl font-bold transition-colors ${isDark ? "text-white" : "text-black"}`}>Forgot Password</h3>
          <p className={`mt-2 text-sm transition-colors ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Enter your email to receive a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className={`mb-1.5 block text-sm font-medium transition-colors ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="your@email.com"
              className={`w-full rounded-lg border px-4 py-2.5 outline-none transition-all ${
                isDark
                  ? `bg-neutral-800 text-white placeholder:text-neutral-500 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-600/50"
                        : "border-neutral-700 focus:ring-neutral-600/50 focus:border-neutral-600"
                    }`
                  : `bg-white text-black placeholder:text-neutral-400 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-600/50"
                        : "border-neutral-200 focus:ring-neutral-400/50 focus:border-neutral-400"
                    }`
              } focus:ring-1`}
            />
            {errors.email && (
              <span className="mt-1 text-xs text-red-500 font-medium">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-lg border py-2.5 font-medium transition-all active:transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 ${
              isDark
                ? "border-neutral-300 bg-white text-black hover:bg-neutral-100 focus:ring-neutral-400"
                : "border-neutral-700 bg-black text-white hover:bg-neutral-900 focus:ring-neutral-600"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>

          {/* Back to Login */}
          <p className={`text-center text-sm transition-colors ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Remember your password?{" "}
            <Link
              href="/login"
              className={`font-medium underline-offset-4 hover:underline transition-colors ${
                isDark
                  ? "text-white hover:text-neutral-300"
                  : "text-black hover:text-neutral-700"
              }`}
            >
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;