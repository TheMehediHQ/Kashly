/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  FiArrowUpRight,
  FiArrowDownLeft,
  FiShoppingBag,
  FiCoffee,
  FiHome,
  FiTruck,
  FiFileText,
  FiX,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiPrinter,
} from "react-icons/fi";
import { useTheme } from "@/app/context/ThemeContext";
import Swal from "sweetalert2";
import EditTransactionModal from "./EditTransactionModal";
import toast from "react-hot-toast";

interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  method: string;
  date: string;
  time: string;
  note: string;
  attachment?: string;
  transactionType: "income" | "expense";
  createdAt: { $date: string };
}

type TransactionFilter = "all" | "income" | "expense";

interface TransactionHistoryProps {
  refreshKey: number;
  onRefresh: () => void;
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("food") || cat.includes("coffee")) return <FiCoffee />;
  if (cat.includes("shop")) return <FiShoppingBag />;
  if (cat.includes("rent") || cat.includes("home")) return <FiHome />;
  if (cat.includes("transport") || cat.includes("travel")) return <FiTruck />;
  return <FiFileText />;
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  refreshKey,
  onRefresh,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<{ thisMonthIncome: number; thisMonthExpense: number; incomeTransactions: number; expenseTransactions: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [type, setType] = useState<TransactionFilter>("all");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const fetchTransactions = async (
    filterType = "all",
    filterMonth = "",
    filterYear = "",
    pageNum = 1
  ) => {
    try {
      if (pageNum === 1) setIsRefreshing(true);
      else setIsLoadingMore(true);

      let url = `/api/transactions?type=${filterType}&page=${pageNum}&limit=20`;

      if (filterMonth) {
        url += `&month=${filterMonth}`;
      }
      if (filterYear) {
        url += `&year=${filterYear}`;
      }

      const res = await axios.get(url, { withCredentials: true });
      if (pageNum === 1) {
        setTransactions(res.data.data);
      } else {
        setTransactions((prev) => [...prev, ...res.data.data]);
      }
      setHasMore(res.data.hasMore);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const fetchSummary = async (filterMonth = "", filterYear = "") => {
    try {
      let url = `/api/summary`;
      const params = new URLSearchParams();

      if (filterMonth) {
        params.append("month", filterMonth);
      }
      if (filterYear) {
        params.append("year", filterYear);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await axios.get(url, { withCredentials: true });
      setSummary(res.data.data);
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchTransactions(type, month, year, 1);
    fetchSummary(month, year);
  }, [type, month, year, refreshKey]);

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTransactions(type, month, year, nextPage);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransactionId(transaction._id);
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    console.log("id", id);
    const result = await Swal.fire({
      title: "Confirm Deletion",
      text: "This transaction will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.delete(
        `/api/transactions/${id}`,
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success("Transaction deleted successfully");

        // 🔄 refetch data
        onRefresh();
        fetchTransactions(type, month, year);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete transaction");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getMonthName = (monthNum: string) => {
    const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[parseInt(monthNum)] || "";
  };

  const getPeriodLabel = (): string => {
    if (month && year) {
      return `${getMonthName(month)} ${year}`;
    } else if (year && !month) {
      return `Year ${year}`;
    }
    return "All Time";
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-8 flex flex-col gap-6">
          <div>
            <div className={`h-8 w-56 rounded-lg animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
            <div className={`mt-2 h-4 w-64 rounded animate-pulse ${isDark ? "bg-slate-800" : "bg-slate-100"}`} />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className={`h-12 w-72 rounded-lg animate-pulse ${isDark ? "bg-slate-800" : "bg-slate-100"}`} />
            <div className={`h-10 w-44 rounded-lg animate-pulse ${isDark ? "bg-slate-800" : "bg-slate-100"}`} />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`h-36 rounded-xl animate-pulse ${isDark ? "bg-neutral-900 border border-slate-800" : "bg-white border border-slate-200"}`} />
          <div className={`h-36 rounded-xl animate-pulse ${isDark ? "bg-neutral-900 border border-slate-800" : "bg-white border border-slate-200"}`} />
        </div>

        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-6 ${isDark ? "border-slate-800 bg-neutral-900" : "border-slate-200 bg-white"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-lg animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                  <div>
                    <div className={`h-3 w-20 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                    <div className={`mt-2 h-5 w-24 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                  </div>
                </div>
                <div className="text-right">
                  <div className={`h-5 w-24 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                  <div className={`mt-2 h-3 w-28 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <style>{`
        @media print {
          * {
            margin: 0;
            padding: 0;
          }
          
          body {
            background: white;
            color: #2d3748;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            padding: 40px;
            line-height: 1.6;
          }

          .print-hidden {
            display: none !important;
          }

          .print-container {
            background: white;
            padding: 0;
            max-width: 950px;
            margin: 0 auto;
          }

          /* Header */
          .report-header {
            text-align: center;
            border-bottom: 2px solid #e2e8f0;
            padding: 50px 0 45px 0;
            margin-bottom: 60px;
            page-break-after: avoid;
          }

          .report-header h1 {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            color: #1a202c;
          }

          .report-header p {
            font-size: 14px;
            color: #718096;
            margin: 6px 0;
            line-height: 1.7;
            font-weight: 500;
          }

          .period-info {
            font-size: 15px;
            font-weight: 700;
            margin-top: 20px;
            color: #2d3748;
            padding-top: 18px;
            border-top: 1px solid #e2e8f0;
            letter-spacing: 0.3px;
          }

          /* Summary Section */
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-bottom: 60px;
            page-break-inside: avoid;
          }

          .summary-card {
            border: 1px solid #cbd5e0;
            padding: 32px 28px;
            text-align: center;
            page-break-inside: avoid;
            background-color: #f7fafc;
            border-radius: 4px;
          }

          .summary-card-label {
            font-size: 11px;
            font-weight: 700;
            color: #4a5568;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 14px;
          }

          .summary-card-value {
            font-size: 24px;
            font-weight: 800;
            color: #1a202c;
            line-height: 1.2;
            margin-bottom: 6px;
          }

          .summary-card-income .summary-card-value {
            color: #047857;
            font-size: 26px;
          }

          .summary-card-expense .summary-card-value {
            color: #dc2626;
            font-size: 26px;
          }

          /* Transactions Table */
          .transactions-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 40px;
            margin-bottom: 50px;
            font-size: 13px;
            page-break-inside: avoid;
          }

          .transactions-table thead {
            background-color: #edf2f7;
            border-top: 2px solid #cbd5e0;
            border-bottom: 2px solid #cbd5e0;
          }

          .transactions-table th {
            padding: 18px 14px;
            text-align: left;
            font-weight: 800;
            color: #1a202c;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1px;
          }

          .transactions-table td {
            padding: 16px 14px;
            border-bottom: 1px solid #e2e8f0;
            line-height: 1.6;
            color: #4a5568;
          }

          .transactions-table tr:nth-child(even) {
            background-color: #f9fafb;
          }

          .transactions-table tbody tr:last-child td {
            border-bottom: 2px solid #cbd5e0;
          }

          .transaction-amount {
            font-weight: 800;
            text-align: right;
            font-size: 14px;
          }

          .transaction-amount.income {
            color: #047857;
          }

          .transaction-amount.expense {
            color: #dc2626;
          }

          /* Footer */
          .print-footer {
            margin-top: 60px;
            padding: 40px 0;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #718096;
          }

          .footer-line {
            margin: 8px 0;
            line-height: 1.8;
          }

          .footer-line:first-child {
            font-weight: 700;
            color: #2d3748;
            font-size: 13px;
            margin-bottom: 12px;
            letter-spacing: 0.3px;
          }

          button, select, .print-controls {
            display: none !important;
          }

          .modal, .image-modal {
            display: none !important;
          }

          /* Page breaks */
          .transaction-card {
            page-break-inside: avoid;
          }

          /* Print specific spacing */
          @page {
            margin: 25mm;
            size: A4;
          }

          /* Detailed Transactions Header */
          h2 {
            font-size: 18px;
            font-weight: 800;
            margin: 60px 0 30px 0;
            padding: 0 0 16px 0;
            border-bottom: 2px solid #e2e8f0;
            color: #1a202c;
            letter-spacing: -0.3px;
          }
        }
      `}</style>
      {/* IMAGE PREVIEW MODAL */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 print-hidden"
          onClick={() => setSelectedImg(null)}
        >
          {/* Close Button */}
          <button
            className="absolute right-4 top-4 rounded-full bg-white/20 p-3 text-white"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImg(null);
            }}
          >
            <FiX size={28} />
          </button>

          {/* Image Container */}
          <div
            className="relative h-[90vh] w-[95vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImg}
              alt="preview"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Hint */}
          <p className="absolute bottom-5 text-sm text-neutral-500 dark:text-neutral-400">
            Click outside to close
          </p>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-6">
        {/* HEADER SECTION */}
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`}>
            Transaction History
          </h2>
          <p className={`text-sm font-medium ${isDark ? "text-slate-500" : "text-slate-600"}`}>
            Track your latest financial activity
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 print-hidden">
          <div className="flex items-center gap-3">
            {/* FILTER BUTTONS */}
            <div
              className={`flex items-center gap-1 p-1 rounded-lg border ${isDark ? "border-slate-800/60" : "border-slate-200"}`}
              style={{ backgroundColor: isDark ? "#111111" : "#FFFFFF" }}
            >
              <button
                onClick={() => setType("all")}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  type === "all"
                    ? isDark ? "text-white" : "text-black"
                    : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
                }`}
                style={type === "all" ? {backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5"} : {}}
              >
                All
              </button>
              <button
                onClick={() => setType("income")}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  type === "income"
                    ? isDark ? "text-white" : "text-black"
                    : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
                }`}
                style={type === "income" ? {backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5"} : {}}
              >
                Income
              </button>
              <button
                onClick={() => setType("expense")}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  type === "expense"
                    ? isDark ? "text-white" : "text-black"
                    : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
                }`}
                style={type === "expense" ? {backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5"} : {}}
              >
                Expense
              </button>
            </div>

            {/* BUTTONS */}
            <div className="flex items-center gap-2">
              {/* REFRESH BUTTON */}
              <button
                onClick={() => fetchTransactions(type, month, year)}
                disabled={isRefreshing}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${isDark ? "hover:bg-slate-900 text-slate-400" : "hover:bg-slate-200 text-slate-600"} disabled:opacity-50`}
                title="Refresh"
              >
                <FiRefreshCw className={isRefreshing ? "animate-spin" : ""} size={18} />
              </button>

              {/* PRINT BUTTON */}
              <button
                onClick={handlePrint}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${isDark ? "hover:bg-slate-900 text-slate-400 hover:text-slate-200" : "hover:bg-slate-200 text-slate-600 hover:text-slate-800"}`}
                title="Print Report"
              >
                <FiPrinter size={18} />
              </button>
            </div>
          </div>

          {/* DATE FILTERS */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* MONTH DROPDOWN */}
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={`px-3 py-2 text-sm font-medium rounded-lg border outline-none focus:ring-1 focus:ring-slate-400 ${isDark ? "border-slate-700 bg-slate-900 text-white" : "border-slate-300 bg-white text-black"}`}
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>

            {/* YEAR DROPDOWN */}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={`px-3 py-2 text-sm font-medium rounded-lg border outline-none focus:ring-1 focus:ring-slate-400 ${isDark ? "border-slate-700 bg-slate-900 text-white" : "border-slate-300 bg-white text-black"}`}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y.toString()}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* PRINT HEADER - Only visible when printing */}
      <div className="print-hidden" style={{ display: "none" }}>
        <div className="report-header">
          <h1>Financial Report</h1>
          <p>Transaction Summary & Activity Report</p>
          <div className="period-info">
            Reporting Period: {getPeriodLabel()}
          </div>
          <p style={{ fontSize: "12px", marginTop: "10px", color: "#718096", fontWeight: "500" }}>
            Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      {summary && (
        <>
          {/* Screen View */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 summary-cards">
            {/* INCOME CARD */}
            <div
            className="rounded-xl border p-8 transition-all"
            style={{
              backgroundColor: isDark ? "#111111" : "#FFFFFF",
              borderColor: "#10b981",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-600 mb-1">
                  Total Income
                </p>
                <p className="text-3xl font-bold text-emerald-500">
                  ৳{summary.thisMonthIncome.toLocaleString()}
                </p>
                <p className={`text-xs mt-2 ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                  {summary.incomeTransactions} transaction{summary.incomeTransactions !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-emerald-500/20 text-5xl">
                <FiArrowUpRight size={40} />
              </div>
            </div>
          </div>

          {/* EXPENSE CARD */}
          <div
            className="rounded-xl border p-8 transition-all"
            style={{
              backgroundColor: isDark ? "#111111" : "#FFFFFF",
              borderColor: "#f43f5e",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-rose-600 mb-1">
                  Total Expense
                </p>
                <p className="text-3xl font-bold text-rose-500">
                  ৳{summary.thisMonthExpense.toLocaleString()}
                </p>
                <p className={`text-xs mt-2 ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                  {summary.expenseTransactions} transaction{summary.expenseTransactions !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-rose-500/20 text-5xl">
                <FiArrowDownLeft size={40} />
              </div>
            </div>
          </div>
          </div>
        </>
      )}

      {/* PRINT VERSION - SUMMARY TABLE */}
      <div className="print-hidden" style={{ display: "none" }}>
        {summary && (
          <table className="transactions-table" style={{ marginBottom: "30px" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Metric</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                <th style={{ textAlign: "right" }}>Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: "#10b981", fontWeight: "600" }}>Total Income</td>
                <td className="transaction-amount income">৳{summary.thisMonthIncome.toLocaleString()}</td>
                <td style={{ textAlign: "right" }}>{summary.incomeTransactions}</td>
              </tr>
              <tr>
                <td style={{ color: "#ef4444", fontWeight: "600" }}>Total Expense</td>
                <td className="transaction-amount expense">৳{summary.thisMonthExpense.toLocaleString()}</td>
                <td style={{ textAlign: "right" }}>{summary.expenseTransactions}</td>
              </tr>
              <tr style={{ backgroundColor: isDark ? "#111111" : "#f5f5f5", fontWeight: "bold", borderTop: isDark ? "2px solid #1f2937" : "2px solid #333" }}>
                <td>Net Balance</td>
                <td className="transaction-amount" style={{ color: summary.thisMonthIncome - summary.thisMonthExpense >= 0 ? "#10b981" : "#ef4444" }}>
                  ৳{(summary.thisMonthIncome - summary.thisMonthExpense).toLocaleString()}
                </td>
                <td style={{ textAlign: "right" }}>{summary.incomeTransactions + summary.expenseTransactions}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <div className="grid gap-3">
        {transactions.length > 0 ? (
          transactions.map((transaction) => {
            const isIncome = transaction.transactionType === "income";
            const transactionId = transaction._id;

            return (
              <div
                key={transactionId}
                className={`group flex flex-col gap-4 rounded-xl border p-6 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between sm:gap-6 transaction-card ${isDark ? "border-slate-800/60" : "border-slate-200"}`}
                style={{backgroundColor: isDark ? "#111111" : "#FFFFFF"}}
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 shrink-0">
                    {transaction.attachment ? (
                      <img
                        src={transaction.attachment}
                        alt="receipt"
                        className={`h-full w-full cursor-zoom-in rounded-lg object-cover transition-transform hover:scale-105 ${isDark ? "ring-2 ring-slate-700" : "ring-2 ring-slate-300"}`}
                        onClick={() => setSelectedImg(transaction.attachment!)}
                      />
                    ) : (
                      <div
                        className={`flex h-full w-full items-center justify-center rounded-xl text-xl ${
                          isIncome
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {getCategoryIcon(transaction.category)}
                      </div>
                    )}
                    <div
                      className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        isDark ? "border-black" : "border-white"
                      } ${
                        isIncome ? "bg-emerald-500" : "bg-rose-500"
                      } text-[10px] text-white`}
                    >
                      {isIncome ? <FiArrowUpRight /> : <FiArrowDownLeft />}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                      {transaction.method}
                    </span>
                    <h3 className={`font-bold ${isDark ? "text-white" : "text-black"}`}>
                      {transaction.category}
                    </h3>
                    {transaction.note && (
                      <p className={`max-w-xs truncate text-xs italic ${isDark ? "text-slate-500" : "text-slate-500"} sm:max-w-sm`}>
                        {transaction.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className={`flex items-center justify-between pt-3 sm:justify-end sm:pt-0 sm:gap-6 ${isDark ? "border-t border-slate-800" : "border-t border-slate-200"} sm:border-none`}>
                  <div className="text-left sm:text-right">
                    <p className={`text-lg font-bold ${isIncome ? "text-emerald-500" : "text-rose-500"}`}>
                      {isIncome ? "+" : "-"} ৳{transaction.amount.toLocaleString()}
                    </p>
                    <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                      {transaction.date} • {transaction.time}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 print-hidden">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className={`rounded-lg p-2 transition-colors ${isDark ? "text-slate-500 hover:bg-slate-900 hover:text-white" : "text-slate-600 hover:bg-slate-200 hover:text-black"}`}
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(transactionId)}
                      className={`rounded-lg p-2 transition-colors ${isDark ? "text-slate-500 hover:bg-rose-500/10 hover:text-rose-400" : "text-slate-600 hover:bg-rose-100 hover:text-rose-600"}`}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={`rounded-lg border-2 border-dashed p-12 text-center ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-600"}`}>
            <p>No transactions found for this period.</p>
          </div>
        )}

        {/* LOAD MORE BUTTON */}
        {hasMore && transactions.length > 0 && (
          <div className="flex justify-center mt-4 print-hidden">
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
      </div>

      {/* PRINT TABLE VIEW */}
      <div className="print-hidden" style={{ display: "none" }}>
        {transactions.length > 0 && (
          <>
            <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "15px", borderBottom: "2px solid #333", paddingBottom: "10px" }}>
              Detailed Transactions
            </h2>
            <table className="transactions-table">
              <thead>
                <tr>
                  <th style={{ width: "12%" }}>Date</th>
                  <th style={{ width: "15%" }}>Category</th>
                  <th style={{ width: "15%" }}>Method</th>
                  <th style={{ width: "20%" }}>Description</th>
                  <th style={{ width: "15%" }}>Type</th>
                  <th style={{ width: "15%" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.method}</td>
                    <td style={{ fontSize: "11px" }}>{transaction.note || "—"}</td>
                    <td>
                      <span style={{
                        padding: "3px 8px",
                        borderRadius: "3px",
                        fontSize: "10px",
                        fontWeight: "600",
                        backgroundColor: transaction.transactionType === "income" ? "#d1fae5" : "#fee2e2",
                        color: transaction.transactionType === "income" ? "#065f46" : "#7f1d1d"
                      }}>
                        {transaction.transactionType === "income" ? "INCOME" : "EXPENSE"}
                      </span>
                    </td>
                    <td className={`transaction-amount ${transaction.transactionType === "income" ? "income" : "expense"}`}>
                      {transaction.transactionType === "income" ? "+" : "-"} ৳{transaction.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* PRINT FOOTER */}
      <div className="print-hidden" style={{ display: "none" }}>
        <div className="print-footer">
          <div className="footer-line">
            End of Financial Report
          </div>
          <div className="footer-line">
            This document is auto-generated and contains confidential financial information.
          </div>
          <div className="footer-line">
            © {new Date().getFullYear()} MoneyFlow | All rights reserved
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTransactionId && selectedTransaction && (
        <EditTransactionModal
          transactionId={editingTransactionId}
          initialTransaction={selectedTransaction || null}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTransactionId(null);
            setSelectedTransaction(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setEditingTransactionId(null);
            setSelectedTransaction(null);
            onRefresh();
            fetchTransactions(type, month, year);
          }}
        />
      )}
    </div>
  );
};

export default TransactionHistory;
