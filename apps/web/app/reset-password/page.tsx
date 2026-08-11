"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTheme } from "@/app/context/ThemeContext";
import { LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type ResetInputs = {
  newPassword: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
    } else {
      setIsValidToken(true);
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetInputs>();

  const onSubmit: SubmitHandler<ResetInputs> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post(`/api/reset-password`, {
        token,
        newPassword: data.newPassword,
      });

      toast.success("Password reset successful");
      router.push("/login");
    } catch (error: unknown) {
      console.error(error);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = error instanceof Error && 'response' in error ? (error as any).response?.data?.message : "Something went wrong";
      toast.error(message);
    }
  };

  if (isValidToken === null) {
    return (
      <div className={`flex min-h-screen items-center justify-center transition-colors ${isDark ? "bg-neutral-950" : "bg-white"}`}>
        <div className="text-center">
          <p className={isDark ? "text-white" : "text-black"}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className={`flex min-h-screen items-center justify-center p-4 transition-colors ${isDark ? "bg-neutral-950" : "bg-white"}`}>
        <div className={`w-full max-w-md rounded-2xl p-8 shadow-sm border text-center transition-colors ${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200/50"}`}>
          <h3 className={`text-2xl font-bold mb-4 transition-colors ${isDark ? "text-white" : "text-black"}`}>Invalid Link</h3>
          <p className={`text-sm mb-6 transition-colors ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            The reset link is invalid or expired.
          </p>
          <button
            onClick={() => router.push("/forgot-password")}
            className={`rounded-lg border px-4 py-2 font-medium transition-all ${
              isDark
                ? "border-neutral-300 bg-white text-black hover:bg-neutral-100"
                : "border-neutral-700 bg-black text-white hover:bg-neutral-900"
            }`}
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen items-center justify-center p-4 transition-colors ${isDark ? "bg-neutral-950" : "bg-white"}`}>
      <div className={`w-full max-w-md rounded-2xl p-8 shadow-sm border transition-colors ${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200/50"}`}>
        {/* Header */}
        <div className="mb-8 text-center">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4 transition-colors ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
            <LuLock className={`h-8 w-8 transition-colors ${isDark ? "text-neutral-300" : "text-neutral-700"}`} />
          </div>
          <h3 className={`text-2xl font-bold transition-colors ${isDark ? "text-white" : "text-black"}`}>Reset Password</h3>
          <p className={`mt-2 text-sm transition-colors ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* New Password Field */}
          <div>
            <label className={`mb-1.5 block text-sm font-medium transition-colors ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
              New Password
            </label>
            <div className="relative">
              <input
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters required",
                  },
                })}
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full rounded-lg border px-4 py-2.5 pr-10 outline-none transition-all ${
                  isDark
                    ? `bg-neutral-800 text-white placeholder:text-neutral-500 ${
                        errors.newPassword
                          ? "border-red-500 focus:ring-red-600/50"
                          : "border-neutral-700 focus:ring-neutral-600/50 focus:border-neutral-600"
                      }`
                    : `bg-white text-black placeholder:text-neutral-400 ${
                        errors.newPassword
                          ? "border-red-500 focus:ring-red-600/50"
                          : "border-neutral-200 focus:ring-neutral-400/50 focus:border-neutral-400"
                      }`
                } focus:ring-1`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                {showNewPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <span className="mt-1 text-xs text-red-500 font-medium">
                {errors.newPassword.message}
              </span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className={`mb-1.5 block text-sm font-medium transition-colors ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === watch("newPassword") || "Passwords do not match",
                })}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full rounded-lg border px-4 py-2.5 pr-10 outline-none transition-all ${
                  isDark
                    ? `bg-neutral-800 text-white placeholder:text-neutral-500 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-600/50"
                          : "border-neutral-700 focus:ring-neutral-600/50 focus:border-neutral-600"
                      }`
                    : `bg-white text-black placeholder:text-neutral-400 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-600/50"
                          : "border-neutral-200 focus:ring-neutral-400/50 focus:border-neutral-400"
                      }`
                } focus:ring-1`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                {showConfirmPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="mt-1 text-xs text-red-500 font-medium">
                {errors.confirmPassword.message}
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
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;