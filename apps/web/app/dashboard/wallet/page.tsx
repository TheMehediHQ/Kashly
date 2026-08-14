"use client";

import React, { useEffect, useState, useCallback } from "react";
import { FiRefreshCw, FiArchive } from "react-icons/fi";
import Link from "next/link";
import axios from "axios";

import MainBalance from "./components/MainBalance";
import TransactionModal from "./components/TransactionModal";
import TransactionHistory from "./components/TransactionHistory";
import LastMonthIncome from "./components/LastMonthIncome";
import LastMonthExpense from "./components/LastMonthExpense";
import BudgetOverview from "./components/BudgetOverview";

type Summary = {
  thisMonthIncome: number;
  thisMonthExpense: number;
  incomeTransactions: number;
  expenseTransactions: number;
};

const Wallet = () => {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [summary, setSummary] = useState<Summary>({
    thisMonthIncome: 0,
    thisMonthExpense: 0,
    incomeTransactions: 0,
    expenseTransactions: 0,
  });

  const handleRefresh = useCallback((): void => {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
  }, []);

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);

    try {
      const res = await axios.get("/api/summary", {
        withCredentials: true,
      });

      if (res.data?.success && res.data?.data) {
        setSummary(res.data.data);
      }
    } catch (error) {
      console.error("Summary fetch error:", error);
    } finally {
      setSummaryLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary, refreshKey]);

  return (
    <div className="min-h-screen w-full space-y-6 bg-[#0B0F17] p-3 text-white sm:space-y-8 sm:p-6 lg:p-8">

      {/* =========================
          HEADER
      ========================== */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">

        {/* Header Content */}
        <div>
          <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#BDFE00]/20 bg-[#BDFE00]/10 px-3 py-1 text-xs font-mono tracking-wide text-[#BDFE00]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#BDFE00]" />
            FINANCIAL OVERVIEW
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
            Wallet &amp; Cash Flow
          </h1>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Monitor real-time balance, log income and expenses, and review
            recent activity.
          </p>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">

          {/* Budgets */}
          <Link
            href="/dashboard/budgets"
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-300 shadow-sm transition-all hover:bg-white/10 hover:text-white active:scale-95"
            title="View budget history"
          >
            <FiArchive className="h-4 w-4 text-[#BDFE00]" />
            <span>Budgets</span>
          </Link>

          {/* Refresh */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 shadow-sm transition-all hover:bg-white/10 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh"
          >
            <FiRefreshCw
              className={`h-4 w-4 ${
                isRefreshing
                  ? "animate-spin text-[#BDFE00]"
                  : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* =========================
          MAIN BALANCE
      ========================== */}
      <div className="w-full">
        <MainBalance refreshKey={refreshKey} />
      </div>

      {/* =========================
          TRANSACTION ACTIONS
      ========================== */}
     <div className="border-b border-white/10 pb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  {/* Left: Title */}
  <div>
    <h2 className="text-2xl font-bold text-white">
      Monthly Cash Flow
    </h2>

    <p className="mt-0.5 text-xs text-slate-400">
      Active spending and earning flow for current month
    </p>
  </div>

  {/* Right: Actions */}
  <div className="flex flex-wrap items-center gap-3 sm:justify-end ">
    <TransactionModal
      type="income"
      onSuccess={handleRefresh}
    />

    <TransactionModal
      type="expense"
      onSuccess={handleRefresh}
    />
  </div>
</div>

      {/* =========================
          INCOME & EXPENSE OVERVIEW
      ========================== */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <LastMonthIncome
          income={summary?.thisMonthIncome}
          count={summary?.incomeTransactions}
          loading={summaryLoading}
        />

        <LastMonthExpense
          expense={summary?.thisMonthExpense}
          count={summary?.expenseTransactions}
          loading={summaryLoading}
        />

      </div>

      {/* =========================
          BUDGET OVERVIEW
      ========================== */}
      <div className="w-full">
        <BudgetOverview refreshKey={refreshKey} />
      </div>

      {/* =========================
          TRANSACTION HISTORY
      ========================== */}
      <div className="w-full pt-2">
        <TransactionHistory
          refreshKey={refreshKey}
          onRefresh={handleRefresh}
        />
      </div>

    </div>
  );
};

export default Wallet;