import React from "react";
import { useTheme } from "@/app/context/ThemeContext";

type LastMonthIncomeProps = {
  income: number;
  count: number;
  loading?: boolean;
};

const LastMonthIncome = ({ income, count, loading = false }: LastMonthIncomeProps) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  
  return (
    <div className={`relative w-full rounded-xl p-8 transition-all border ${isDark ? "border-slate-800/60" : "border-slate-200/80"}`} style={{backgroundColor: isDark ? "#111111" : "#FFFFFF"}}>
      <div className="relative z-10">
        <p className={`text-xs font-semibold uppercase tracking-wider mb-6 ${isDark ? "text-slate-500" : "text-slate-600"}`}>
          Total Income
        </p>

        {loading ? (
          <>
            <div className="flex items-baseline gap-2 mb-8">
              <div className={`h-4 w-4 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
              <div className={`h-10 w-40 rounded-lg animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
              <div className={`h-4 w-10 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
            </div>
            <div className={`h-4 w-28 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-1 mb-8">
              <span className={`text-lg font-medium ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                ৳
              </span>
              <h3 className={`text-3xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-black"}`}>
                {income.toLocaleString()}
              </h3>
              <span className={`text-xs sm:text-sm font-semibold ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                BDT
              </span>
            </div>

            <p className={`text-xs font-medium ${isDark ? "text-slate-500" : "text-slate-600"}`}>
              {count?.toLocaleString() || 0} transactions
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LastMonthIncome;
