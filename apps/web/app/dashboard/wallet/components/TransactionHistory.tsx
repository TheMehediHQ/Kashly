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
    const result = await Swal.fire({
      title: "Confirm Deletion",
      text: "This transaction will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#334155",
      background: "#0B0F17",
      color: "#ffffff",
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
      <div className="w-full space-y-6">
        <div className="space-y-3">
          <div className="h-8 w-56 rounded-xl bg-white/10 animate-pulse" />
          <div className="h-4 w-64 rounded-lg bg-white/5 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
          <div className="h-32 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 animate-pulse flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-white/10" />
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded bg-white/10" />
                  <div className="h-5 w-28 rounded bg-white/10" />
                </div>
              </div>
              <div className="h-6 w-20 rounded bg-white/10" />
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

          @page {
            margin: 25mm;
            size: A4;
          }

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md print-hidden"
          onClick={() => setSelectedImg(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImg(null);
            }}
          >
            <FiX size={24} />
          </button>

          <div
            className="relative h-[85vh] w-[90vw] max-w-4xl"
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

          <p className="absolute bottom-5 text-xs font-mono text-slate-400">
            Click outside to close preview
          </p>
        </div>
      )}

      {/* HEADER & FILTERS */}
      <div className="mb-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10 print-hidden">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Transaction History
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Detailed breakdown of recent cash flows
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* TYPE FILTER */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setType("all")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  type === "all"
                    ? "bg-[#BDFE00] text-black shadow-[0_0_15px_rgba(189,254,0,0.2)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setType("income")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  type === "income"
                    ? "bg-[#BDFE00] text-black shadow-[0_0_15px_rgba(189,254,0,0.2)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setType("expense")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  type === "expense"
                    ? "bg-[#BDFE00] text-black shadow-[0_0_15px_rgba(189,254,0,0.2)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Expense
              </button>
            </div>

            {/* MONTH & YEAR DROPDOWNS */}
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors cursor-pointer"
            >
              <option value="" className="bg-[#0B0F17] text-white">All Months</option>
              <option value="1" className="bg-[#0B0F17] text-white">January</option>
              <option value="2" className="bg-[#0B0F17] text-white">February</option>
              <option value="3" className="bg-[#0B0F17] text-white">March</option>
              <option value="4" className="bg-[#0B0F17] text-white">April</option>
              <option value="5" className="bg-[#0B0F17] text-white">May</option>
              <option value="6" className="bg-[#0B0F17] text-white">June</option>
              <option value="7" className="bg-[#0B0F17] text-white">July</option>
              <option value="8" className="bg-[#0B0F17] text-white">August</option>
              <option value="9" className="bg-[#0B0F17] text-white">September</option>
              <option value="10" className="bg-[#0B0F17] text-white">October</option>
              <option value="11" className="bg-[#0B0F17] text-white">November</option>
              <option value="12" className="bg-[#0B0F17] text-white">December</option>
            </select>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors cursor-pointer"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y.toString()} className="bg-[#0B0F17] text-white">
                  {y}
                </option>
              ))}
            </select>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchTransactions(type, month, year)}
                disabled={isRefreshing}
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh Transactions"
              >
                <FiRefreshCw className={isRefreshing ? "animate-spin" : ""} size={16} />
              </button>

              <button
                onClick={handlePrint}
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Print Report"
              >
                <FiPrinter size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      {summary && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* INCOME CARD */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#BDFE00] mb-1">
                  Total Income
                </p>
                <p className="text-3xl font-extrabold text-[#BDFE00] font-mono">
                  ৳{summary.thisMonthIncome.toLocaleString()}
                </p>
                <p className="text-xs font-mono text-slate-400 mt-2">
                  {summary.incomeTransactions} transaction{summary.incomeTransactions !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-[#BDFE00]/20 text-5xl">
                <FiArrowUpRight size={44} />
              </div>
            </div>
          </div>

          {/* EXPENSE CARD */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 mb-1">
                  Total Expense
                </p>
                <p className="text-3xl font-extrabold text-rose-400 font-mono">
                  ৳{summary.thisMonthExpense.toLocaleString()}
                </p>
                <p className="text-xs font-mono text-slate-400 mt-2">
                  {summary.expenseTransactions} transaction{summary.expenseTransactions !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-rose-400/20 text-5xl">
                <FiArrowDownLeft size={44} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTIONS LIST */}
      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map((transaction) => {
            const isIncome = transaction.transactionType === "income";
            const transactionId = transaction._id;

            return (
              <div
                key={transactionId}
                className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-5 sm:flex-row sm:items-center sm:justify-between transition-all hover:border-white/20 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 shrink-0">
                    {transaction.attachment ? (
                      <img
                        src={transaction.attachment}
                        alt="receipt"
                        className="h-full w-full cursor-zoom-in rounded-xl object-cover ring-1 ring-white/10 hover:scale-105 transition-transform"
                        onClick={() => setSelectedImg(transaction.attachment!)}
                      />
                    ) : (
                      <div
                        className={`flex h-full w-full items-center justify-center rounded-xl text-xl ${
                          isIncome
                            ? "bg-[#BDFE00]/10 text-[#BDFE00]"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {getCategoryIcon(transaction.category)}
                      </div>
                    )}
                    <div
                      className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#0B0F17] ${
                        isIncome ? "bg-[#BDFE00] text-black" : "bg-rose-500 text-white"
                      } text-[10px] font-bold`}
                    >
                      {isIncome ? <FiArrowUpRight /> : <FiArrowDownLeft />}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {transaction.method}
                    </span>
                    <h3 className="font-bold text-white text-base">
                      {transaction.category}
                    </h3>
                    {transaction.note && (
                      <p className="max-w-xs truncate text-xs italic text-slate-400 sm:max-w-sm mt-0.5">
                        "{transaction.note}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 sm:justify-end sm:pt-0 sm:gap-6 border-t border-white/5 sm:border-none">
                  <div className="text-left sm:text-right font-mono">
                    <p className={`text-lg font-bold ${isIncome ? "text-[#BDFE00]" : "text-rose-400"}`}>
                      {isIncome ? "+" : "-"} ৳{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">
                      {transaction.date} • {transaction.time}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 print-hidden">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="rounded-xl p-2 bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Edit Transaction"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(transactionId)}
                      className="rounded-xl p-2 bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Transaction"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/20 p-12 text-center text-slate-400">
            <p className="text-base font-bold text-white">No transactions found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting filters or recording a transaction</p>
          </div>
        )}

        {/* LOAD MORE BUTTON */}
        {hasMore && transactions.length > 0 && (
          <div className="flex justify-center pt-4 print-hidden">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="px-6 py-3 rounded-xl font-semibold border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoadingMore ? "Loading..." : "Load More Activity"}
            </button>
          </div>
        )}
      </div>

      {/* PRINT REPORT FOOTER */}
      <div className="print-hidden" style={{ display: "none" }}>
        <div className="print-footer">
          <div className="footer-line">
            End of Financial Report
          </div>
          <div className="footer-line">
            This document is auto-generated and contains confidential financial information.
          </div>
          <div className="footer-line">
            © {new Date().getFullYear()} NexVibe | All rights reserved
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