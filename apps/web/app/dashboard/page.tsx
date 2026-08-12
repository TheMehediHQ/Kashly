"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { LuWallet, LuChartPie } from "react-icons/lu";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00]">
              <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
              KASHLY DASHBOARD
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="text-[#BDFE00]">{user?.fullName || "Developer"}</span>! 👋
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto">
              Monitor real-time cash flow, manage budgets, and maintain complete financial clarity.
            </p>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto pt-4">
            {/* Wallet Card */}
            <Link
              href="/dashboard/wallet"
              className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-[#BDFE00]/50 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1 text-left relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-[#BDFE00]/10 flex items-center justify-center text-[#BDFE00] mb-5 group-hover:scale-110 transition-transform">
                <LuWallet size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#BDFE00] transition-colors">
                Wallet
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                View real-time balances, income, and detailed transaction activity.
              </p>
            </Link>

            {/* Budgets Card */}
            <Link
              href="/dashboard/budgets"
              className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-[#BDFE00]/50 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1 text-left relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1FBFD8]/10 flex items-center justify-center text-[#1FBFD8] mb-5 group-hover:scale-110 transition-transform">
                <LuChartPie size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#1FBFD8] transition-colors">
                Budgets
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Define spending targets and ensure discipline across monthly limits.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;