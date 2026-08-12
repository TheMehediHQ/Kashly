"use client";

import React from "react";
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
  const percentage = Math.min((spent / limit) * 100, 100);
  const remaining = Math.max(limit - spent, 0);
  const isExceeded = spent > limit;

  // Determine progress bar fill color based on usage
  const getProgressColor = () => {
    if (percentage < 50) return "bg-[#BDFE00]";
    if (percentage < 80) return "bg-yellow-400";
    if (percentage < 100) return "bg-orange-400";
    return "bg-rose-500";
  };

  // Determine status text color
  const getTextColor = () => {
    if (percentage < 50) return "text-[#BDFE00]";
    if (percentage < 80) return "text-yellow-400";
    if (percentage < 100) return "text-orange-400";
    return "text-rose-400";
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300 shadow-xl group">
      {/* Header & Actions */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white tracking-wide">
          {category}
        </h3>
        <div className="flex gap-1.5">
          <button
            onClick={() => onEdit(id)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Edit budget"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-colors cursor-pointer"
            title="Delete budget"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Amount Display */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-3.5 rounded-xl bg-white/5 border border-white/5">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
            Spent
          </p>
          <p className="text-xl font-extrabold text-white font-mono">
            ৳{spent.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
            Budget
          </p>
          <p className="text-xl font-extrabold text-white font-mono">
            ৳{limit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Optional Note */}
      {note && (
        <p className="mb-4 text-xs italic text-slate-400 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
          "{note}"
        </p>
      )}

      {/* Progress Bar Container */}
      <div className="mb-3">
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-white/5">
          <div
            className={`h-full rounded-full ${getProgressColor()} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Usage Status Summary */}
      <div className="flex items-center justify-between text-xs font-mono font-semibold pt-1">
        <span className={getTextColor()}>
          {percentage.toFixed(0)}% Used
        </span>
        <span
          className={
            isExceeded
              ? "text-rose-400"
              : "text-slate-300"
          }
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