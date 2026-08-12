/* eslint-disable react-hooks/set-state-in-effect */
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
      const res = await axios.get(`/api/summary`, {
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
    <div className="min-h-screen w-full bg-[#0B0F17] text-white p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
            FINANCIAL OVERVIEW
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Wallet &amp; Cash Flow
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor real-time balance, log income and expenses, and review recent activity.
          </p>
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <Link
            href="/dashboard/budgets"
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer text-xs font-semibold uppercase tracking-wider gap-2 shadow-sm active:scale-95"
            title="View budget history"
          >
            <FiArchive className="h-4 w-4 text-[#BDFE00]" />
            <span>Budgets</span>
          </Link>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            title="Refresh"
          >
            <FiRefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#BDFE00]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="w-full">
        <MainBalance refreshKey={refreshKey} onRefresh={handleRefresh} />
      </div>

      {/* Quick Action Modals (Add Income & Add Expense) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TransactionModal type="income" onSuccess={handleRefresh} />
        <TransactionModal type="expense" onSuccess={handleRefresh} />
      </div>

      {/* Income and Expense Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Budget Overview Widget */}
      <div className="w-full">
        <BudgetOverview refreshKey={refreshKey} />
      </div>

      {/* Transactions History Ledger */}
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