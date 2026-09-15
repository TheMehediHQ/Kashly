"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FiRefreshCw, FiPlusCircle, FiEdit2, FiTrash2, FiTarget } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import IncomeGoalModal from "../components/IncomeGoalModal";

interface IncomeGoal {
  _id: string;
  goalAmount: number;
  earned: number;
  month: number;
  year: number;
  note?: string;
}

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

const IncomePage = () => {
  const [goals, setGoals] = useState<IncomeGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingGoalData, setEditingGoalData] = useState<{
    goalAmount: number;
    month: number;
    year: number;
    note?: string;
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterMonth, setFilterMonth] = useState<number | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchGoals = useCallback(async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setIsLoadingMore(true);

      const res = await axios.get(
        `/api/income-goals/history/all?page=${pageNum}&limit=20`,
        { withCredentials: true }
      );

      if (res.data.success) {
        if (pageNum === 1) {
          setGoals(res.data.data);
        } else {
          setGoals((prev) => [...prev, ...res.data.data]);
        }
        setHasMore(res.data.hasMore);
      }
    } catch {
      toast.error("Failed to load income goals");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals(1);
  }, [fetchGoals]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPage(1);
    fetchGoals(1);
    setTimeout(() => setIsRefreshing(false), 600);
  }, [fetchGoals]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingGoalId(null);
    setEditingGoalData(null);
  }, []);

  const handleSuccess = useCallback(() => {
    handleRefresh();
    handleModalClose();
  }, [handleRefresh, handleModalClose]);

  const handleEdit = (goalId: string) => {
    const goal = goals.find((g) => g._id === goalId);
    if (goal) {
      setEditingGoalId(goalId);
      setEditingGoalData({
        goalAmount: goal.goalAmount,
        month: goal.month,
        year: goal.year,
        note: goal.note || "",
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (goalId: string) => {
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
      try {
        const res = await axios.delete(`/api/income-goals/${goalId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          toast.success("Income goal deleted");
          fetchGoals(1);
        }
      } catch (error) {
        const errorMessage =
          error instanceof axios.AxiosError
            ? error.response?.data?.message
            : "Failed to delete income goal";
        toast.error(errorMessage);
      }
    }
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchGoals(nextPage);
    }
  };

  const handleClearFilter = () => {
    setFilterMonth(null);
    setFilterYear(null);
  };

  const filteredGoals = goals.filter((goal) => {
    if (filterMonth && goal.month !== filterMonth) return false;
    if (filterYear && goal.year !== filterYear) return false;
    return true;
  });

  const groupedByYearAndMonth = goals.reduce(
    (acc, goal) => {
      if (!acc[goal.year]) acc[goal.year] = {};
      if (!acc[goal.year][goal.month]) acc[goal.year][goal.month] = [];
      acc[goal.year][goal.month].push(goal);
      return acc;
    },
    {} as Record<number, Record<number, IncomeGoal[]>>
  );

  const allYears = Array.from(new Set(goals.map((g) => g.year))).sort(
    (a, b) => b - a
  );

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-[#BDFE00]";
    if (percentage >= 80) return "bg-emerald-400";
    if (percentage >= 50) return "bg-yellow-400";
    return "bg-rose-400";
  };

  const getTextColor = (percentage: number) => {
    if (percentage >= 100) return "text-[#BDFE00]";
    if (percentage >= 80) return "text-emerald-400";
    if (percentage >= 50) return "text-yellow-400";
    return "text-rose-400";
  };

  return (
    <div className="w-full min-h-screen text-white space-y-6 sm:space-y-8 p-3 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
            INCOME TARGETS
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Income Goals
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Set monthly income targets and track your earning progress.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => {
              setEditingGoalId(null);
              setEditingGoalData(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#BDFE00] text-black font-semibold text-xs sm:text-sm hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <FiPlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>New Goal</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            title="Refresh"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#BDFE00]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Filters */}
      {!loading && goals.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={filterMonth || ""}
              onChange={(e) =>
                setFilterMonth(e.target.value ? Number(e.target.value) : null)
              }
              className="px-4 py-2.5 text-sm rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors w-full sm:w-40 cursor-pointer"
            >
              <option value="" className="bg-[#0B0F17]">
                All Months
              </option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month} className="bg-[#0B0F17]">
                  {monthNames[month]}
                </option>
              ))}
            </select>

            <select
              value={filterYear || ""}
              onChange={(e) =>
                setFilterYear(e.target.value ? Number(e.target.value) : null)
              }
              className="px-4 py-2.5 text-sm rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors w-full sm:w-40 cursor-pointer"
            >
              <option value="" className="bg-[#0B0F17]">
                All Years
              </option>
              {allYears.map((year) => (
                <option key={year} value={year} className="bg-[#0B0F17]">
                  {year}
                </option>
              ))}
            </select>

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

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-36 rounded-lg bg-white/10 animate-pulse" />
                <div className="h-5 w-12 rounded-full bg-white/5 animate-pulse" />
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 animate-pulse">
                <div className="h-16 w-full rounded-xl bg-white/5 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="p-5 rounded-2xl border border-white/10 bg-slate-900/60 space-y-4"
                    >
                      <div className="h-5 w-24 rounded bg-white/10" />
                      <div className="h-14 rounded-xl bg-white/5" />
                      <div className="h-2 rounded-full bg-white/5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && goals.length === 0 && (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/10 bg-slate-900/20">
          <FiTarget size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-lg font-bold text-white">No income goals yet</p>
          <p className="text-sm text-slate-400 mt-1">
            Set your first monthly income target to get started
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-5 py-2.5 rounded-xl font-semibold bg-[#BDFE00] text-black hover:bg-[#aef000] transition-all cursor-pointer text-sm"
          >
            Set Income Goal
          </button>
        </div>
      )}

      {/* No Filter Results */}
      {!loading && goals.length > 0 && filteredGoals.length === 0 && (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/10 bg-slate-900/20 space-y-4">
          <p className="text-lg font-bold text-white">
            No goals match your filters
          </p>
          <button
            onClick={handleClearFilter}
            className="px-5 py-2.5 rounded-xl font-semibold bg-[#BDFE00] text-black hover:bg-[#aef000] transition-all cursor-pointer text-sm"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Goals Grouped by Year & Month */}
      {!loading &&
        filteredGoals.length > 0 &&
        allYears
          .filter((year) => !filterYear || year === filterYear)
          .map((year) => {
            const yearGoalCount = Object.values(
              groupedByYearAndMonth[year] || {}
            ).reduce((total, monthGoals) => total + monthGoals.length, 0);

            return (
              <div key={year} className="space-y-6">
                {/* Year Header */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <h2 className="text-2xl font-extrabold text-white">{year}</h2>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-[#BDFE00]">
                    {yearGoalCount} goal{yearGoalCount !== 1 ? "s" : ""}
                  </span>
                </div>

                {Array.from({ length: 12 }, (_, i) => i + 1)
                  .filter((month) => {
                    if (filterMonth && month !== filterMonth) return false;
                    return groupedByYearAndMonth[year]?.[month]?.length > 0;
                  })
                  .sort((a, b) => b - a)
                  .map((month) => {
                    const monthGoals = groupedByYearAndMonth[year][month];
                    const totalGoal = monthGoals.reduce(
                      (sum, g) => sum + g.goalAmount,
                      0
                    );
                    const totalEarned = monthGoals.reduce(
                      (sum, g) => sum + g.earned,
                      0
                    );
                    const totalRemaining = Math.max(totalGoal - totalEarned, 0);

                    return (
                      <div key={`${year}-${month}`} className="space-y-4">
                        {/* Month Header */}
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-slate-200">
                            {monthNames[month]} {year}
                          </h3>
                          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                            {monthGoals.length} goal
                            {monthGoals.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Monthly Summary */}
                        <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-5">
                          <div className="grid grid-cols-3 gap-4 font-mono text-center sm:text-left">
                            <div>
                              <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                                Total Goal
                              </p>
                              <p className="text-lg sm:text-xl font-bold text-white">
                                ৳{totalGoal.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                                Total Earned
                              </p>
                              <p className="text-lg sm:text-xl font-bold text-emerald-400">
                                ৳{totalEarned.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                                Remaining
                              </p>
                              <p
                                className={`text-lg sm:text-xl font-bold ${totalRemaining === 0 ? "text-[#BDFE00]" : "text-yellow-400"}`}
                              >
                                ৳{totalRemaining.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Goal Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {monthGoals.map((goal) => {
                            const percentage = Math.min(
                              (goal.earned / goal.goalAmount) * 100,
                              100
                            );
                            const remaining = Math.max(
                              goal.goalAmount - goal.earned,
                              0
                            );
                            const isAchieved = goal.earned >= goal.goalAmount;

                            return (
                              <div
                                key={goal._id}
                                className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:border-white/20 transition-all duration-300 shadow-xl"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-[#BDFE00]/10 flex items-center justify-center text-[#BDFE00]">
                                      <FiTarget size={14} />
                                    </div>
                                    <h4 className="text-sm font-bold text-white tracking-wide">
                                      Income Goal
                                    </h4>
                                  </div>
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => handleEdit(goal._id)}
                                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                      title="Edit goal"
                                    >
                                      <FiEdit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(goal._id)}
                                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                      title="Delete goal"
                                    >
                                      <FiTrash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3 p-3 rounded-xl bg-white/5 border border-white/5 font-mono">
                                  <div>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">
                                      Earned
                                    </p>
                                    <p className="text-base font-bold text-emerald-400">
                                      ৳{goal.earned.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">
                                      Goal
                                    </p>
                                    <p className="text-base font-bold text-white">
                                      ৳{goal.goalAmount.toLocaleString()}
                                    </p>
                                  </div>
                                </div>

                                {goal.note && (
                                  <p className="mb-3 text-xs italic text-slate-400 bg-white/[0.02] p-2 rounded-lg border border-white/5">
                                    &ldquo;{goal.note}&rdquo;
                                  </p>
                                )}

                                <div className="mb-2.5">
                                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-white/5">
                                    <div
                                      className={`h-full rounded-full ${getProgressColor(percentage)} transition-all duration-300`}
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-xs font-mono font-semibold">
                                  <span className={getTextColor(percentage)}>
                                    {isAchieved
                                      ? "🎉 Achieved!"
                                      : `${percentage.toFixed(0)}% Complete`}
                                  </span>
                                  <span
                                    className={
                                      isAchieved
                                        ? "text-[#BDFE00]"
                                        : "text-slate-300"
                                    }
                                  >
                                    {isAchieved ? (
                                      <>
                                        +৳
                                        {(goal.earned - goal.goalAmount).toLocaleString()}
                                      </>
                                    ) : (
                                      <>৳{remaining.toLocaleString()} to go</>
                                    )}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })}

      {/* Load More */}
      {hasMore && goals.length > 0 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 rounded-xl font-semibold border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Modal */}
      <IncomeGoalModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        editingGoalId={editingGoalId}
        editingGoalData={editingGoalData}
      />
    </div>
  );
};

export default IncomePage;
