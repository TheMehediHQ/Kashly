"use client";

import React, { useState, useEffect } from "react";
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
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#334155",
      background: "#0B0F17",
      color: "#ffffff",
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
      <div className="py-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 rounded-xl bg-white/10 animate-pulse" />
          <div className="h-10 w-32 rounded-xl bg-white/5 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 rounded bg-white/10" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-lg bg-white/5" />
                  <div className="h-8 w-8 rounded-lg bg-white/5" />
                </div>
              </div>
              <div className="h-16 w-full rounded-xl bg-white/5" />
              <div className="h-2 w-full rounded-full bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalLeft = totalLimit - totalSpent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Monthly Budgets
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Active spending limits for current period
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBudgetId(null);
            setEditingBudgetData(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#BDFE00] text-black font-semibold text-sm hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] transition-all cursor-pointer active:scale-95"
        >
          <FiPlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>New Budget</span>
        </button>
      </div>

      {/* Total Budget Summary */}
      {budgets.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 shadow-xl">
          <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 mb-4">
            Total Budget Summary
          </h3>
          <div className="grid grid-cols-3 gap-4 font-mono">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                Total Budget
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-white">
                ৳{totalLimit.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                Total Spent
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-rose-400">
                ৳{totalSpent.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                Total Left
              </p>
              <p className={`text-xl sm:text-2xl font-extrabold ${totalLeft >= 0 ? "text-[#BDFE00]" : "text-rose-400"}`}>
                ৳{Math.abs(totalLeft).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/10 bg-slate-900/20 text-slate-400 space-y-4">
          <div>
            <p className="text-lg font-bold text-white">No budgets set for this month</p>
            <p className="text-xs text-slate-400 mt-1">Create your first budget target to start tracking category spend</p>
          </div>
          <button
            onClick={() => {
              setEditingBudgetId(null);
              setEditingBudgetData(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#BDFE00] text-black font-semibold text-sm hover:bg-[#aef000] transition-all cursor-pointer"
          >
            <FiPlusCircle className="w-4 h-4 stroke-[2.5]" />
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