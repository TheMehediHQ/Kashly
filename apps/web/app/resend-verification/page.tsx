"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useTheme } from "@/app/context/ThemeContext";
import { LuMail } from "react-icons/lu";

export default function ResendVerificationPage() {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";

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
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axios.post(`${API_URL}/api/resend-verification`, {
        email: email.trim(),
      });

      setMessage(response.data?.message || "If the account is unverified, we sent a new link.");
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
    <div className={`flex min-h-screen items-center justify-center p-4 transition-colors ${isDark ? "bg-neutral-950" : "bg-white"}`}>
      <div className={`w-full max-w-md rounded-2xl p-8 shadow-sm border transition-colors ${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200/50"}`}>
        <div className="mb-8 text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
            <LuMail className={`h-8 w-8 ${isDark ? "text-neutral-300" : "text-neutral-700"}`} />
          </div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>Resend Verification</h1>
          <p className={`mt-2 text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Enter your email and we will send a new verification link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`mb-1.5 block text-sm font-medium ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full rounded-lg border px-4 py-2.5 outline-none transition-all focus:ring-1 ${
                isDark
                  ? "bg-neutral-800 text-white placeholder:text-neutral-500 border-neutral-700 focus:ring-neutral-600/50 focus:border-neutral-600"
                  : "bg-white text-black placeholder:text-neutral-400 border-neutral-200 focus:ring-neutral-400/50 focus:border-neutral-400"
              }`}
            />
          </div>

          {message && (
            <p className={`rounded-lg border px-3 py-2 text-sm ${isDark ? "border-emerald-900 bg-emerald-950/40 text-emerald-300" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
              {message}
            </p>
          )}

          {error && (
            <p className={`rounded-lg border px-3 py-2 text-sm ${isDark ? "border-red-900 bg-red-950/40 text-red-300" : "border-red-200 bg-red-50 text-red-700"}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-lg py-2.5 font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
              isDark
                ? "bg-white text-black hover:bg-neutral-100"
                : "bg-black text-white hover:bg-neutral-900"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Verification Link"}
          </button>

          <p className={`text-center text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Back to{" "}
            <Link
              href="/login"
              className={`font-medium underline-offset-4 hover:underline ${
                isDark ? "text-white hover:text-neutral-300" : "text-black hover:text-neutral-700"
              }`}
            >
              login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
