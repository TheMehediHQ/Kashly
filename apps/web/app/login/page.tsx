/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { LuEye, LuEyeOff } from "react-icons/lu";

type LoginInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const res = await axios.post(
        `/api/login`,
        data,
        {
          withCredentials: true,
        },
      );

      toast.success("Login successful");

      if (res?.data?.user) {
        setUser(res.data.user);
      }

      reset();

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0B0F17] text-white">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/40 border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
            NEXVIBE AUTHENTICATION
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-400">
            Please enter your credentials to access your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
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

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-mono text-[#BDFE00] hover:underline transition-all"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#BDFE00] py-3 text-sm font-semibold text-black transition-all hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
              OR
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Footer Link */}
          <p className="text-center text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#BDFE00] hover:underline transition-all"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;