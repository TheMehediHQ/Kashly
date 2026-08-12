"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { LuMail } from "react-icons/lu";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(`/api/resend-verification`, {
        email: email.trim(),
      });

      setMessage(
        response.data?.message ||
          "If the account is unverified, we sent a new link."
      );
      setEmail("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setIsSubmitting(false);
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
            VERIFICATION RECOVERY
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Resend Verification
          </h1>
          <p className="text-sm text-slate-400">
            Enter your email and we will send a new verification link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 bg-white/5 outline-none focus:border-[#BDFE00]/60 transition-colors"
            />
          </div>

          {/* Alert Messages */}
          {message && (
            <p className="rounded-xl border border-[#BDFE00]/30 bg-[#BDFE00]/10 px-4 py-3 text-xs font-mono text-[#BDFE00]">
              {message}
            </p>
          )}

          {error && (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-mono text-rose-400">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#BDFE00] py-3 text-sm font-semibold text-black transition-all hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Sending..." : "Send Verification Link"}
          </button>

          {/* Back Link */}
          <p className="text-center text-xs text-slate-400">
            Back to{" "}
            <Link
              href="/login"
              className="font-semibold text-[#BDFE00] hover:underline transition-all"
            >
              login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}