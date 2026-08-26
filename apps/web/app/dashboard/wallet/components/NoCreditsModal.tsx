"use client";

import React from "react";
import { createPortal } from "react-dom";
import { FiX, FiMessageCircle, FiPhone } from "react-icons/fi";
import { useModalA11y } from "./useModalA11y";

interface NoCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NoCreditsModal: React.FC<NoCreditsModalProps> = ({ isOpen, onClose }) => {
  const { dialogRef } = useModalA11y({ isOpen, onClose });

  if (!isOpen) return null;

  const whatsappNumber = "01747874773";
  const whatsappMessage = encodeURIComponent(
    "Hello, I need to recharge my credits for Kashly. Please help me."
  );
  const whatsappLink = `https://wa.me/88${whatsappNumber}?text=${whatsappMessage}`;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="no-credits-modal-title"
          tabIndex={-1}
          className="pointer-events-auto relative w-full max-w-md rounded-3xl bg-[#0B0F17]/95 border border-rose-500/30 backdrop-blur-xl shadow-2xl overflow-y-auto overflow-x-hidden max-h-[calc(100dvh-2rem)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer z-10"
          >
            <FiX size={20} />
          </button>

          {/* Content */}
          <div className="p-6 sm:p-8 text-center">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-4">
              <FiMessageCircle className="w-8 h-8 text-rose-400" />
            </div>

            {/* Title */}
            <h2 id="no-credits-modal-title" className="text-2xl font-bold text-white mb-2">
              No Credits Left!
            </h2>

            {/* Description */}
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              You have used all your credits. To continue adding transactions, please contact the admin to recharge your account.
            </p>

            {/* Admin Contact Info */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-6">
              <p className="text-xs text-slate-400 mb-2 font-mono uppercase tracking-wider">
                Contact Admin
              </p>
              <p className="text-lg font-bold text-white mb-1">
                WhatsApp Support
              </p>
              <p className="text-sm text-[#BDFE00] font-mono font-bold">
                {whatsappNumber}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* WhatsApp Button */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20BA5A] hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all duration-300 transform active:scale-95"
              >
                <FiPhone className="w-5 h-5" />
                <span>Contact via WhatsApp</span>
              </a>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 text-xs font-mono font-semibold rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
              >
                Close
              </button>
            </div>

            {/* Footer Note */}
            <p className="mt-6 text-xs text-slate-500">
              Admin will add credits to your account after verification.
            </p>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default NoCreditsModal;
