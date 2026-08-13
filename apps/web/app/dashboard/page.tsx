/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  LuWallet,
  LuTrendingUp,
  LuTrendingDown,
  LuArrowRight,
  LuClock,
  LuCreditCard,
  LuShield,
  LuZap,
} from "react-icons/lu";
import { IoWallet } from "react-icons/io5";

type Summary = {
  thisMonthIncome: number;
  thisMonthExpense: number;
  incomeTransactions: number;
  expenseTransactions: number;
};

type Balance = {
  balance: number;
};

type Transaction = {
  _id: string;
  amount: number;
  category: string;
  transactionType: "income" | "expense";
  date: string;
  note: string;
  createdAt: string;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Summary>({
    thisMonthIncome: 0,
    thisMonthExpense: 0,
    incomeTransactions: 0,
    expenseTransactions: 0,
  });
  const [balance, setBalance] = useState<Balance>({ balance: 0 });
  const [recentTxns, setRecentTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, balanceRes, txnsRes] = await Promise.all([
          axios.get("/api/summary"),
          axios.get("/api/balance"),
          axios.get("/api/transactions?limit=5"),
        ]);

        if (summaryRes.data?.data) setSummary(summaryRes.data.data);
        if (balanceRes.data) setBalance(balanceRes.data);
        if (txnsRes.data?.data) setRecentTxns(txnsRes.data.data);
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(amount);

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full min-h-screen p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
            DASHBOARD OVERVIEW
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Welcome back,{" "}
            <span className="text-[#BDFE00]">{user?.fullName || "User"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here&apos;s your financial summary for {currentMonth} {currentYear}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/wallet"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#BDFE00] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] transition-all active:scale-95"
          >
            <LuZap size={14} />
            New Transaction
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#BDFE00]/10 via-slate-900/60 to-slate-900/40 border border-[#BDFE00]/20 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Total Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#BDFE00]/10 flex items-center justify-center text-[#BDFE00]">
              <IoWallet size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {loading ? "—" : formatCurrency(balance.balance)}
          </p>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            All time net balance
          </p>
        </div>

        {/* Income */}
        <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Monthly Income
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <LuTrendingUp size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            {loading ? "—" : formatCurrency(summary.thisMonthIncome)}
          </p>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            {summary.incomeTransactions} transactions
          </p>
        </div>

        {/* Expense */}
        <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Monthly Expense
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <LuTrendingDown size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
            {loading ? "—" : formatCurrency(summary.thisMonthExpense)}
          </p>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            {summary.expenseTransactions} transactions
          </p>
        </div>

        {/* Credits */}
        <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Credits Left
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#1FBFD8]/10 flex items-center justify-center text-[#1FBFD8]">
              <LuCreditCard size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#1FBFD8] tracking-tight">
            {loading ? "—" : (user?.credits ?? 0)}
          </p>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            {user?.credits < 50 ? "Running low — contact admin" : "Per txn: 1 credit"}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <LuClock size={16} className="text-[#BDFE00]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Recent Transactions
              </h2>
            </div>
            <Link
              href="/dashboard/wallet"
              className="text-xs text-[#BDFE00] hover:underline font-mono flex items-center gap-1"
            >
              View all <LuArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                  <div className="h-10 w-10 rounded-xl bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 rounded bg-white/5" />
                    <div className="h-2 w-16 rounded bg-white/5" />
                  </div>
                  <div className="h-4 w-20 rounded bg-white/5" />
                </div>
              ))
            ) : recentTxns.length > 0 ? (
              recentTxns.map((txn) => (
                <div
                  key={txn._id}
                  className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                      txn.transactionType === "income"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {txn.transactionType === "income" ? (
                      <LuTrendingUp size={18} />
                    ) : (
                      <LuTrendingDown size={18} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {txn.category}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {txn.date}
                    </p>
                  </div>
                  <p
                    className={`text-sm font-bold font-mono ${
                      txn.transactionType === "income"
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {txn.transactionType === "income" ? "+" : "-"}
                    {formatCurrency(txn.amount)}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <LuWallet size={32} className="mx-auto text-slate-600 mb-3" />
                <p className="text-sm text-slate-400">No transactions yet</p>
                <Link
                  href="/dashboard/wallet"
                  className="text-xs text-[#BDFE00] hover:underline mt-2 inline-block"
                >
                  Add your first transaction
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <LuZap size={14} className="text-[#BDFE00]" />
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                href="/dashboard/wallet"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#BDFE00]/30 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <LuTrendingUp size={14} />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  Add Income
                </span>
              </Link>
              <Link
                href="/dashboard/wallet"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#BDFE00]/30 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                  <LuTrendingDown size={14} />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  Add Expense
                </span>
              </Link>
              <Link
                href="/dashboard/budgets"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#BDFE00]/30 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#1FBFD8]/10 flex items-center justify-center text-[#1FBFD8] group-hover:scale-110 transition-transform">
                  <LuWallet size={14} />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  Set Budget
                </span>
              </Link>
            </div>
          </div>

          {/* Account Info */}
          <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <LuShield size={14} className="text-[#BDFE00]" />
              Account
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Role</span>
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                    user?.role === "admin"
                      ? "bg-[#1FBFD8]/10 text-[#1FBFD8] border border-[#1FBFD8]/30"
                      : "bg-white/5 text-slate-400 border border-white/10"
                  }`}
                >
                  {user?.role?.toUpperCase() || "USER"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Email</span>
                <span className="text-xs text-slate-300 font-mono truncate max-w-[140px]">
                  {user?.email || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Status</span>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
