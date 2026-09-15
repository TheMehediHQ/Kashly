"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiTarget, FiPlusCircle } from "react-icons/fi";
import axios from "axios";

interface IncomeGoal {
  _id: string;
  goalAmount: number;
  earned: number;
  month: number;
  year: number;
  note?: string;
}

interface IncomeGoalOverviewProps {
  refreshKey: number;
}

const IncomeGoalOverview: React.FC<IncomeGoalOverviewProps> = ({
  refreshKey,
}) => {
  const [goal, setGoal] = useState<IncomeGoal | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGoal = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/income-goals", {
        withCredentials: true,
      });
      if (res.data?.data) {
        setGoal(res.data.data);
      } else {
        setGoal(null);
      }
    } catch {
      setGoal(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="py-4 space-y-6">
        <div className="h-8 w-56 rounded-xl bg-white/10 animate-pulse" />
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 animate-pulse space-y-4">
          <div className="h-16 w-full rounded-xl bg-white/5" />
          <div className="h-3 w-full rounded-full bg-white/5" />
          <div className="h-4 w-32 rounded bg-white/5" />
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="py-4 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Income Goal</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Monthly earning target for current period
            </p>
          </div>
          <Link
            href="/dashboard/income"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#BDFE00] text-black font-semibold text-sm hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] transition-all active:scale-95"
          >
            <FiPlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Set Goal</span>
          </Link>
        </div>

        <div className="text-center py-12 rounded-2xl border border-dashed border-white/10 bg-slate-900/20 text-slate-400">
          <FiTarget size={36} className="mx-auto text-slate-600 mb-3" />
          <p className="text-base font-bold text-white">
            No income goal set for this month
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Set a monthly income target to track your earning progress
          </p>
        </div>
      </div>
    );
  }

  const percentage = Math.min((goal.earned / goal.goalAmount) * 100, 100);
  const remaining = Math.max(goal.goalAmount - goal.earned, 0);
  const isAchieved = goal.earned >= goal.goalAmount;

  const getProgressColor = () => {
    if (percentage >= 100) return "bg-[#BDFE00]";
    if (percentage >= 80) return "bg-emerald-400";
    if (percentage >= 50) return "bg-yellow-400";
    return "bg-rose-400";
  };

  const getTextColor = () => {
    if (percentage >= 100) return "text-[#BDFE00]";
    if (percentage >= 80) return "text-emerald-400";
    if (percentage >= 50) return "text-yellow-400";
    return "text-rose-400";
  };

  const monthNames = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="py-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white">Income Goal</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {monthNames[goal.month]} {goal.year} earning target
          </p>
        </div>
        <Link
          href="/dashboard/income"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 font-semibold text-sm hover:bg-white/10 hover:text-white transition-all active:scale-95"
        >
          <span>View All</span>
        </Link>
      </div>

      {/* Goal Card */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 shadow-xl space-y-5">
        {/* Amount Summary */}
        <div className="grid grid-cols-3 gap-4 font-mono">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
              Earned
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-400">
              ৳{goal.earned.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
              Goal
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-white">
              ৳{goal.goalAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
              {isAchieved ? "Exceeded" : "Remaining"}
            </p>
            <p
              className={`text-xl sm:text-2xl font-extrabold ${isAchieved ? "text-[#BDFE00]" : "text-yellow-400"}`}
            >
              ৳
              {isAchieved
                ? (goal.earned - goal.goalAmount).toLocaleString()
                : remaining.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Note */}
        {goal.note && (
          <p className="text-xs italic text-slate-400 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
            &ldquo;{goal.note}&rdquo;
          </p>
        )}

        {/* Progress Bar */}
        <div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-white/5">
            <div
              className={`h-full rounded-full ${getProgressColor()} transition-all duration-500`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between text-sm font-mono font-semibold pt-1">
          <span className={getTextColor()}>
            {isAchieved
              ? "🎉 Goal Achieved!"
              : `${percentage.toFixed(1)}% Complete`}
          </span>
          <span className={isAchieved ? "text-[#BDFE00]" : "text-slate-300"}>
            {isAchieved ? (
              <>+৳{(goal.earned - goal.goalAmount).toLocaleString()} over goal</>
            ) : (
              <>৳{remaining.toLocaleString()} to go</>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IncomeGoalOverview;
