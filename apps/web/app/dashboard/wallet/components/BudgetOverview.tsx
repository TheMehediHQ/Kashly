"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { FiPlusCircle } from "react-icons/fi";
import axios from "axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import BudgetCard from "./BudgetCard";
import BudgetModal from "./BudgetModal";

interface Budget {
  _id: string;
  category: string;
  limit: number;
  spent: number;
  month: number;
  year: number;
  note?: string;
}

interface BudgetOverviewProps {
  refreshKey: number;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ refreshKey }) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editingBudgetData, setEditingBudgetData] = useState<{
    category: string;
    limit: number;
    month: number;
    year: number;
    note?: string;
  } | null>(null);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/budgets`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setBudgets(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [refreshKey]);

  const handleEdit = (budgetId: string) => {
    const budget = budgets.find((b) => b._id === budgetId);
    if (budget) {
      setEditingBudgetId(budgetId);
      setEditingBudgetData({
        category: budget.category,
        limit: budget.limit,
        month: budget.month,
        year: budget.year,
        note: budget.note || "",
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (budgetId: string) => {
    Swal.fire({
      title: "Delete Budget?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6b7280",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `/api/budgets/${budgetId}`,
            {
              withCredentials: true,
            }
          );

          if (response.data.success) {
            toast.success("Budget deleted successfully");
            fetchBudgets();
          }
        } catch (error) {
          const errorMessage = error instanceof axios.AxiosError 
            ? error.response?.data?.message 
            : "Failed to delete budget";
          toast.error(errorMessage);
        }
      }
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBudgetId(null);
    setEditingBudgetData(null);
  };

  const handleSuccess = () => {
    fetchBudgets();
  };

  if (loading) {
    return (
      <div className="py-4">
        <div className="mb-6 flex items-center justify-between">
          <div className={`h-8 w-48 rounded-lg animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
          <div className={`h-10 w-32 rounded-lg animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-4 ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={`h-6 w-24 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                <div className="flex gap-2">
                  <div className={`h-8 w-8 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                  <div className={`h-8 w-8 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                </div>
              </div>
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div className={`h-14 rounded animate-pulse ${isDark ? "bg-slate-800" : "bg-slate-100"}`} />
                <div className={`h-14 rounded animate-pulse ${isDark ? "bg-slate-800" : "bg-slate-100"}`} />
              </div>
              <div className={`mb-2 h-2 w-full rounded-full animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
              <div className="flex justify-between">
                <div className={`h-4 w-16 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                <div className={`h-4 w-20 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}
        >
          Monthly Budgets
        </h2>
        <button
          onClick={() => {
            setEditingBudgetId(null);
            setEditingBudgetData(null);
            setIsModalOpen(true);
          }}
          className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            isDark
              ? "bg-white text-black hover:bg-neutral-100"
              : "bg-black text-white hover:bg-neutral-900"
          }`}
        >
          <FiPlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>New Budget</span>
        </button>
      </div>

      {/* Total Budget Summary */}
      {budgets.length > 0 && (
        <div className={`mb-6 rounded-lg border p-4 sm:p-6 ${
          isDark
            ? "border-neutral-800 bg-neutral-900/50"
            : "border-neutral-200 bg-neutral-50"
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-black"}`}>
            Total Budget Summary
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className={`text-sm font-medium mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Total Budget
              </p>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>
                ৳{budgets.reduce((sum, budget) => sum + budget.limit, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className={`text-sm font-medium mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Total Spent
              </p>
              <p className={`text-2xl font-bold text-red-500`}>
                ৳{budgets.reduce((sum, budget) => sum + budget.spent, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className={`text-sm font-medium mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Total Left
              </p>
              <p className={`text-2xl font-bold text-green-500`}>
                ৳{(budgets.reduce((sum, budget) => sum + budget.limit, 0) - budgets.reduce((sum, budget) => sum + budget.spent, 0)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <div
          className={`text-center py-12 rounded-lg border-2 border-dashed ${
            isDark
              ? "border-slate-700 text-slate-400"
              : "border-slate-200 text-slate-600"
          }`}
        >
          <p className="text-lg font-medium mb-2">No budgets yet</p>
          <p className="text-sm mb-4">Create your first budget to track spending by category</p>
          <button
            onClick={() => {
              setEditingBudgetId(null);
              setEditingBudgetData(null);
              setIsModalOpen(true);
            }}
            className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              isDark
                ? "bg-white text-black hover:bg-neutral-100"
                : "bg-black text-white hover:bg-neutral-900"
            }`}
          >
            <FiPlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>New Budget</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget._id}
              id={budget._id}
              category={budget.category}
              limit={budget.limit}
              spent={budget.spent}
              note={budget.note}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        editingBudgetId={editingBudgetId}
        editingBudgetData={editingBudgetData}
      />
    </div>
  );
};

export default BudgetOverview;
