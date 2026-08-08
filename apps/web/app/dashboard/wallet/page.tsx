/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { FiRefreshCw, FiArchive } from "react-icons/fi";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";
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
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/summary`,
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
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`}>
                Wallet
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/budgets"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-slate-900 text-slate-400 hover:text-slate-200"
                    : "hover:bg-slate-100 text-slate-600 hover:text-slate-800"
                }`}
                title="View budget history"
              >
                <FiArchive className="w-5 h-5" />
              </Link>
              <button
                onClick={handleRefresh}
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${isDark ? "hover:bg-slate-900 text-slate-400" : "hover:bg-slate-100 text-slate-600"}`}
                title="Refresh"
              >
                <FiRefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Balance */}
          <div className="mb-8">
            <MainBalance refreshKey={refreshKey} onRefresh={handleRefresh} />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <TransactionModal type="income" onSuccess={handleRefresh} />
            <TransactionModal type="expense" onSuccess={handleRefresh} />
          </div>

          {/* Income and Expense Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
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

          {/* Budget Overview */}
          <div className="mb-8">
            <BudgetOverview refreshKey={refreshKey} />
          </div>

          {/* Transactions */}
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
