"use client";

import axios, { AxiosError } from "axios";
import Image from "next/image";
import React, { useState, useRef, ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  FiX,
  FiCalendar,
  FiUploadCloud,
  FiClock,
  FiTag,
  FiCreditCard,
  FiEdit3,
  FiTrash2,
  FiChevronDown,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useModalA11y } from "./useModalA11y";

interface FormValues {
  amount: number;
  category: string;
  method: string;
  date: string;
  time: string;
  note: string;
  attachment?: string;
}

interface EditTransactionModalProps {
  transactionId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialTransaction?: Transaction | null;
}

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  method: string;
  date: string;
  time: string;
  note: string;
  attachment?: string;
  transactionType: "income" | "expense";
}

const normalizeTimeForInput = (timeValue: string): string => {
  if (!timeValue) return new Date().toTimeString().slice(0, 5);

  const match = timeValue
    .trim()
    .match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])?$/);

  if (!match) return new Date().toTimeString().slice(0, 5);

  let hour = Number(match[1]);
  const minute = match[2];
  const meridiem = match[3]?.toLowerCase();

  if (meridiem === "pm" && hour < 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${minute}`;
};

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transactionId,
  isOpen,
  onClose,
  onSuccess,
  initialTransaction,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    initialTransaction?.attachment ?? null,
  );

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const transactionType: "income" | "expense" =
    initialTransaction?.transactionType ?? "expense";

  const isIncome = transactionType === "income";
  const label = isIncome ? "Income" : "Expense";

  const incomeCategories = [
    "Salary",
    "Business Income",
    "Freelancing",
    "Tuition",
    "Commission",
    "Bonus",
    "Rental Income",
    "Agriculture/Farming",
    "Family Support",
    "Other Income",
  ];
  const expenseCategories = [
    // Housing & Bills
    "House Rent",
    "Utilities",
    "Mobile & Internet",

    // Financial Obligations
    "Loan/EMI",
    "Subscriptions",

    // Food & Daily Essentials
    "Groceries",
    "Dining",
    "Tea",

    // Transportation
    "Transport",

    // Health & Personal
    "Healthcare",
    "Personal Care",
    "Cosmetics",
    "Haircut",
    "Beard Care",

    // Education & Family
    "Education",
    "Family Support",

    // Lifestyle & Shopping
    "Clothing",
    "Shoes",
    "Shopping",
    "Gadgets",
    "Gifts",
    "Entertainment",
    "Travel",

    // Religious & Giving
    "Religious/Charity",
    "Donation (3% Income)",
    "Quantum Programme",
    "Etiman",
    "Qurbani (5% Income)",

    // Savings & Investments
    "Savings (10% Income)",
    "Emergency Fund",
    "Investment",

    // Other
    "Miscellaneous",
  ];
  const categories =
    transactionType === "income" ? incomeCategories : expenseCategories;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      amount: initialTransaction?.amount,
      category: initialTransaction?.category ?? categories[0],
      method: initialTransaction?.method ?? "Cash",
      date: initialTransaction?.date ?? new Date().toISOString().split("T")[0],
      time: normalizeTimeForInput(initialTransaction?.time ?? ""),
      note: initialTransaction?.note ?? "",
      attachment: initialTransaction?.attachment ?? "",
    },
  });

  const handleClose = (): void => {
    onClose();
    reset();
    setPreview(null);
  };

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!preset || !cloudName) {
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData },
      );
      const data = await response.json();
      if (!response.ok) {
        return;
      }
      setValue("attachment", data.secure_url);
      setPreview(data.secure_url);
    } catch {
      // Connection error handled silently
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const updateData = {
      ...formData,
      time: format(new Date(`1970-01-01T${formData.time}`), "hh:mm a"),
    };

    try {
      const res = await axios.put(
        `/api/transactions/${transactionId}`,
        updateData,
        { withCredentials: true },
      );

      if (res.data.success) {
        handleClose();
        toast.success("Transaction updated successfully");
        onSuccess();
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }> | Error;
      let errorMessage = "Failed to update transaction";

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    }
  };

  const { dialogRef } = useModalA11y({ isOpen, onClose });

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4 pointer-events-none">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-transaction-modal-title"
          tabIndex={-1}
          className="pointer-events-auto relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0B0F17] shadow-2xl overflow-hidden max-h-[calc(100dvh-1.5rem)] sm:max-h-[90dvh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="overflow-y-auto max-h-[calc(100dvh-1.5rem)] sm:max-h-[90dvh] p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wide mb-1 ${
                    isIncome
                      ? "bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-[#BDFE00]"
                      : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${isIncome ? "bg-[#BDFE00]" : "bg-rose-400"}`}
                  />
                  EDIT {label.toUpperCase()}
                </div>
                <h2
                  id="edit-transaction-modal-title"
                  className="text-xl font-bold text-white"
                >
                  Update Entry
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Image Section */}
              <div className="flex flex-col items-center justify-center">
                {!preview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative flex h-24 w-24 sm:h-28 sm:w-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 hover:border-[#BDFE00]/50 hover:bg-white/10 transition-all duration-300"
                  >
                    <FiUploadCloud
                      size={24}
                      className={`transition-colors duration-200 group-hover:scale-110 ${
                        isUploading
                          ? "animate-spin text-[#BDFE00]"
                          : "text-slate-400 group-hover:text-[#BDFE00]"
                      }`}
                    />
                    <span className="mt-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 group-hover:text-white">
                      Receipt
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                ) : (
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 group">
                    <Image
                      src={preview || ""}
                      alt="Preview"
                      fill
                      className="rounded-2xl object-cover border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setValue("attachment", "");
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 text-rose-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Amount Display */}
              <div className="rounded-2xl p-5 bg-white/5 border border-white/10 focus-within:border-[#BDFE00]/60 transition-colors">
                <p
                  className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-1 ${
                    isIncome ? "text-[#BDFE00]" : "text-rose-400"
                  }`}
                >
                  Total {label}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    ৳
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    onKeyDown={(e) =>
                      ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                    }
                    {...register("amount", {
                      required: "Amount is required",
                      valueAsNumber: true,
                      min: {
                        value: 0.01,
                        message: "Amount must be greater than 0",
                      },
                    })}
                    placeholder="0.00"
                    className="w-full bg-transparent text-3xl sm:text-4xl font-extrabold font-mono text-white outline-none placeholder:text-slate-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1.5 text-xs text-rose-400 font-medium">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Dropdowns Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <FiTag
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 ${
                      isIncome ? "text-[#BDFE00]" : "text-rose-400"
                    }`}
                  />
                  <select
                    {...register("category", { required: true })}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 pl-10 pr-9 py-3 text-sm font-medium text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option
                        key={cat}
                        value={cat}
                        className="bg-[#0B0F17] text-white"
                      >
                        {cat}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <FiCreditCard
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 ${
                      isIncome ? "text-[#BDFE00]" : "text-rose-400"
                    }`}
                  />
                  <select
                    {...register("method", { required: true })}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 pl-10 pr-9 py-3 text-sm font-medium text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors cursor-pointer"
                  >
                    <option value="Cash" className="bg-[#0B0F17] text-white">
                      Cash
                    </option>
                    <option value="bKash" className="bg-[#0B0F17] text-white">
                      BKash
                    </option>
                    <option value="Nagad" className="bg-[#0B0F17] text-white">
                      Nagad
                    </option>
                    <option value="Rocket" className="bg-[#0B0F17] text-white">
                      Rocket
                    </option>
                    <option value="Bank" className="bg-[#0B0F17] text-white">
                      Bank Transfer
                    </option>
                    <option value="Card" className="bg-[#0B0F17] text-white">
                      Card
                    </option>
                    <option value="Other" className="bg-[#0B0F17] text-white">
                      Other
                    </option>
                  </select>
                  <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    {...register("date", { required: true })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 py-3 text-sm font-medium text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors cursor-pointer"
                  />
                </div>
                <div className="relative">
                  <FiClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="time"
                    {...register("time", { required: true })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 py-3 text-sm font-medium text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors cursor-pointer"
                  />
                </div>
              </div>

              {/* Note Area */}
              <div className="relative">
                <FiEdit3 className="absolute left-3.5 top-3.5 text-slate-400" />
                <textarea
                  placeholder="Add a reference note..."
                  rows={3}
                  {...register("note")}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#BDFE00]/60 transition-colors resize-none"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold bg-[#BDFE00] text-black hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Update Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default EditTransactionModal;
