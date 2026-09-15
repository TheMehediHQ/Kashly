"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { FiX, FiEdit3, FiTarget } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import { useModalA11y } from "../wallet/components/useModalA11y";

interface IncomeGoalFormData {
  goalAmount: number;
  month: number;
  year: number;
  note: string;
}

interface IncomeGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingGoalId?: string | null;
  editingGoalData?: {
    goalAmount: number;
    month: number;
    year: number;
    note?: string;
  } | null;
}

const IncomeGoalModal: React.FC<IncomeGoalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingGoalId,
  editingGoalData,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<IncomeGoalFormData>({
    defaultValues: {
      goalAmount: undefined,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      note: "",
    },
  });

  useEffect(() => {
    if (editingGoalData) {
      setValue("goalAmount", editingGoalData.goalAmount);
      setValue("month", editingGoalData.month);
      setValue("year", editingGoalData.year);
      setValue("note", editingGoalData.note || "");
    } else {
      reset();
    }
  }, [editingGoalData, setValue, reset]);

  const { dialogRef } = useModalA11y({ isOpen, onClose });

  const isDateInPast = (month: number, year: number) => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    return year < currentYear || (year === currentYear && month < currentMonth);
  };

  const onSubmit = async (data: IncomeGoalFormData) => {
    if (isDateInPast(data.month, data.year)) {
      toast.error("Cannot create a goal for a past month");
      return;
    }

    try {
      setIsLoading(true);

      if (editingGoalId) {
        const response = await axios.put(
          `/api/income-goals/${editingGoalId}`,
          {
            goalAmount: data.goalAmount,
            month: data.month,
            year: data.year,
            note: data.note,
          },
          { withCredentials: true },
        );

        if (response.data.success) {
          toast.success("Income goal updated successfully");
          onClose();
          onSuccess();
        }
      } else {
        const response = await axios.post(
          `/api/income-goals`,
          {
            goalAmount: data.goalAmount,
            month: data.month,
            year: data.year,
            note: data.note,
          },
          { withCredentials: true },
        );

        if (response.data.success) {
          toast.success("Income goal created successfully");
          reset();
          onClose();
          onSuccess();
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message
          : "Failed to save income goal";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="income-goal-modal-title"
          tabIndex={-1}
          className="pointer-events-auto my-auto w-full max-w-md rounded-3xl bg-[#0B0F17] border border-white/10 shadow-2xl overflow-y-auto overflow-x-hidden max-h-[calc(100dvh-2rem)]"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-[10px] font-mono tracking-wide text-[#BDFE00] mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#BDFE00] animate-pulse" />
                INCOME GOAL
              </div>
              <h2
                id="income-goal-modal-title"
                className="text-xl font-bold text-white"
              >
                {editingGoalId ? "Edit Income Goal" : "Set Income Goal"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                Goal Amount (৳)
              </label>
              <div className="relative">
                <FiTarget className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="number"
                  placeholder="Enter monthly income goal"
                  {...register("goalAmount", {
                    required: "Goal amount is required",
                    min: {
                      value: 1,
                      message: "Amount must be greater than 0",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-[#BDFE00]/60 transition-colors"
                />
              </div>
              {errors.goalAmount && (
                <p className="text-rose-400 text-xs mt-1.5">
                  {errors.goalAmount.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Month
                </label>
                <select
                  {...register("month", { required: "Month is required" })}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option
                      key={month}
                      value={month}
                      className="bg-[#0B0F17] text-white"
                    >
                      {new Date(0, month - 1).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
                {errors.month && (
                  <p className="text-rose-400 text-xs mt-1.5">
                    {errors.month.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  placeholder="2026"
                  {...register("year", {
                    required: "Year is required",
                    min: {
                      value: new Date().getFullYear(),
                      message: "Year cannot be in the past",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-[#BDFE00]/60 transition-colors"
                />
                {errors.year && (
                  <p className="text-rose-400 text-xs mt-1.5">
                    {errors.year.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                Reference Note (Optional)
              </label>
              <div className="relative">
                <FiEdit3 className="absolute left-3.5 top-3.5 text-slate-400" />
                <textarea
                  rows={3}
                  placeholder="Add a reference note..."
                  {...register("note")}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#BDFE00]/60 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl font-semibold border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl font-semibold bg-[#BDFE00] text-black hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading
                  ? "Saving..."
                  : editingGoalId
                    ? "Update Goal"
                    : "Set Goal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default IncomeGoalModal;
