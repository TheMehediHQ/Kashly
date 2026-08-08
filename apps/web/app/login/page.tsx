/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { useAuth } from "@/app/context/AuthContext";
import { LuEye, LuEyeOff } from "react-icons/lu";

type LoginInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const { effectiveTheme } = useTheme();
  const { setUser } = useAuth();
  const isDark = effectiveTheme === "dark";
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`,
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
    <div className={`flex min-h-screen items-center justify-center p-4 transition-colors ${isDark ? "bg-neutral-950" : "bg-white"}`}>
      <div className={`w-full max-w-md rounded-2xl p-8 shadow-sm border transition-colors ${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200/50"}`}>
        {/* Header */}
        <div className="mb-8 text-center">
          <h3 className={`text-2xl font-bold transition-colors ${isDark ? "text-white" : "text-black"}`}>Welcome Back</h3>
          <p className={`text-sm mt-1 transition-colors ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Please enter your details to login
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
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="you@example.com"
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

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-medium transition-colors ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                Password
              </label>
            </div>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full rounded-lg border px-4 py-2.5 pr-10 outline-none transition-all ${
                  isDark
                    ? `bg-neutral-800 text-white placeholder:text-neutral-500 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-600/50"
                          : "border-neutral-700 focus:ring-neutral-600/50 focus:border-neutral-600"
                      }`
                    : `bg-white text-black placeholder:text-neutral-400 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-600/50"
                          : "border-neutral-200 focus:ring-neutral-400/50 focus:border-neutral-400"
                      }`
                } focus:ring-1`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="mt-1 text-xs text-red-500 font-medium">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className={`text-sm font-medium underline-offset-4 hover:underline transition-colors ${
                isDark
                  ? "text-neutral-400 hover:text-neutral-300"
                  : "text-neutral-600 hover:text-neutral-700"
              }`}
            >
              Forgot password?
            </Link>
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
            {isSubmitting ? "Signing in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className={`h-px flex-1 transition-colors ${isDark ? "bg-neutral-700" : "bg-neutral-200"}`}></div>
            <span className={`text-xs uppercase font-medium transition-colors ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
              or
            </span>
            <div className={`h-px flex-1 transition-colors ${isDark ? "bg-neutral-700" : "bg-neutral-200"}`}></div>
          </div>

          {/* Footer Link */}
          <p className={`text-center text-sm transition-colors ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className={`font-medium underline-offset-4 hover:underline transition-colors ${
                isDark
                  ? "text-white hover:text-neutral-300"
                  : "text-black hover:text-neutral-700"
              }`}
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
