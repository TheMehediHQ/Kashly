"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "@/app/context/ThemeContext";
import { FiX, FiEdit3 } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

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
  "House Rent",
  "Utilities",
  "Mobile & Internet",
  "Loan/EMI",
  "Subscriptions",
  "Groceries",
  "Transport",
  "Healthcare",
  "Education",
  "Personal Care",
  "Dining",
  "Shopping",
  "Gadgets",
  "Entertainment",
  "Travel",
  "Family Support",
  "Religious/Charity",
  "Savings",
  "Emergency Fund",
  "Investment",
  "Miscellaneous",
];

const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingBudgetId,
  editingBudgetData,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  // Validation helper
  const isDateInPast = (month: number, year: number) => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    return year < currentYear || (year === currentYear && month < currentMonth);
  };

  const onSubmit = async (data: BudgetFormData) => {
    // Validate date is not in past
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
          }
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
          }
        );

        if (response.data.success) {
          toast.success("Budget created successfully");
          reset();
          onClose();
          onSuccess();
        }
      }
    } catch (error) {
      const errorMessage = error instanceof axios.AxiosError 
        ? error.response?.data?.message 
        : "Failed to save budget";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div
        className={`pointer-events-auto rounded-lg shadow-xl w-full max-w-md border ${
          isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-black"}`}>
            {editingBudgetId ? "Edit Budget" : "Create Budget"}
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded transition-colors ${
              isDark
                ? "hover:bg-slate-800 text-slate-400"
                : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Category */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white focus:border-neutral-500"
                  : "bg-white border-slate-300 text-black focus:border-neutral-500"
              } focus:outline-none transition-colors`}
            >
              {expenseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-rose-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Limit */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Monthly Limit (৳)
            </label>
            <input
              type="number"
              placeholder="Enter budget limit"
              {...register("limit", {
                required: "Budget limit is required",
                min: { value: 1, message: "Limit must be greater than 0" },
              })}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white focus:border-neutral-500"
                  : "bg-white border-slate-300 text-black focus:border-neutral-500"
              } focus:outline-none transition-colors`}
            />
            {errors.limit && (
              <p className="text-rose-500 text-sm mt-1">{errors.limit.message}</p>
            )}
          </div>

          {/* Month and Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Month
              </label>
              <select
                {...register("month", { required: "Month is required" })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white focus:border-neutral-500"
                    : "bg-white border-slate-300 text-black focus:border-neutral-500"
                } focus:outline-none transition-colors`}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              {errors.month && (
                <p className="text-rose-500 text-sm mt-1">{errors.month.message}</p>
              )}
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Year
              </label>
              <input
                type="number"
                placeholder="2026"
                {...register("year", {
                  required: "Year is required",
                  min: { value: new Date().getFullYear(), message: "Year cannot be in the past" },
                })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white focus:border-neutral-500"
                    : "bg-white border-slate-300 text-black focus:border-neutral-500"
                } focus:outline-none transition-colors`}
              />
              {errors.year && (
                <p className="text-rose-500 text-sm mt-1">{errors.year.message}</p>
              )}
            </div>
          </div>

          {/* Note */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Reference Note (Optional)
            </label>
            <div className="relative">
              <FiEdit3 className="absolute left-3 top-3 text-slate-400" />
              <textarea
                rows={3}
                placeholder="Add a reference note..."
                {...register("note")}
                className={`w-full pl-10 pr-3 py-2 rounded-lg border resize-none ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white focus:border-neutral-500"
                    : "bg-white border-slate-300 text-black focus:border-neutral-500"
                } focus:outline-none transition-colors`}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors border ${
                isDark
                  ? "bg-black text-white hover:bg-neutral-800 border-neutral-700"
                  : "bg-white text-black hover:bg-neutral-50 border-neutral-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                isLoading
                  ? "bg-neutral-400 text-neutral-200 cursor-not-allowed"
                  : isDark
                    ? "bg-white text-black hover:bg-neutral-100"
                    : "bg-black text-white hover:bg-neutral-900"
              }`}
            >
              {isLoading ? "Saving..." : editingBudgetId ? "Update Budget" : "Create Budget"}
            </button>
          </div>
        </form>
      </div>
      </div>
    </>
  );
};

export default BudgetModal;
