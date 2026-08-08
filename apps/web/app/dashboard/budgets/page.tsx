"use client";

import React, { useState } from "react";
import { FiRefreshCw, FiPlusCircle } from "react-icons/fi";
import { useTheme } from "@/app/context/ThemeContext";
import BudgetHistory from "../wallet/components/BudgetHistory";
import BudgetModal from "../wallet/components/BudgetModal";

const BudgetsPage = () => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
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
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                className={`text-4xl sm:text-5xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                Budgets
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
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
              <button
                onClick={handleRefresh}
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                  isDark
                    ? "bg-black text-white hover:bg-neutral-800"
                    : "bg-white text-black hover:bg-neutral-50"
                }`}
                title="Refresh"
              >
                <FiRefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Budget History Component */}
          <div className="mb-8">
            <BudgetHistory key={refreshKey} onRefresh={handleRefresh} />
          </div>
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
