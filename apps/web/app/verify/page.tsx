"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import axios from "axios";
import { LuLoader, LuCheck, LuTriangleAlert } from "react-icons/lu";
import { HiArrowRight } from "react-icons/hi2";

function VerifyContent() {
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0B0F17] text-white">
      <div className="max-w-md w-full rounded-3xl bg-slate-900/40 border border-white/10 p-8 sm:p-10 text-center shadow-2xl backdrop-blur-xl">
        {/* Logo */}
        <div className="mb-6">
          <Image src="/file.svg" alt="Finance App Logo" width={60} height={60} className="mx-auto" />
        </div>

        {/* State: Verifying */}
        {status === "verifying" && (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative flex items-center justify-center">
              {/* Outer spinning ring */}
              <div className="h-16 w-16 rounded-full border-4 border-white/10 border-t-[#BDFE00] animate-spin" />
              {/* Inner pulsing loader icon */}
              <LuLoader className="h-6 w-6 absolute animate-pulse text-[#BDFE00]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
                VERIFYING LINK
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Verifying Identity
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Please wait while we securely process your verification link.
              </p>
            </div>
          </div>
        )}

        {/* State: Success */}
        {status === "success" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-[#BDFE00] mb-6">
              <LuCheck className="h-8 w-8" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-3">
              ACCOUNT CONFIRMED
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Email Verified
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Your email has been verified. Redirecting you to login automatically...
            </p>
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                onClick={() => router.push("/login")}
                className="group inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-xl bg-[#BDFE00] text-black hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] transition-all cursor-pointer"
              >
                Go to Login
                <HiArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* State: Error */}
        {status === "error" && (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6">
              <LuTriangleAlert className="h-8 w-8" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-mono tracking-wide text-rose-400 mb-3">
              VERIFICATION FAILED
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Link Expired or Invalid
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              The link is invalid or has expired. Please request a new link to continue.
            </p>
            <div className="mt-8">
              <button
                onClick={() => router.push("/resend-verification")}
                className="w-full py-3 px-4 text-sm font-semibold rounded-xl bg-[#BDFE00] text-black hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] transition-all active:scale-95 cursor-pointer"
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
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0B0F17]">
          <div className="h-10 w-10 rounded-full border-4 border-white/10 border-t-[#BDFE00] animate-spin" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}