import React from "react";

type LastMonthIncomeProps = {
  income: number;
  count: number;
  loading?: boolean;
};

const LastMonthIncome = ({ income, count, loading = false }: LastMonthIncomeProps) => {
  return (
    <div className="relative w-full rounded-2xl p-6 sm:p-8 border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-xl transition-all">
      <div className="relative z-10 space-y-6">
        {/* Badge / Header */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#BDFE00]">
            Total Income
          </p>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-[#BDFE00]">
            Inflow
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <div className="h-5 w-4 rounded bg-white/5 animate-pulse" />
              <div className="h-10 w-44 rounded-xl bg-white/10 animate-pulse" />
              <div className="h-4 w-10 rounded bg-white/5 animate-pulse" />
            </div>
            <div className="h-4 w-28 rounded-lg bg-white/5 animate-pulse" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-xl font-bold text-[#BDFE00]">
                ৳
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {income?.toLocaleString() || 0}
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                BDT
              </span>
            </div>

            <p className="text-xs font-mono text-slate-400">
              {count?.toLocaleString() || 0} transaction{count !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastMonthIncome;