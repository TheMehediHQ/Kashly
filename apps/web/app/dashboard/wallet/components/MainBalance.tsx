"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";

type Balance = {
  income: number;
  expense: number;
  balance: number;
};

interface MainBalanceProps {
  refreshKey: number;
}

const MainBalance: React.FC<MainBalanceProps> = ({ refreshKey }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

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
          income:
            typeof res.data.income === "number"
              ? res.data.income
              : 0,
          expense:
            typeof res.data.expense === "number"
              ? res.data.expense
              : 0,
          balance:
            typeof res.data.balance === "number"
              ? res.data.balance
              : 0,
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

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl transition-all sm:p-8">

      {/* Background Glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#BDFE00]/5 blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">

        {/* =========================
            BALANCE CONTENT
        ========================== */}
        <div className="min-w-0 space-y-4">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BDFE00]/20 bg-[#BDFE00]/10 px-3 py-1 text-xs font-mono tracking-wide text-[#BDFE00]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#BDFE00]" />
            NET BALANCE
          </div>

          {/* Amount */}
          <div>
            {loading ? (
              <div className="flex items-center gap-2 py-2">

                <div className="h-8 w-7 animate-pulse rounded bg-white/10" />

                <div className="h-12 w-52 animate-pulse rounded-xl bg-white/10 sm:h-16 sm:w-72" />

                <div className="h-5 w-12 animate-pulse rounded bg-white/5" />

              </div>
            ) : (
              <div className="flex min-w-0 items-baseline gap-2 font-mono select-none">

                {/* Currency */}
                <span className="shrink-0 text-2xl font-bold text-[#BDFE00] sm:text-3xl">
                  ৳
                </span>

                {/* Balance */}
                <h2 className="truncate text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                  {isVisible
                    ? data.balance.toLocaleString("en-BD")
                    : "••••••••"}
                </h2>

                {/* BDT */}
                <span className="shrink-0 text-sm font-semibold text-slate-400">
                  BDT
                </span>
              </div>
            )}
          </div>
        </div>

        {/* =========================
            VISIBILITY TOGGLE
        ========================== */}
        <div className="flex shrink-0 items-center">

          {!loading && (
            <button
              type="button"
              onClick={() => setIsVisible((prev) => !prev)}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#BDFE00]/30"
              title={isVisible ? "Hide Balance" : "Show Balance"}
              aria-label={isVisible ? "Hide Balance" : "Show Balance"}
            >
              {isVisible ? (
                <FiEyeOff className="h-4 w-4 text-[#BDFE00]" />
              ) : (
                <FiEye className="h-4 w-4 text-[#BDFE00]" />
              )}
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default MainBalance;