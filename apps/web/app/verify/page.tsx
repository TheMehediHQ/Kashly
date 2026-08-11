"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import axios from "axios";
import { LuLoader, LuCheck, LuTriangleAlert } from "react-icons/lu";
import { HiArrowRight } from "react-icons/hi2";
import { useTheme } from "@/app/context/ThemeContext";

function VerifyContent() {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  
  const params = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const hasCalled = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = params.get("token");

      if (!token) {
        setStatus("error");
        return;
      }

      try {
        await axios.get(`/api/verify?token=${token}`);

        setStatus("success");

        const timeout = setTimeout(() => {
          router.push("/login");
        }, 4000);

        return () => clearTimeout(timeout);
      } catch (err) {
        setStatus("error");
      }
    };

    if (!hasCalled.current) {
      verifyToken();
      hasCalled.current = true;
    }
  }, [params, router]);

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 font-sans transition-colors ${isDark ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"}`}>
      <div className={`max-w-md w-full rounded-3xl shadow-sm p-10 text-center border transition-colors ${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200/50"}`}>
        {/* Logo */}
        <div className="mb-6">
          <Image src="/file.svg" alt="Finance App Logo" width={60} height={60} className="mx-auto" />
        </div>
        {/* State: Verifying */}
        {status === "verifying" && (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative flex items-center justify-center">
              {/* Outer spinning ring */}
              <div className={`h-16 w-16 rounded-full border-4 animate-spin ${isDark ? "border-neutral-700 border-t-white" : "border-neutral-200 border-t-black"}`} />
              {/* Inner pulsing loader icon */}
              <LuLoader className={`h-6 w-6 absolute animate-pulse ${isDark ? "text-white" : "text-black"}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold tracking-tight transition-colors ${isDark ? "text-white" : "text-neutral-900"}`}>
                Verifying Identity
              </h2>
              <p className={`mt-2 leading-relaxed transition-colors ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Please wait while we securely process your verification link.
              </p>
            </div>
          </div>
        )}

        {/* State: Success */}
        {status === "success" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full mb-6 border ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-neutral-50 border-neutral-200"}`}>
              <LuCheck className={`h-10 w-10 transition-colors ${isDark ? "text-neutral-300" : "text-neutral-700"}`} />
            </div>
            <h2 className={`text-2xl font-bold tracking-tight transition-colors ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
              Email Verified
            </h2>
            <p className={`mt-3 leading-relaxed transition-colors ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              Account confirmed. Redirecting you to the login screen now.
            </p>
            <div className={`mt-8 pt-6 border-t transition-colors ${isDark ? "border-neutral-800" : "border-neutral-200/50"}`}>
              <button
                onClick={() => router.push("/login")}
                className={`group inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isDark
                    ? "bg-black text-white hover:bg-neutral-800"
                    : "bg-white text-black hover:bg-neutral-50"
                }`}
              >
                Go to Login
                <HiArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* State: Error */}
        {status === "error" && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full mb-6 border ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-neutral-50 border-neutral-200"}`}>
              <LuTriangleAlert className={`h-10 w-10 transition-colors ${isDark ? "text-neutral-300" : "text-neutral-700"}`} />
            </div>
            <h2 className={`text-2xl font-bold tracking-tight transition-colors ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
              Verification Error
            </h2>
            <p className={`mt-3 leading-relaxed transition-colors ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              The link is invalid or has expired. Please request a new link to
              continue.
            </p>
            <div className="mt-8 space-y-3">
              <button
                onClick={() => router.push("/resend-verification")}
                className={`w-full py-3.5 px-4 font-semibold rounded-xl border transition-all active:scale-[0.98] ${
                  isDark
                    ? "bg-white text-black hover:bg-neutral-100 border-neutral-200"
                    : "bg-black text-white hover:bg-neutral-900 border-neutral-800"
                }`}
              >
                Request New Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  
  return (
    <Suspense
      fallback={
        <div className={`min-h-screen flex items-center justify-center transition-colors ${isDark ? "bg-neutral-950" : "bg-white"}`}>
          <div className={`h-10 w-10 rounded-full border-4 animate-spin ${isDark ? "border-neutral-700 border-t-white" : "border-neutral-200 border-t-black"}`} />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
