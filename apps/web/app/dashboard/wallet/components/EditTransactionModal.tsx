"use client";

import axios, { AxiosError } from "axios";
import Image from "next/image";
import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTheme } from "@/app/context/ThemeContext";
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
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
  );

  const isIncome = transactionType === "income";
  const themeColor = isIncome ? "emerald" : "rose";
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
    "House Rent",
    "Utilities",
    "Mobile & Internet",
    "Loan/EMI",
    "Subscriptions",
    "Groceries",
    "Transport",
    "Healthcare",
    "Education",
    "Personal Care",
    "Dining",
    "Shopping",
    "Gadgets",
    "Entertainment",
    "Travel",
    "Family Support",
    "Religious/Charity",
    "Savings",
    "Emergency Fund",
    "Investment",
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
      amount: undefined,
      category: categories[0],
      method: "Cash",
      date: new Date().toISOString().split("T")[0],
      time: new Date()
        .toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .toUpperCase(),
      note: "",
    },
  });

  useEffect(() => {
    if (!isOpen || !initialTransaction || initialTransaction._id !== transactionId) {
      return;
    }

    setTransactionType(initialTransaction.transactionType);
    setValue("amount", initialTransaction.amount);
    setValue("category", initialTransaction.category);
    setValue("method", initialTransaction.method);
    setValue("date", initialTransaction.date);
    setValue("time", normalizeTimeForInput(initialTransaction.time));
    setValue("note", initialTransaction.note || "");
    setValue("attachment", initialTransaction.attachment || "");
    setPreview(initialTransaction.attachment || null);
  }, [isOpen, transactionId, initialTransaction, setValue]);

  const handleClose = (): void => {
    onClose();
    reset();
    setPreview(null);
  };

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>
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
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (!response.ok) {
        return;
      }
      setValue("attachment", data.secure_url);
      setPreview(data.secure_url);
    } catch {
      // Connection error silently handled
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transactions/${transactionId}`,
        updateData,
        { withCredentials: true }
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

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-lg transition-opacity duration-300"
        onClick={handleClose}
      ></div>
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4 pointer-events-none">
        <div
          className={`pointer-events-auto relative w-full max-w-md rounded-2xl sm:rounded-3xl border transition-all duration-300 transform scale-100 max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh] overflow-hidden ${isDark ? "border-neutral-700" : "border-neutral-300"}`}
          onClick={(e) => e.stopPropagation()}
          style={{ 
            backgroundColor: isDark ? "#111111" : "#FFFFFF",
            boxShadow: isDark 
              ? "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)" 
              : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.05)"
          }}
        >
          <div className="overflow-y-auto max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh] p-4 sm:p-6 md:p-8">
            <button
              type="button"
              onClick={handleClose}
              className={`absolute right-3 top-3 sm:right-4 sm:top-4 p-2 rounded-lg transition-all duration-200 hover:scale-110 ${isDark ? "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800" : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"}`}
            >
              <FiX size={24} />
            </button>

            <form className="space-y-5 sm:space-y-6 md:space-y-8" onSubmit={handleSubmit(onSubmit)}>
                {/* Image Section */}
                <div className="flex flex-col items-center justify-center">
                  {!preview ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`group relative flex h-24 w-24 sm:h-28 sm:w-28 md:h-36 md:w-36 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed transition-all duration-300 ${isDark ? "border-neutral-700 bg-neutral-800 hover:border-neutral-600 hover:bg-neutral-700" : "border-neutral-300 bg-neutral-50 hover:border-neutral-500 hover:bg-neutral-100"}`}
                    >
                      <FiUploadCloud
                        size={28}
                        className={`transition-colors duration-200 group-hover:scale-110 ${isUploading ? "animate-spin" : ""} ${isDark ? "text-neutral-500 group-hover:text-neutral-400" : "text-neutral-400 group-hover:text-neutral-600"}`}
                      />
                      <span className={`mt-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 ${isDark ? "text-neutral-500 group-hover:text-neutral-400" : "text-neutral-400 group-hover:text-neutral-600"}`}>
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
                    <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-36 md:w-36 group">
                      <Image
                        src={preview || ""}
                        alt="Preview"
                        fill
                        className={`rounded-full object-cover border ${isDark ? "border-neutral-700" : "border-neutral-300"}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setValue("attachment", "");
                        }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiTrash2 size={24} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Amount Display */}
                <div
                  className={`group rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 transition-all duration-300 border focus-within:ring-2 focus-within:ring-offset-0`}
                  style={{
                    backgroundColor: isDark ? "#1a1a1a" : "#f9f9f9",
                    borderColor: errors.amount
                      ? "#ef4444"
                      : themeColor === "emerald"
                        ? "#10b981"
                        : "#f43f5e",
                    boxShadow: isDark ? "inset 0 1px 3px rgba(0, 0, 0, 0.3)" : "inset 0 1px 3px rgba(0, 0, 0, 0.05)"
                  }}
                >
                  <p className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-${themeColor}-600 mb-2`}>
                    Total {label}
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-3xl md:text-5xl font-bold ${isDark ? "text-white" : "text-black"}`}
                    >
                      ৳
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-"].includes(e.key) &&
                        e.preventDefault()
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
                      className={`w-full bg-transparent text-3xl sm:text-4xl md:text-6xl font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isDark ? "text-white placeholder:text-neutral-600" : "text-black placeholder:text-neutral-400"}`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-2 text-[10px] font-bold text-red-500 uppercase">
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                {/* Grid for Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="relative group">
                    <FiTag className={`absolute left-4 top-1/2 -translate-y-1/2 text-${themeColor}-500 z-10`} />
                    <select
                      {...register("category", { required: true })}
                      className={`w-full appearance-none rounded-xl border-none pl-11 pr-10 py-3 md:py-4 text-sm font-medium ring-1 ring-neutral-300 dark:ring-neutral-600 focus:ring-2 focus:ring-offset-0 outline-none cursor-pointer transition-all duration-200 hover:ring-neutral-400 dark:hover:ring-neutral-500 ${isDark ? "text-white" : "text-black"}`}
                      style={{ backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" }}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 pointer-events-none" />
                  </div>

                  <div className="relative group">
                    <FiCreditCard className={`absolute left-4 top-1/2 -translate-y-1/2 text-${themeColor}-500 z-10`} />
                    <select
                      {...register("method", { required: true })}
                      className={`w-full appearance-none rounded-xl border-none pl-11 pr-10 py-3 md:py-4 text-sm font-medium ring-1 ring-neutral-300 dark:ring-neutral-600 focus:ring-2 focus:ring-offset-0 outline-none cursor-pointer transition-all duration-200 hover:ring-neutral-400 dark:hover:ring-neutral-500 ${isDark ? "text-white" : "text-black"}`}
                      style={{ backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" }}
                    >
                      <option value="Cash">Cash</option>
                      <option value="bKash">BKash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Rocket">Rocket</option>
                      <option value="Bank">Bank Transfer</option>
                      <option value="Card">Card</option>
                      <option value="Other">Other</option>
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Grid for Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="relative">
                    <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
                    <input
                      type="date"
                      {...register("date", { required: true })}
                      className={`w-full rounded-xl border-none pl-11 py-3 md:py-4 text-sm font-medium ring-1 ring-neutral-300 dark:ring-neutral-600 focus:ring-2 focus:ring-offset-0 outline-none transition-all duration-200 hover:ring-neutral-400 dark:hover:ring-neutral-500 ${isDark ? "text-white" : "text-black"} ${isDark ? "dark:placeholder:text-neutral-500" : "placeholder:text-neutral-400"}`}
                      style={{ backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" }}
                    />
                  </div>
                  <div className="relative">
                    <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
                    <input
                      type="time"
                      {...register("time", { required: true })}
                      className={`w-full rounded-xl border-none pl-11 py-3 md:py-4 text-sm font-medium ring-1 ring-neutral-200 focus:ring-1 focus:ring-neutral-400 outline-none ${isDark ? "text-white bg-neutral-800" : "text-black bg-neutral-100"} ${isDark ? "dark:placeholder:text-neutral-500" : "placeholder:text-neutral-400"}`}
                    />
                  </div>
                </div>

                {/* Note Area */}
                <div className="relative">
                  <FiEdit3 className="absolute left-4 top-5 text-neutral-500 dark:text-neutral-400" />
                  <textarea
                    placeholder="Add a reference note..."
                    rows={3}
                    {...register("note")}
                    className={`w-full rounded-xl border-none pl-11 pr-4 py-3 md:py-4 text-sm font-medium ring-1 ring-neutral-300 dark:ring-neutral-600 focus:ring-2 focus:ring-offset-0 outline-none transition-all duration-200 hover:ring-neutral-400 dark:hover:ring-neutral-500 resize-none ${isDark ? "text-white" : "text-black"} ${isDark ? "dark:placeholder:text-neutral-500" : "placeholder:text-neutral-400"}`}
                    style={{ backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" }}
                  />
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800 mt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`flex-1 rounded-lg py-3 md:py-4 text-xs font-medium uppercase tracking-wide transition-all border ${
                      isDark
                        ? "bg-black text-white hover:bg-neutral-800 border-neutral-700"
                        : "bg-white text-black hover:bg-neutral-50 border-neutral-300"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`flex-1 rounded-lg py-3 md:py-4 text-xs font-semibold uppercase tracking-wide transition-all duration-200 border
                      ${isUploading ? `${isDark ? "bg-neutral-800 text-neutral-500 border-neutral-700" : "bg-neutral-200 text-neutral-400 border-neutral-300"} cursor-not-allowed opacity-70` : `${isDark ? "bg-white text-black border-white hover:bg-neutral-100" : "bg-black text-white border-black hover:bg-neutral-800"} hover:shadow-lg active:scale-95`}`}
                  >
                    {isUploading ? "Uploading..." : "Update Entry"}
                  </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTransactionModal;
