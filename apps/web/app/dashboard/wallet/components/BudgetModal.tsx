"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { FiX, FiEdit3 } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import { useModalA11y } from "./useModalA11y";

interface BudgetFormData {
  category: string;
  limit: number;
  month: number;
  year: number;
  note: string;
}

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingBudgetId?: string | null;
  editingBudgetData?: {
    category: string;
    limit: number;
    month: number;
    year: number;
    note?: string;
  } | null;
}

const expenseCategories = [
  // Housing & Bills
  "House Rent",
  "Utilities",
  "Mobile & Internet",

  // Financial Obligations
  "Loan/EMI",
  "Subscriptions",

  // Food & Daily Essentials
  "Groceries",
  "Dining",
  "Tea",

  // Transportation
  "Transport",

  // Health & Personal
  "Healthcare",
  "Personal Care",
  "Cosmetics",
  "Haircut",
  "Beard Care",

  // Education & Family
  "Education",
  "Family Support",

  // Lifestyle & Shopping
  "Clothing",
  "Shoes",
  "Shopping",
  "Gadgets",
  "Gifts",
  "Entertainment",
  "Travel",

  // Religious & Giving
  "Religious/Charity",
  "Donation (3% Income)",
  "Quantum Programme",
  "Etiman",
  "Qurbani (5% Income)",

  // Savings & Investments
  "Savings (10% Income)",
  "Emergency Fund",
  "Investment",

  // Other
  "Miscellaneous",
];

const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingBudgetId,
  editingBudgetData,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BudgetFormData>({
    defaultValues: {
      category: expenseCategories[0],
      limit: undefined,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      note: "",
    },
  });

  useEffect(() => {
    if (editingBudgetData) {
      setValue("category", editingBudgetData.category);
      setValue("limit", editingBudgetData.limit);
      setValue("month", editingBudgetData.month);
      setValue("year", editingBudgetData.year);
      setValue("note", editingBudgetData.note || "");
    } else {
      reset();
    }
  }, [editingBudgetData, setValue, reset]);

  const { dialogRef } = useModalA11y({ isOpen, onClose });

  // Validation helper
  const isDateInPast = (month: number, year: number) => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    return year < currentYear || (year === currentYear && month < currentMonth);
  };

  const onSubmit = async (data: BudgetFormData) => {
    if (isDateInPast(data.month, data.year)) {
      toast.error("Cannot create a budget for a past month");
      return;
    }

    try {
      setIsLoading(true);

      if (editingBudgetId) {
        // Update budget
        const response = await axios.put(
          `/api/budgets/${editingBudgetId}`,
          {
            category: data.category,
            limit: data.limit,
            month: data.month,
            year: data.year,
            note: data.note,
          },
          {
            withCredentials: true,
          },
        );

        if (response.data.success) {
          toast.success("Budget updated successfully");
          onClose();
          onSuccess();
        }
      } else {
        // Create budget
        const response = await axios.post(
          `/api/budgets`,
          {
            category: data.category,
            limit: data.limit,
            month: data.month,
            year: data.year,
            note: data.note,
          },
          {
            withCredentials: true,
          },
        );

        if (response.data.success) {
          toast.success("Budget created successfully");
          reset();
          onClose();
          onSuccess();
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message
          : "Failed to save budget";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="budget-modal-title"
          tabIndex={-1}
          className="pointer-events-auto my-auto w-full max-w-md rounded-3xl bg-[#0B0F17] border border-white/10 shadow-2xl overflow-y-auto overflow-x-hidden max-h-[calc(100dvh-2rem)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-[10px] font-mono tracking-wide text-[#BDFE00] mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#BDFE00] animate-pulse" />
                BUDGET TARGET
              </div>
              <h2
                id="budget-modal-title"
                className="text-xl font-bold text-white"
              >
                {editingBudgetId ? "Edit Budget" : "Create Budget"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                Category
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors cursor-pointer"
              >
                {expenseCategories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-[#0B0F17] text-white"
                  >
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-rose-400 text-xs mt-1.5">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Limit */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                Monthly Limit (৳)
              </label>
              <input
                type="number"
                placeholder="Enter budget limit"
                {...register("limit", {
                  required: "Budget limit is required",
                  min: { value: 1, message: "Limit must be greater than 0" },
                })}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-[#BDFE00]/60 transition-colors"
              />
              {errors.limit && (
                <p className="text-rose-400 text-xs mt-1.5">
                  {errors.limit.message}
                </p>
              )}
            </div>

            {/* Month and Year */}
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

            {/* Note */}
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

            {/* Buttons */}
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
                  : editingBudgetId
                    ? "Update Budget"
                    : "Create Budget"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default BudgetModal;
