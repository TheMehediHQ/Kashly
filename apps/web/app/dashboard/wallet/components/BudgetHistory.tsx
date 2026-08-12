"use client";

import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
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

interface BudgetHistoryProps {
  onRefresh?: () => void;
}

const BudgetHistory: React.FC<BudgetHistoryProps> = ({ onRefresh }) => {
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
  const [filterMonth, setFilterMonth] = useState<number | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const fetchAllBudgets = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setIsLoadingMore(true);

      const response = await axios.get(
        `/api/budgets/history/all?page=${pageNum}&limit=20`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        if (pageNum === 1) {
          setBudgets(response.data.data);
        } else {
          setBudgets((prev) => [...prev, ...response.data.data]);
        }
        setHasMore(response.data.hasMore);
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchAllBudgets(1);
  }, []);

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAllBudgets(nextPage);
    }
  };

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
            fetchAllBudgets();
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
    fetchAllBudgets();
    if (onRefresh) onRefresh();
  };

  const filteredBudgets = budgets.filter((budget) => {
    if (filterMonth && budget.month !== filterMonth) return false;
    if (filterYear && budget.year !== filterYear) return false;
    return true;
  });

  const groupedByYearAndMonth = budgets.reduce(
    (acc, budget) => {
      if (!acc[budget.year]) {
        acc[budget.year] = {};
      }
      if (!acc[budget.year][budget.month]) {
        acc[budget.year][budget.month] = [];
      }
      acc[budget.year][budget.month].push(budget);
      return acc;
    },
    {} as Record<number, Record<number, Budget[]>>
  );

  const allYears = Array.from(new Set(budgets.map((b) => b.year))).sort(
    (a, b) => b - a
  );

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

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 rounded-xl bg-white/10 animate-pulse" />
            <div className="h-6 w-16 rounded-full bg-white/5 animate-pulse" />
          </div>

          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-36 rounded-lg bg-white/10 animate-pulse" />
                <div className="h-5 w-12 rounded-full bg-white/5 animate-pulse" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
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
          ))}
        </div>
      </div>
    );
  }

  const handleClearFilter = () => {
    setFilterMonth(null);
    setFilterYear(null);
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      {!loading && budgets.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Month Filter */}
            <select
              value={filterMonth || ""}
              onChange={(e) =>
                setFilterMonth(e.target.value ? Number(e.target.value) : null)
              }
              className="px-4 py-2.5 text-sm rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors w-full sm:w-40 cursor-pointer"
            >
              <option value="" className="bg-[#0B0F17] text-white">All Months</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month} className="bg-[#0B0F17] text-white">
                  {monthNames[month]}
                </option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={filterYear || ""}
              onChange={(e) =>
                setFilterYear(e.target.value ? Number(e.target.value) : null)
              }
              className="px-4 py-2.5 text-sm rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors w-full sm:w-40 cursor-pointer"
            >
              <option value="" className="bg-[#0B0F17] text-white">All Years</option>
              {allYears.map((year) => (
                <option key={year} value={year} className="bg-[#0B0F17] text-white">
                  {year}
                </option>
              ))}
            </select>

            {/* Clear Filters Button */}
            {(filterMonth || filterYear) && (
              <button
                onClick={handleClearFilter}
                className="px-4 py-2.5 text-sm rounded-xl font-medium border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty States */}
      {budgets.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/10 bg-slate-900/20 text-slate-400">
          <p className="text-lg font-bold text-white">No budgets found</p>
          <p className="text-sm text-slate-400 mt-1">Create a budget target to get started</p>
        </div>
      ) : filteredBudgets.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/10 bg-slate-900/20 text-slate-400 space-y-4">
          <p className="text-lg font-bold text-white">No budgets match your filters</p>
          <button
            onClick={handleClearFilter}
            className="px-5 py-2.5 rounded-xl font-semibold bg-[#BDFE00] text-black hover:bg-[#aef000] transition-all cursor-pointer text-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Render grouped budgets */}
          {allYears
            .filter((year) => !filterYear || year === filterYear)
            .map((year) => {
              const yearBudgetCount = Object.values(groupedByYearAndMonth[year] || {}).reduce(
                (total, monthBudgets) => total + monthBudgets.length,
                0
              );

              return (
                <div key={year} className="space-y-6">
                  {/* Year Header */}
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <h2 className="text-2xl font-extrabold text-white">
                      {year}
                    </h2>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-[#BDFE00]">
                      {yearBudgetCount} budget{yearBudgetCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Months within this year */}
                  {Array.from({ length: 12 }, (_, i) => i + 1)
                    .filter((month) => {
                      if (filterMonth && month !== filterMonth) return false;
                      return groupedByYearAndMonth[year]?.[month]?.length > 0;
                    })
                    .sort((a, b) => b - a)
                    .map((month) => (
                      <div key={`${year}-${month}`} className="space-y-4">
                        {/* Month Header */}
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-slate-200">
                            {monthNames[month]} {year}
                          </h3>
                          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                            {groupedByYearAndMonth[year][month].length} budget{groupedByYearAndMonth[year][month].length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Monthly Summary Card */}
                        {(() => {
                          const monthBudgets = groupedByYearAndMonth[year][month];
                          const totalLimit = monthBudgets.reduce((sum, b) => sum + b.limit, 0);
                          const totalSpent = monthBudgets.reduce((sum, b) => sum + b.spent, 0);
                          const totalLeft = totalLimit - totalSpent;
                          
                          return (
                            <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-5">
                              <div className="grid grid-cols-3 gap-4 font-mono text-center sm:text-left">
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                                    Total Budget
                                  </p>
                                  <p className="text-lg sm:text-xl font-bold text-white">
                                    ৳{totalLimit.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                                    Total Spent
                                  </p>
                                  <p className="text-lg sm:text-xl font-bold text-rose-400">
                                    ৳{totalSpent.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                                    Total Left
                                  </p>
                                  <p className={`text-lg sm:text-xl font-bold ${totalLeft >= 0 ? "text-[#BDFE00]" : "text-rose-400"}`}>
                                    ৳{Math.abs(totalLeft).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Budget Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {groupedByYearAndMonth[year][month].map((budget) => {
                            const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                            const remaining = Math.max(budget.limit - budget.spent, 0);
                            const isExceeded = budget.spent > budget.limit;

                            const getProgressColor = () => {
                              if (percentage < 50) return "bg-[#BDFE00]";
                              if (percentage < 80) return "bg-yellow-400";
                              if (percentage < 100) return "bg-orange-400";
                              return "bg-rose-500";
                            };

                            const getTextColor = () => {
                              if (percentage < 50) return "text-[#BDFE00]";
                              if (percentage < 80) return "text-yellow-400";
                              if (percentage < 100) return "text-orange-400";
                              return "text-rose-400";
                            };

                            return (
                              <div
                                key={budget._id}
                                className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:border-white/20 transition-all duration-300 shadow-xl"
                              >
                                {/* Card Header */}
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-base font-bold text-white tracking-wide">
                                    {budget.category}
                                  </h4>
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => handleEdit(budget._id)}
                                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                      title="Edit budget"
                                    >
                                      <FiEdit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(budget._id)}
                                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                      title="Delete budget"
                                    >
                                      <FiTrash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Amount Summary Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-3 p-3 rounded-xl bg-white/5 border border-white/5 font-mono">
                                  <div>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">
                                      Spent
                                    </p>
                                    <p className="text-base font-bold text-white">
                                      ৳{budget.spent.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">
                                      Limit
                                    </p>
                                    <p className="text-base font-bold text-white">
                                      ৳{budget.limit.toLocaleString()}
                                    </p>
                                  </div>
                                </div>

                                {budget.note && (
                                  <p className="mb-3 text-xs italic text-slate-400 bg-white/[0.02] p-2 rounded-lg border border-white/5">
                                    "{budget.note}"
                                  </p>
                                )}

                                {/* Progress Bar */}
                                <div className="mb-2.5">
                                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-white/5">
                                    <div
                                      className={`h-full rounded-full ${getProgressColor()} transition-all duration-300`}
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Usage Status Footer */}
                                <div className="flex items-center justify-between text-xs font-mono font-semibold">
                                  <span className={getTextColor()}>
                                    {percentage.toFixed(0)}% Used
                                  </span>
                                  <span className={isExceeded ? "text-rose-400" : "text-slate-300"}>
                                    {isExceeded ? (
                                      <>Exceeded by ৳{(budget.spent - budget.limit).toLocaleString()}</>
                                    ) : (
                                      <>৳{remaining.toLocaleString()} left</>
                                    )}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              );
            })}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && budgets.length > 0 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 rounded-xl font-semibold border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoadingMore ? "Loading..." : "Load More Budgets"}
          </button>
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

export default BudgetHistory;