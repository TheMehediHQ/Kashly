"use client";

import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";

type Balance = {
  income: number;
  expense: number;
  balance: number;
};

interface MainBalanceProps {
  refreshKey: number;
  onRefresh: () => void;
}

const MainBalance: React.FC<MainBalanceProps> = ({ refreshKey }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Balance>({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/balance`,
        {
          withCredentials: true,
        },
      );
      setData((prev) => ({
        ...prev,
        income: typeof res.data?.income === "number" ? res.data.income : prev.income,
        expense: typeof res.data?.expense === "number" ? res.data.expense : prev.expense,
        balance: typeof res.data?.balance === "number" ? res.data.balance : prev.balance,
      }));
    } catch (error) {
      console.error("Balance fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [refreshKey]);

  return (
    <div className="relative w-full rounded-2xl p-6 sm:p-8 border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl overflow-hidden transition-all">
      <div className="relative z-20 space-y-6">
        {/* Badge & Label */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00]">
            <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
            NET BALANCE
          </div>
        </div>

        {/* Amount Display */}
        <div>
          {loading ? (
            <div className="flex items-baseline gap-2 py-2">
              <div className="h-6 w-6 rounded bg-white/10 animate-pulse" />
              <div className="h-12 sm:h-16 w-56 sm:w-72 rounded-2xl bg-white/10 animate-pulse" />
              <div className="h-5 w-12 rounded bg-white/5 animate-pulse" />
            </div>
          ) : (
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-2xl sm:text-3xl font-bold text-[#BDFE00]">
                ৳
              </span>
              <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                {isVisible ? data.balance.toLocaleString() : "••••••••"}
              </h2>
              <span className="text-sm font-semibold text-slate-400">
                BDT
              </span>
            </div>
          )}
        </div>

        {/* Visibility Toggle Button */}
        <div>
          {loading ? (
            <div className="w-full h-10 rounded-xl bg-white/5 animate-pulse" />
          ) : (
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors font-mono text-xs font-medium cursor-pointer"
            >
              {isVisible ? <FiEyeOff className="w-4 h-4 text-[#BDFE00]" /> : <FiEye className="w-4 h-4 text-[#BDFE00]" />}
              <span>{isVisible ? "Hide Balance" : "Show Balance"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainBalance;