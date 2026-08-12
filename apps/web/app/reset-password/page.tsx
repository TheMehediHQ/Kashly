"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type ResetInputs = {
  newPassword: string;
  confirmPassword: string;
};

const ResetPassword = () => {
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
      const message =
        error instanceof Error && "response" in error
          ? (error as any).response?.data?.message
          : "Something went wrong";
      toast.error(message);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F17] text-white">
        <div className="text-center font-mono">
          <p className="text-slate-400">Verifying security token...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-[#0B0F17] text-white">
        <div className="w-full max-w-md rounded-3xl bg-slate-900/40 border border-white/10 p-8 shadow-2xl backdrop-blur-xl text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <LuLock className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Invalid or Expired Link
          </h1>
          <p className="text-sm text-slate-400">
            The password reset link is invalid or has expired. Please request a new link.
          </p>
          <button
            onClick={() => router.push("/forgot-password")}
            className="w-full rounded-xl bg-[#BDFE00] py-3 text-sm font-semibold text-black transition-all hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] active:scale-95 cursor-pointer mt-2"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0B0F17] text-white">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/40 border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-8 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-[#BDFE00]">
            <LuLock className="h-7 w-7" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00]">
            <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
            PASSWORD RESET
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Reset Password
          </h1>
          <p className="text-sm text-slate-400">
            Create a new secure password for your NexVibe account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* New Password Field */}
          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-300">
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
                className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-white placeholder:text-slate-500 bg-white/5 outline-none transition-colors ${
                  errors.newPassword
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-white/10 focus:border-[#BDFE00]/60"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {showNewPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <span className="mt-1.5 block text-xs text-rose-400 font-medium">
                {errors.newPassword.message}
              </span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-300">
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-white placeholder:text-slate-500 bg-white/5 outline-none transition-colors ${
                  errors.confirmPassword
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-white/10 focus:border-[#BDFE00]/60"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="mt-1.5 block text-xs text-rose-400 font-medium">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#BDFE00] py-3 text-sm font-semibold text-black transition-all hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;