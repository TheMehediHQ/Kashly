"use client";

import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LuLoader, LuEye, LuEyeOff } from "react-icons/lu";
import { useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import toast from "react-hot-toast";

type Inputs = {
  fullName: string;
  email: string;
  password: string;
};

const Register = () => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
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
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      await axios.post(`${API_URL}/api/register`, data);

      toast.success("Registration successful. Check your email to verify your account.");

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
    <div className={`flex min-h-screen items-center justify-center p-4 transition-colors ${isDark ? "bg-neutral-950" : "bg-white"}`}>
      <div className={`w-full max-w-md rounded-2xl p-8 shadow-sm border transition-colors ${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200/50"}`}>
        {/* Header */}
        <div className="mb-8 text-center">
          <h3 className={`text-2xl font-bold transition-colors ${isDark ? "text-white" : "text-black"}`}>Create Account</h3>
          <p className={`text-sm mt-1 transition-colors ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className={`mb-1.5 block text-sm font-medium transition-colors ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
              Full Name
            </label>
            <input
              {...register("fullName", { required: "Full name is required" })}
              type="text"
              placeholder="John Doe"
              className={`w-full rounded-lg border px-4 py-2.5 outline-none transition-all ${
                isDark
                  ? `bg-neutral-800 text-white placeholder:text-neutral-500 ${
                      errors.fullName
                        ? "border-red-500 focus:ring-red-600/50"
                        : "border-neutral-700 focus:ring-neutral-600/50 focus:border-neutral-600"
                    }`
                  : `bg-white text-black placeholder:text-neutral-400 ${
                      errors.fullName
                        ? "border-red-500 focus:ring-red-600/50"
                        : "border-neutral-200 focus:ring-neutral-400/50 focus:border-neutral-400"
                    }`
              } focus:ring-1`}
            />
            {errors.fullName && (
              <span className="mt-1 text-xs text-red-500">
                {errors.fullName.message}
              </span>
            )}
          </div>

          {/* Email */}
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
              <span className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className={`mb-1.5 block text-sm font-medium transition-colors ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
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
              <span className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`cursor-pointer group relative w-full flex justify-center py-2.5 px-4 border text-sm font-medium rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? "bg-white text-black border-neutral-300 hover:bg-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                : "bg-black text-white border-neutral-700 hover:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-600"
            }`}
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
          <div className="flex items-center gap-4 py-2">
            <div className={`h-px flex-1 transition-colors ${isDark ? "bg-neutral-700" : "bg-gray-200"}`}></div>
            <span className={`text-xs uppercase transition-colors ${isDark ? "text-neutral-500" : "text-gray-400"}`}>or</span>
            <div className={`h-px flex-1 transition-colors ${isDark ? "bg-neutral-700" : "bg-gray-200"}`}></div>
          </div>

          {/* Footer */}
          <p className={`text-center text-sm transition-colors ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
            Already have an account?{" "}
            <Link
              href="/login"
              className={`font-semibold underline-offset-4 hover:underline transition-colors ${
                isDark
                  ? "text-neutral-300 hover:text-neutral-200"
                  : "text-neutral-700 hover:text-neutral-800"
              }`}
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
