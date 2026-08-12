"use client";

import React, { useState, useCallback } from "react";
import { FiRefreshCw, FiPlusCircle } from "react-icons/fi";
import BudgetHistory from "../wallet/components/BudgetHistory";
import BudgetModal from "../wallet/components/BudgetModal";

const BudgetsPage = () => {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editingBudgetData, setEditingBudgetData] = useState<{
    category: string;
    limit: number;
    month: number;
    year: number;
    note?: string;
  } | null>(null);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    // Reset spin animation state
    setTimeout(() => setIsRefreshing(false), 600);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingBudgetId(null);
    setEditingBudgetData(null);
  }, []);

  const handleSuccess = useCallback(() => {
    handleRefresh();
    handleModalClose();
  }, [handleRefresh, handleModalClose]);

  return (
    <div className="w-full min-h-screen text-white space-y-6 sm:space-y-8 p-3 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
            FINANCIAL TARGETS
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Budgets Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Set spending limits and stay aligned with your monthly goals.
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => {
              setEditingBudgetId(null);
              setEditingBudgetData(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#BDFE00] text-black font-semibold text-xs sm:text-sm hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <FiPlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>New Budget</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            title="Refresh Budgets"
          >
            <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#BDFE00]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Full-width Budget History Component */}
      <div className="w-full">
        <BudgetHistory key={refreshKey} onRefresh={handleRefresh} />
      </div>

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

export default BudgetsPage;