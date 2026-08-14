"use client";

import axios from "axios";
import React, { useState, useRef, ChangeEvent } from "react";
import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  FiPlusCircle,
  FiMinusCircle,
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
import { useAuth } from "@/app/context/AuthContext";

interface FormValues {
  amount: number;
  category: string;
  method: string;
  date: string;
  time: string;
  note: string;
  attachment?: string;
}

interface TransactionModalProps {
  type: "income" | "expense";
  onSuccess: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  type,
  onSuccess,
}) => {
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const noCredits = user?.credits < 1;

  // Configuration based on type
  const isIncome = type === "income";
  const label = isIncome ? "Income" : "Expense";

  const categories = isIncome
    ? [
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
      ]
    : [
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

  const handleClose = (): void => {
    setOpen(false);
    reset();
    setPreview(null);
    setError("");
  };

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!preset || !cloudName) {
      setError("Environment variables are missing.");
      return;
    }

    setIsUploading(true);
    setError("");

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
        setError(data.error.message);
        return;
      }
      setValue("attachment", data.secure_url);
      setPreview(data.secure_url);
    } catch {
      setError("Connection error");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const transactionData = {
      ...formData,
      transactionType: type,
      time: format(new Date(`1970-01-01T${formData.time}`), "hh:mm a"),
    };

    try {
      const res = await axios.post(`/api/transactions`, transactionData, {
        withCredentials: true,
      });

      if (res.data.success) {
        handleClose();
        toast.success(`${label} added successfully`);
        if (user) {
          setUser({ ...user, credits: (user.credits ?? 1) - 1 });
        }
        onSuccess();
      }
    } catch (error: unknown) {
      const errMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : `Failed to add ${type}`;
      toast.error(errMsg);
    }
  };

  return (
    <>
      {/* Compact SaaS Pill Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (noCredits) {
            toast.error(
              "No credits left. Please contact admin to add more credits."
            );
            return;
          }
          setOpen(true);
        }}
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border font-mono text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer active:scale-95 shadow-md ${
          noCredits ? "opacity-40 cursor-not-allowed" : ""
        } ${
          isIncome
            ? "border-[#BDFE00]/30 bg-[#BDFE00]/10 hover:bg-[#BDFE00]/20 text-[#BDFE00] hover:shadow-[0_0_15px_rgba(189,254,0,0.15)]"
            : "border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]"
        }`}
      >
        {isIncome ? (
          <FiPlusCircle className="w-4 h-4 text-[#BDFE00]" />
        ) : (
          <FiMinusCircle className="w-4 h-4 text-rose-400" />
        )}
        <span>ADD {label.toUpperCase()}</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 pointer-events-none overflow-y-auto">
            <div
              className="pointer-events-auto relative w-full max-w-md rounded-3xl bg-[#0B0F17]/95 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-y-auto max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh] p-5 sm:p-7">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer z-10"
                >
                  <FiX size={20} />
                </button>

                {/* Header Badge */}
                <div className="mb-6 text-center">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wide mb-2 ${
                      isIncome
                        ? "bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-[#BDFE00]"
                        : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full animate-pulse ${
                        isIncome ? "bg-[#BDFE00]" : "bg-rose-500"
                      }`}
                    />
                    NEW {label.toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-white">Add {label}</h3>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  {/* Image Attachment Upload Section */}
                  <div className="flex flex-col items-center justify-center">
                    {!preview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`group relative flex h-24 w-24 sm:h-28 sm:w-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
                          error
                            ? "border-rose-500 bg-rose-500/10"
                            : "border-white/10 bg-white/5 hover:border-[#BDFE00]/50 hover:bg-white/[0.07]"
                        }`}
                      >
                        <FiUploadCloud
                          size={26}
                          className={`text-slate-400 group-hover:text-[#BDFE00] transition-colors ${
                            isUploading ? "animate-spin text-[#BDFE00]" : ""
                          }`}
                        />
                        <span className="mt-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 group-hover:text-slate-200">
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
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-full w-full rounded-2xl object-cover border border-white/20"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreview(null);
                            setValue("attachment", "");
                          }}
                          className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <FiTrash2 size={22} className="text-rose-400" />
                        </button>
                      </div>
                    )}
                    {error && (
                      <p className="mt-2 text-[10px] font-mono text-rose-400">
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Amount Display */}
                  <div
                    className={`rounded-2xl p-4 border transition-all bg-slate-900/50 ${
                      errors.amount
                        ? "border-rose-500/80"
                        : "border-white/10 focus-within:border-[#BDFE00]/60"
                    }`}
                  >
                    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                      Total {label} Amount
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-[#BDFE00] font-mono">
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
                        className="w-full bg-transparent text-3xl font-mono font-bold text-white outline-none placeholder:text-slate-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        autoFocus
                      />
                    </div>
                    {errors.amount && (
                      <p className="mt-2 text-[10px] font-mono text-rose-400">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>

                  {/* Grid for Category & Method */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Category Dropdown */}
                    <div className="relative group">
                      <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                      <select
                        {...register("category", { required: true })}
                        className="w-full appearance-none rounded-xl bg-white/5 border border-white/10 pl-10 pr-8 py-3 text-xs font-semibold text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors cursor-pointer"
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

                    {/* Method Dropdown */}
                    <div className="relative group">
                      <FiCreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                      <select
                        {...register("method", { required: true })}
                        className="w-full appearance-none rounded-xl bg-white/5 border border-white/10 pl-10 pr-8 py-3 text-xs font-semibold text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors cursor-pointer"
                      >
                        <option value="Cash" className="bg-[#0B0F17] text-white">
                          Cash
                        </option>
                        <option value="bKash" className="bg-[#0B0F17] text-white">
                          bKash
                        </option>
                        <option value="Nagad" className="bg-[#0B0F17] text-white">
                          Nagad
                        </option>
                        <option
                          value="Rocket"
                          className="bg-[#0B0F17] text-white"
                        >
                          Rocket
                        </option>
                        <option value="Bank" className="bg-[#0B0F17] text-white">
                          Bank Transfer
                        </option>
                        <option value="Card" className="bg-[#0B0F17] text-white">
                          Card
                        </option>
                        <option
                          value="Other"
                          className="bg-[#0B0F17] text-white"
                        >
                          Other
                        </option>
                      </select>
                      <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Grid for Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="date"
                        {...register("date", { required: true })}
                        className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-3 py-3 text-xs font-semibold text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <FiClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="time"
                        {...register("time", { required: true })}
                        className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-3 py-3 text-xs font-semibold text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Reference Note */}
                  <div className="relative">
                    <FiEdit3 className="absolute left-3.5 top-3.5 text-slate-400" />
                    <textarea
                      placeholder="Add reference note..."
                      rows={2}
                      {...register("note")}
                      className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-[#BDFE00]/60 transition-colors resize-none placeholder:text-slate-500"
                    />
                  </div>

                  {/* Footer Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="py-3 text-xs font-mono font-semibold rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className={`py-3 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer uppercase tracking-wider disabled:opacity-50 ${
                        isIncome
                          ? "bg-[#BDFE00] text-black hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)]"
                          : "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                      }`}
                    >
                      {isUploading ? "Uploading..." : `Save ${label}`}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TransactionModal;