"use client";

import React from "react";
import { FiEdit2, FiTrash2, FiTarget } from "react-icons/fi";
import Swal from "sweetalert2";

interface IncomeGoalCardProps {
  id: string;
  goalAmount: number;
  earned: number;
  note?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const IncomeGoalCard: React.FC<IncomeGoalCardProps> = ({
  id,
  goalAmount,
  earned,
  note,
  onEdit,
  onDelete,
}) => {
  const percentage = Math.min((earned / goalAmount) * 100, 100);
  const remaining = Math.max(goalAmount - earned, 0);
  const isAchieved = earned >= goalAmount;

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

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Income Goal?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#475569",
      confirmButtonText: "Yes, delete it",
      background: "#0B0F17",
      color: "#fff",
    });

    if (result.isConfirmed) {
      onDelete(id);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#BDFE00]/10 flex items-center justify-center text-[#BDFE00]">
            <FiTarget size={16} />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Monthly Income Goal
          </h3>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => onEdit(id)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Edit goal"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-colors cursor-pointer"
            title="Delete goal"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 p-3.5 rounded-xl bg-white/5 border border-white/5">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Earned
          </p>
          <p className="text-lg font-extrabold text-emerald-400 font-mono">
            ৳{earned.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Goal
          </p>
          <p className="text-lg font-extrabold text-white font-mono">
            ৳{goalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {note && (
        <p className="mb-4 text-xs italic text-slate-400 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
          &ldquo;{note}&rdquo;
        </p>
      )}

      <div className="mb-3">
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-white/5">
          <div
            className={`h-full rounded-full ${getProgressColor()} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-mono font-semibold pt-1">
        <span className={getTextColor()}>
          {isAchieved ? "🎉 Goal Achieved!" : `${percentage.toFixed(0)}% Complete`}
        </span>
        <span className={isAchieved ? "text-[#BDFE00]" : "text-slate-300"}>
          {isAchieved ? (
            <>Exceeded by ৳{(earned - goalAmount).toLocaleString()}</>
          ) : (
            <>৳{remaining.toLocaleString()} to go</>
          )}
        </span>
      </div>
    </div>
  );
};

export default IncomeGoalCard;
