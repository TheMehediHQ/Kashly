"use client";

import React, { useState } from "react";
import { FiRefreshCw, FiPlusCircle } from "react-icons/fi";
import BudgetHistory from "../wallet/components/BudgetHistory";
import BudgetModal from "../wallet/components/BudgetModal";

const BudgetsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editingBudgetData, setEditingBudgetData] = useState<{
    category: string;
    limit: number;
    month: number;
    year: number;
    note?: string;
  } | null>(null);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBudgetId(null);
    setEditingBudgetData(null);
  };

  const handleSuccess = () => {
    handleRefresh();
    handleModalClose();
  };

  return (
    <div className="w-full min-h-screen text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
              FINANCIAL TARGETS
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Budgets Overview
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Set spending limits and stay aligned with monthly targets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingBudgetId(null);
                setEditingBudgetData(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#BDFE00] text-black font-semibold text-sm hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] transition-all active:scale-95 cursor-pointer"
            >
              <FiPlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>New Budget</span>
            </button>

            <button
              onClick={handleRefresh}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Refresh Budgets"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Budget History Component */}
        <div className="w-full">
          <BudgetHistory key={refreshKey} onRefresh={handleRefresh} />
        </div>
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