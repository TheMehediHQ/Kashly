"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext";
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/budgets/history/all?page=${pageNum}&limit=20`,
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
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/budgets/${budgetId}`,
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

  // Filter budgets by month/year
  const filteredBudgets = budgets.filter((budget) => {
    if (filterMonth && budget.month !== filterMonth) return false;
    if (filterYear && budget.year !== filterYear) return false;
    return true;
  });

  // Group budgets by year first, then by month within each year
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

  // Get all unique years from budgets, sorted descending
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
        {/* Skeleton for Year Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className={`h-8 w-20 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-200"} animate-pulse`} />
            <div className={`h-6 w-16 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"} animate-pulse`} />
          </div>

          {/* Skeleton for Month Sections */}
          {[1, 2].map((i) => (
            <div key={i} className="ml-0 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`h-6 w-32 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-200"} animate-pulse`} />
                <div className={`h-5 w-12 rounded-full ${isDark ? "bg-slate-600" : "bg-slate-300"} animate-pulse`} />
              </div>

              {/* Skeleton for Budget Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className={`p-4 rounded-lg border ${
                      isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    {/* Card Header Skeleton */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`h-5 w-20 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"} animate-pulse`} />
                      <div className="flex gap-2">
                        <div className={`h-8 w-8 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"} animate-pulse`} />
                        <div className={`h-8 w-8 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"} animate-pulse`} />
                      </div>
                    </div>

                    {/* Amount Info Skeleton */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className={`h-4 w-12 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"} animate-pulse mb-1`} />
                        <div className={`h-6 w-16 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"} animate-pulse`} />
                      </div>
                      <div className="text-right">
                        <div className={`h-4 w-10 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"} animate-pulse mb-1`} />
                        <div className={`h-6 w-16 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"} animate-pulse`} />
                      </div>
                    </div>

                    {/* Progress Bar Skeleton */}
                    <div className={`w-full h-2 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"} mb-2 animate-pulse`} />

                    {/* Status Skeleton */}
                    <div className="flex items-center justify-between">
                      <div className={`h-4 w-16 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"} animate-pulse`} />
                      <div className={`h-4 w-20 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"} animate-pulse`} />
                    </div>
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
    <div>
      {/* Filter Section */}
      {!loading && budgets.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Filters - RIGHT */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-2 sm:order-0">
            {/* Month Filter */}
            <select
              value={filterMonth || ""}
              onChange={(e) =>
                setFilterMonth(e.target.value ? Number(e.target.value) : null)
              }
              className={`px-3 py-2 text-sm rounded-lg border transition-all w-full sm:w-40 ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-white focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/20"
                  : "bg-white border-slate-200 text-slate-900 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/20"
              } focus:outline-none`}
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
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
              className={`px-3 py-2 text-sm rounded-lg border transition-all w-full sm:w-40 ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-white focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/20"
                  : "bg-white border-slate-200 text-slate-900 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/20"
              } focus:outline-none`}
            >
              <option value="">All Years</option>
              {allYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Clear Filter Button */}
            {(filterMonth || filterYear) && (
              <button
                onClick={handleClearFilter}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all whitespace-nowrap w-full sm:w-auto ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900"
                }`}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {budgets.length === 0 ? (
        <div
          className={`text-center py-12 rounded-lg border-2 border-dashed ${
            isDark
              ? "border-slate-700 text-slate-400"
              : "border-slate-200 text-slate-600"
          }`}
        >
          <p className="text-lg font-medium">No budgets found</p>
          <p className="text-sm">Create a budget to get started</p>
        </div>
      ) : filteredBudgets.length === 0 ? (
        <div
          className={`text-center py-12 rounded-lg border-2 border-dashed ${
            isDark
              ? "border-slate-700 text-slate-400"
              : "border-slate-200 text-slate-600"
          }`}
        >
          <p className="text-lg font-medium">No budgets for selected filters</p>
          <button
            onClick={handleClearFilter}
            className={`mt-4 px-4 py-2 rounded-lg font-medium transition-all ${
              isDark
                ? "bg-white text-black hover:bg-neutral-100"
                : "bg-black text-white hover:bg-neutral-900"
            }`}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Render budgets grouped by year and month */}
          {allYears
            .filter((year) => !filterYear || year === filterYear)
            .map((year) => {
              // Calculate total budgets for this year
              const yearBudgetCount = Object.values(groupedByYearAndMonth[year] || {}).reduce(
                (total, monthBudgets) => total + monthBudgets.length,
                0
              );

              return (
                <div key={year} className="space-y-6">
                  {/* Year Header */}
                  <div className="flex items-center gap-3">
                    <h2
                      className={`text-2xl font-bold ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      {year}
                    </h2>
                    <div
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        isDark
                          ? "bg-slate-800 text-slate-300"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {yearBudgetCount} budget{yearBudgetCount !== 1 ? "s" : ""}
                    </div>
                  </div>

                  {/* Months within this year */}
                {Array.from({ length: 12 }, (_, i) => i + 1)
                  .filter((month) => {
                    if (filterMonth && month !== filterMonth) return false;
                    return groupedByYearAndMonth[year]?.[month]?.length > 0;
                  })
                  .sort((a, b) => b - a) // Sort months descending (newest first)
                  .map((month) => (
                    <div key={`${year}-${month}`} className="ml-0 space-y-4">
                      {/* Month Header */}
                      <div className="flex items-center gap-3">
                        <h3
                          className={`text-xl font-semibold ${
                            isDark ? "text-slate-200" : "text-slate-800"
                          }`}
                        >
                          {monthNames[month]} {year}
                        </h3>
                        <div
                          className={`text-sm font-medium px-3 py-1 rounded-full ${
                            isDark
                              ? "bg-slate-700 text-slate-300"
                              : "bg-slate-300 text-slate-700"
                          }`}
                        >
                          {groupedByYearAndMonth[year][month].length} budget{groupedByYearAndMonth[year][month].length !== 1 ? "s" : ""}
                        </div>
                      </div>

                      {/* Monthly Total Summary */}
                      {(() => {
                        const monthBudgets = groupedByYearAndMonth[year][month];
                        const totalLimit = monthBudgets.reduce((sum, b) => sum + b.limit, 0);
                        const totalSpent = monthBudgets.reduce((sum, b) => sum + b.spent, 0);
                        const totalLeft = totalLimit - totalSpent;
                        
                        return (
                          <div className={`mb-4 rounded-lg border p-4 ${
                            isDark
                              ? "border-neutral-800 bg-neutral-900/50"
                              : "border-neutral-200 bg-neutral-50"
                          }`}>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className={`text-sm font-medium mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                  Total Budget
                                </p>
                                <p className={`text-xl font-bold ${isDark ? "text-white" : "text-black"}`}>
                                  ৳{totalLimit.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className={`text-sm font-medium mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                  Total Spent
                                </p>
                                <p className={`text-xl font-bold text-red-500`}>
                                  ৳{totalSpent.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className={`text-sm font-medium mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                  Total Left
                                </p>
                                <p className={`text-xl font-bold ${totalLeft >= 0 ? "text-green-500" : "text-red-500"}`}>
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
                              key={budget._id}
                              className={`p-4 rounded-lg border transition-all ${
                                isDark
                                  ? "border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/50"
                                  : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100/50"
                              }`}
                            >
                              {/* Header */}
                              <div className="flex items-center justify-between mb-3">
                                <h4
                                  className={`text-lg font-semibold ${
                                    isDark ? "text-white" : "text-black"
                                  }`}
                                >
                                  {budget.category}
                                </h4>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEdit(budget._id)}
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
                                    onClick={() => handleDelete(budget._id)}
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
                                    className={`text-lg font-bold ${
                                      isDark ? "text-white" : "text-black"
                                    }`}
                                  >
                                    ৳{budget.spent.toLocaleString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                    Limit
                                  </p>
                                  <p
                                    className={`text-lg font-bold ${
                                      isDark ? "text-white" : "text-black"
                                    }`}
                                  >
                                    ৳{budget.limit.toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              {budget.note && (
                                <p
                                  className={`mb-2 text-xs italic ${isDark ? "text-slate-400" : "text-slate-600"}`}
                                >
                                  {budget.note}
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

      {/* LOAD MORE BUTTON */}
      {hasMore && budgets.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              isDark 
                ? "bg-slate-800 hover:bg-slate-700 text-white disabled:bg-slate-800/50" 
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:bg-slate-100/50"
            }`}
          >
            {isLoadingMore ? "Loading..." : "Load More"}
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
