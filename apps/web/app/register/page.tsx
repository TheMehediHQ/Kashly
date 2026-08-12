"use client";

import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LuLoader, LuEye, LuEyeOff } from "react-icons/lu";
import { useState } from "react";
import toast from "react-hot-toast";

type Inputs = {
  fullName: string;
  email: string;
  password: string;
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await axios.post(`/api/register`, data);

      toast.success(
        "Registration successful. Check your email to verify your account."
      );

      reset();
      router.push("/login");
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ??
          "Registration failed. Please try again.")
        : "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0B0F17] text-white">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/40 border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
            KASHLY AUTHENTICATION
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create Account
          </h1>
          <p className="text-sm text-slate-400">
            Sign up to get started with Kashly today.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-300">
              Full Name
            </label>
            <input
              {...register("fullName", { required: "Full name is required" })}
              type="text"
              placeholder="John Doe"
              className={`w-full rounded-xl border px-4 py-3 text-sm text-white placeholder:text-slate-500 bg-white/5 outline-none transition-colors ${
                errors.fullName
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-white/10 focus:border-[#BDFE00]/60"
              }`}
            />
            {errors.fullName && (
              <span className="mt-1.5 block text-xs text-rose-400 font-medium">
                {errors.fullName.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-300">
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="you@example.com"
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

          {/* Password */}
          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters required",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-white placeholder:text-slate-500 bg-white/5 outline-none transition-colors ${
                  errors.password
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-white/10 focus:border-[#BDFE00]/60"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="mt-1.5 block text-xs text-rose-400 font-medium">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full flex justify-center py-3 px-4 rounded-xl bg-[#BDFE00] text-sm font-semibold text-black transition-all hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <LuLoader className="animate-spin h-5 w-5" />
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
              OR
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#BDFE00] hover:underline transition-all"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;