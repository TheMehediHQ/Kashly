/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { LuMail } from "react-icons/lu";
import toast from "react-hot-toast";

type ForgotInputs = {
  email: string;
};

const ForgotPassword = () => {
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

      const message =
        error instanceof Error && "response" in error
          ? (error as any).response?.data?.message
          : "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0B0F17] text-white">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/40 border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-8 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-[#BDFE00]">
            <LuMail className="h-7 w-7" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00]">
            <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
            PASSWORD RECOVERY
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Forgot Password?
          </h1>
          <p className="text-sm text-slate-400">
            Enter your email address to receive a secure password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-300">
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
              className={`w-full rounded-xl border px-4 py-3 text-sm text-white placeholder:text-slate-500 bg-white/5 outline-none transition-colors ${
                errors.email
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-white/10 focus:border-[#BDFE00]/60"
              }`}
            />
            {errors.email && (
              <span className="mt-1.5 block text-xs text-rose-400 font-medium">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#BDFE00] py-3 text-sm font-semibold text-black transition-all hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Sending Link..." : "Send Reset Link"}
          </button>

          {/* Back to Login */}
          <p className="text-center text-xs text-slate-400">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-[#BDFE00] hover:underline transition-all"
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