/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { FiRefreshCw, FiArchive } from "react-icons/fi";
import Link from "next/link";
import MainBalance from "./components/MainBalance";
import TransactionModal from "./components/TransactionModal";
import TransactionHistory from "./components/TransactionHistory";
import LastMonthIncome from "./components/LastMonthIncome";
import LastMonthExpense from "./components/LastMonthExpense";
import BudgetOverview from "./components/BudgetOverview";
import axios from "axios";

type Summary = {
  thisMonthIncome: number;
  thisMonthExpense: number;
  incomeTransactions: number;
  expenseTransactions: number;
};

const Wallet = () => {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<Summary>({
    thisMonthIncome: 0,
    thisMonthExpense: 0,
    incomeTransactions: 0,
    expenseTransactions: 0,
  });

  const handleRefresh = (): void => {
    setRefreshKey((prev) => prev + 1);
  };

  const fetchSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await axios.get(
        `/api/summary`,
        {
          withCredentials: true,
        },
      );

      if (res.data?.success && res.data?.data) {
        setSummary(res.data.data);
      }
    } catch (error) {
      console.error("Summary fetch error:", error);
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [refreshKey]);

  return (
    <div className="w-full min-h-screen text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
              FINANCIAL OVERVIEW
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Wallet & Cash Flow
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Monitor real-time balance, log income and expenses, and review recent activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/budgets"
              className="inline-flex items-center justify-center h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium gap-2"
              title="View budget history"
            >
              <FiArchive className="w-4 h-4 text-[#BDFE00]" />
              <span className="hidden sm:inline">Budgets</span>
            </Link>

            <button
              onClick={handleRefresh}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Refresh Wallet Data"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Balance Card */}
        <div className="w-full">
          <MainBalance refreshKey={refreshKey} onRefresh={handleRefresh} />
        </div>

        {/* Action Trigger Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <TransactionModal type="income" onSuccess={handleRefresh} />
          <TransactionModal type="expense" onSuccess={handleRefresh} />
        </div>

        {/* Income and Expense Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

        {/* Recent Transactions Table / History */}
        <div className="w-full">
          <TransactionHistory
            refreshKey={refreshKey}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
};

export default Wallet;