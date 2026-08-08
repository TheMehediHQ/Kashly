"use client";

import React from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface BudgetCardProps {
  id: string;
  category: string;
  limit: number;
  spent: number;
  note?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  id,
  category,
  limit,
  spent,
  note,
  onEdit,
  onDelete,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";

  const percentage = Math.min((spent / limit) * 100, 100);
  const remaining = Math.max(limit - spent, 0);
  const isExceeded = spent > limit;

  // Determine color based on percentage
  const getProgressColor = () => {
    if (percentage < 50) return "bg-emerald-500";
    if (percentage < 80) return "bg-yellow-500";
    if (percentage < 100) return "bg-orange-500";
    return "bg-rose-500";
  };

  const getTextColor = () => {
    if (percentage < 50) return "text-emerald-600 dark:text-emerald-400";
    if (percentage < 80) return "text-yellow-600 dark:text-yellow-400";
    if (percentage < 100) return "text-orange-600 dark:text-orange-400";
    return "text-rose-600 dark:text-rose-400";
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        isDark
          ? "border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/50"
          : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100/50"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {category}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(id)}
            className={`p-1.5 rounded transition-colors ${
              isDark
                ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                : "hover:bg-slate-200 text-slate-600 hover:text-slate-800"
            }`}
            title="Edit budget"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className={`p-1.5 rounded transition-colors ${
              isDark
                ? "hover:bg-slate-700 text-slate-400 hover:text-rose-400"
                : "hover:bg-slate-200 text-slate-600 hover:text-rose-600"
            }`}
            title="Delete budget"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Amount Info */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Spent
          </p>
          <p
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            ৳{spent.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Budget
          </p>
          <p
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            ৳{limit.toLocaleString()}
          </p>
        </div>
      </div>

      {note && (
        <p
          className={`mb-3 text-xs italic ${isDark ? "text-slate-400" : "text-slate-600"}`}
        >
          {note}
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-2">
        <div
          className={`w-full h-2 rounded-full ${
            isDark ? "bg-slate-700" : "bg-slate-200"
          } overflow-hidden`}
        >
          <div
            className={`h-full ${getProgressColor()} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {percentage.toFixed(0)}% Used
        </span>
        <span
          className={`text-sm font-medium ${
            isExceeded
              ? "text-rose-600 dark:text-rose-400"
              : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {isExceeded ? (
            <>Exceeded by ৳{(spent - limit).toLocaleString()}</>
          ) : (
            <>৳{remaining.toLocaleString()} left</>
          )}
        </span>
      </div>
    </div>
  );
};

export default BudgetCard;
