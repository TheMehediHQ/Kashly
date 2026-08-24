"use client";

import React from "react";
import Link from "next/link";
import { LuHouse, LuArrowLeft, LuSearch } from "react-icons/lu";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F17] text-white p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#BDFE00]/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-rose-500/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-[150px] sm:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center backdrop-blur-xl">
              <LuSearch className="w-16 h-16 sm:w-20 sm:h-20 text-rose-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-mono tracking-wide text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            PAGE NOT FOUND
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Oops! Page Lost in Space
          </h2>

          <p className="text-base sm:text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#BDFE00] text-black font-semibold hover:bg-[#aef000] hover:shadow-[0_0_25px_rgba(189,254,0,0.4)] transition-all duration-300 transform active:scale-95"
          >
            <LuHouse className="w-5 h-5" />
            <span>Go Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 hover:border-white/20 font-medium backdrop-blur-md transition-all duration-300 transform active:scale-95"
          >
            <LuArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-xs text-slate-500 mb-4 font-mono uppercase tracking-wider">
            Quick Links
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-slate-400 hover:text-[#BDFE00] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/wallet"
              className="text-sm text-slate-400 hover:text-[#BDFE00] transition-colors"
            >
              Wallet
            </Link>
            <Link
              href="/dashboard/budgets"
              className="text-sm text-slate-400 hover:text-[#BDFE00] transition-colors"
            >
              Budgets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
