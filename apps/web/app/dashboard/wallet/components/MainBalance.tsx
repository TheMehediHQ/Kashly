"use client";

import React, { useEffect, useState, useCallback } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import TransactionModal from "./TransactionModal"; // Path প্রয়োজন অনুযায়ী ঠিক করে নিন

type Balance = {
  income: number;
  expense: number;
  balance: number;
};

interface MainBalanceProps {
  refreshKey: number;
  onRefresh?: () => void;
}

const MainBalance: React.FC<MainBalanceProps> = ({ refreshKey, onRefresh }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Balance>({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/balance", {
        withCredentials: true,
      });

      if (res.data) {
        setData({
          income: typeof res.data.income === "number" ? res.data.income : 0,
          expense: typeof res.data.expense === "number" ? res.data.expense : 0,
          balance: typeof res.data.balance === "number" ? res.data.balance : 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch balance data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, refreshKey]);

  // Modal সফলভাবে কাজ করলে রিফ্রেশ করার জন্য
  const handleModalSuccess = () => {
    fetchBalance();
    if (onRefresh) onRefresh();
  };

  return (
    <div className="relative w-full rounded-2xl p-6 sm:p-8 border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl overflow-hidden transition-all">
      <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
        
        {/* Left Section: Badge & Amount */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00]">
            <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
            NET BALANCE
          </div>

          <div>
            {loading ? (
              <div className="flex items-baseline gap-2 py-2">
                <div className="h-6 w-6 rounded bg-white/10 animate-pulse" />
                <div className="h-12 sm:h-16 w-56 sm:w-72 rounded-2xl bg-white/10 animate-pulse" />
                <div className="h-5 w-12 rounded bg-white/5 animate-pulse" />
              </div>
            ) : (
              <div className="flex items-baseline gap-2 font-mono select-none">
                <span className="text-2xl sm:text-3xl font-bold text-[#BDFE00]">
                  ৳
                </span>
                <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                  {isVisible ? data.balance.toLocaleString("en-BD") : "••••••••"}
                </h2>
                <span className="text-sm font-semibold text-slate-400">
                  BDT
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Action Buttons & Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Add Income & Add Expense Modals */}
          <TransactionModal type="income" onSuccess={handleModalSuccess} />
          <TransactionModal type="expense" onSuccess={handleModalSuccess} />

          {/* Eye Toggle Icon Button */}
          {!loading && (
            <button
              type="button"
              onClick={() => setIsVisible((prev) => !prev)}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#BDFE00]/30"
              title={isVisible ? "Hide Balance" : "Show Balance"}
            >
              {isVisible ? (
                <FiEyeOff className="w-4 h-4 text-[#BDFE00]" />
              ) : (
                <FiEye className="w-4 h-4 text-[#BDFE00]" />
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default MainBalance;