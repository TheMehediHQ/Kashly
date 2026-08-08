"use client";
import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useTheme } from "@/app/context/ThemeContext";

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
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/balance`,
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
    <div className={`relative w-full rounded-xl p-8 transition-all border overflow-hidden backdrop-blur-sm ${isDark ? "border-slate-800/60" : "border-slate-200/60"}`} style={{backgroundColor: isDark ? "#111111" : "#FFFFFF"}}>
      <div className="relative z-20">
        {/* Label */}
        <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-slate-500" : "text-slate-600"}`}>
          Balance
        </p>

        {/* Amount */}
        <div className="mb-8">
          <div className="flex items-baseline gap-1">
            {loading ? (
              <div className="flex items-end gap-2">
                <div className={`h-6 w-6 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                <div className={`h-14 sm:h-16 w-48 sm:w-64 rounded-lg animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                <div className={`h-5 w-12 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
              </div>
            ) : (
              <>
                <span className={`text-2xl font-medium ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                  ৳
                </span>
                <h2 className={`text-5xl sm:text-6xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`}>
                  {isVisible ? data.balance.toLocaleString() : "••••••"}
                </h2>
                <span className={`text-lg font-semibold ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                  BDT
                </span>
              </>
            )}
          </div>
        </div>

        {/* Hide/Show Button */}
        {loading ? (
          <div className={`w-full mb-8 h-10 rounded-lg animate-pulse ${isDark ? "bg-slate-800" : "bg-slate-100"}`} />
        ) : (
          <button
            onClick={() => setIsVisible(!isVisible)}
            className={`w-full mb-8 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors font-medium text-sm ${isDark ? "text-slate-400" : "text-slate-600 hover:bg-slate-100"}`}
            onMouseEnter={(e) => isDark && (e.currentTarget.style.backgroundColor = "#171717")}
            onMouseLeave={(e) => isDark && (e.currentTarget.style.backgroundColor = "")}
          >
            {isVisible ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            {isVisible ? "Hide Balance" : "Show Balance"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MainBalance;
