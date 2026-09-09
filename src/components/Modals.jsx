import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { CURRENCIES } from "../constants/data";
import { motion, AnimatePresence } from "framer-motion";
import VoiceTally from "./VoiceTally";
import SnapLogOCR from "./SnapLogOCR";
import SubscriptionModal from "./SubscriptionModal";
import SlipReceiptModal from "./SlipReceiptModal";

const VOICE_PRESETS = [
  {
    language: "isiZulu",
    phrase: "Kuthengiswe izinkwa ezintathu ze-Albany ngemali engu-R54",
    translation: "3 Albany bread cash R54",
    item: "Albany Superior Bread",
    qty: 3,
    tender: "Cash",
    total: 54,
  },
  {
    language: "Sesotho",
    phrase: "Mabala a mararo a lebese la Clover R45 chelete",
    translation: "3 Clover milk cash R45",
    item: "Clover Fresh Milk 1L",
    qty: 3,
    tender: "Cash",
    total: 45,
  },
  {
    language: "Afrikaans",
    phrase: "Twee Lucky Star pilchards kontant R48",
    translation: "2 Lucky Star pilchards cash R48",
    item: "Lucky Star Pilchards 400g",
    qty: 2,
    tender: "Cash",
    total: 48,
  },
  {
    language: "English",
    phrase: "3 Albany Superior Bread cash R54",
    translation: "3 Albany Superior Bread cash R54",
    item: "Albany Superior Bread",
    qty: 3,
    tender: "Cash",
    total: 54,
  },
];

export default function Modals() {
  const {
    saleModal,
    setSaleModal,
    customSaleModal,
    setCustomSaleModal,
    expenseModal,
    setExpenseModal,
    restockModal,
    setRestockModal,
    topUpModal,
    setTopUpModal,
    showStatementModal,
    setShowStatementModal,
    snapLogModal,
    setSnapLogModal,

    customSaleName,
    setCustomSaleName,
    customSaleAmount,
    setCustomSaleAmount,
    expenseTitle,
    setExpenseTitle,
    expenseAmount,
    setExpenseAmount,
    restockQty,
    setRestockQty,
    topUpCustom,
    setTopUpCustom,
    shareFeedback,
    setShareFeedback,

    snapLogStep,
    setSnapLogStep,
    snapLogProgress,
    snapLogImage,
    extractedTransactions,
    setExtractedTransactions,

    expenseCategories,
    wallet,
    currency,
    fmt,
    logSale,
    logCustomSale,
    logExpenseItem,
    confirmRestock,
    handleTopUp,
    handleSnapLogFileSelect,
    addSnapLogLineItem,
    updateSnapLogLineItem,
    toggleSnapLogTxType,
    confirmSnapLogImport,
    getStatementText,

    isPremium,
    setIsPremium,
    subscriptionModal,
    setSubscriptionModal,
    voiceTallyModal,
    setVoiceTallyModal,
    confirmVoiceTally,
    isOffline,
    offlineQueueCount,
  } = useApp();

  const [voiceState, setVoiceState] = useState("idle"); // idle, recording, parsed
  const [selectedVoicePreset, setSelectedVoicePreset] = useState(0);

  function handleStartRecording(presetIdx = selectedVoicePreset) {
    setSelectedVoicePreset(presetIdx);
    setVoiceState("recording");
    setTimeout(() => {
      setVoiceState("parsed");
    }, 1300);
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 350, damping: 28 } },
    exit: { y: "100%", opacity: 0, transition: { duration: 0.18 } },
  };

  return (
    <AnimatePresence>
      {/* 1. PRODUCT QUANTITY SALE CONFIRMATION MODAL */}
      {saleModal && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <motion.div variants={modalVariants} className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl p-5 bg-white space-y-3.5 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-[#152449]">{saleModal.name}</h4>
                <p className="text-[11px] font-semibold text-[#5B6B85]">Adjust quantity & confirm sale</p>
              </div>
              <button
                onClick={() => setSaleModal(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#5B6B85] hover:text-[#152449] transition cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 py-2 border-y border-[#E2E8F0] bg-[#F8FAFC] rounded-lg">
              <button
                onClick={() => setSaleModal({ ...saleModal, qty: Math.max(1, saleModal.qty - 1) })}
                className="w-9 h-9 rounded bg-white border border-[#E2E8F0] font-extrabold text-[#152449] text-base cursor-pointer"
              >
                -
              </button>
              <span className="text-2xl font-extrabold text-[#152449]">{saleModal.qty}</span>
              <button
                onClick={() => setSaleModal({ ...saleModal, qty: saleModal.qty + 1 })}
                className="w-9 h-9 rounded bg-white border border-[#E2E8F0] font-extrabold text-[#152449] text-base cursor-pointer"
              >
                +
              </button>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-xs font-bold text-[#5B6B85] uppercase">Total Price</span>
              <span className="text-lg font-extrabold text-[#1D4ED8]">
                {fmt((saleModal.price || 50) * saleModal.qty)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSaleModal(null)}
                className="flex-1 py-3 rounded-lg text-xs font-bold bg-white border border-[#E2E8F0] text-[#5B6B85] hover:text-[#152449] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => logSale(saleModal, saleModal.qty)}
                className="flex-1 py-3 rounded-lg text-xs font-extrabold text-white border border-[#1D4ED8] bg-[#1D4ED8] hover:bg-[#2B6CD4] cursor-pointer shadow-sm uppercase"
              >
                Commit Sale
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 2. CUSTOM SALE MODAL */}
      {customSaleModal && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <motion.div variants={modalVariants} className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl p-5 bg-white space-y-3 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-sm text-[#152449] uppercase tracking-wider">
                Custom Sale Entry
              </h4>
              <button
                onClick={() => setCustomSaleModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#5B6B85] hover:text-[#152449] transition cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#5B6B85] uppercase tracking-wider block">
                Item or Description
              </label>
              <input
                type="text"
                placeholder="Type to search items or services..."
                value={customSaleName}
                onChange={(e) => setCustomSaleName(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-lg text-xs outline-none border border-[#E2E8F0] text-[#152449] font-semibold focus:border-[#1D4ED8]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#5B6B85] uppercase tracking-wider block">
                Amount Received ({currency})
              </label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={customSaleAmount}
                onChange={(e) => setCustomSaleAmount(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-lg text-xs outline-none border border-[#E2E8F0] font-extrabold text-[#152449] focus:border-[#1D4ED8]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCustomSaleModal(false)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-white border border-[#E2E8F0] text-[#5B6B85] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={logCustomSale}
                className="flex-1 py-2.5 rounded-lg text-xs font-extrabold text-white border border-[#1D4ED8] bg-[#1D4ED8] hover:bg-[#2B6CD4] cursor-pointer shadow-sm uppercase"
              >
                Commit Sale
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 3. LOG EXPENSE MODAL */}
      {expenseModal && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <motion.div variants={modalVariants} className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl p-5 bg-white space-y-3 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-sm text-[#152449] uppercase tracking-wider">
                Record Operational Expense
              </h4>
              <button
                onClick={() => setExpenseModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#5B6B85] hover:text-[#152449] transition cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#5B6B85] uppercase tracking-wider block">
                Select Expense Category
              </label>
              <select
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-lg text-xs outline-none bg-[#F8FAFC] border border-[#E2E8F0] text-[#152449] font-semibold cursor-pointer focus:border-[#152449]"
              >
                <option value="">-- Choose Category --</option>
                {(expenseCategories || []).map((cat, idx) => (
                  <option key={cat ? `cat-${cat}` : `cat-idx-${idx}`} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="+ Other / Specify Expense">+ Other / Specify Expense</option>
              </select>
            </div>

            {(expenseTitle === "+ Other / Specify Expense" || expenseTitle === "Other Operational Expense") && (
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <label className="text-[11px] font-bold text-[#152449] uppercase tracking-wider block">
                  What was this expense for?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Generator Fuel, Machine Spares, Bulk Stock"
                  value={customSaleName}
                  onChange={(e) => setCustomSaleName(e.target.value)}
                  className="w-full p-2 rounded text-xs outline-none bg-white border border-[#E2E8F0] font-medium text-[#152449] focus:border-[#152449]"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-[#5B6B85] uppercase tracking-wider block">
                Amount Spent ({currency})
              </label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-lg text-xs outline-none bg-white border border-[#E2E8F0] font-extrabold text-[#152449] focus:border-[#152449]"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setExpenseModal(false)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-white border border-[#E2E8F0] text-[#5B6B85] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const finalTitle =
                    expenseTitle === "+ Other / Specify Expense" || expenseTitle === "Other Operational Expense"
                      ? customSaleName || "Custom Expense"
                      : expenseTitle;
                  if (!expenseAmount || !finalTitle.trim()) return;
                  logExpenseItem(finalTitle.trim(), expenseAmount);
                  setCustomSaleName("");
                }}
                className="flex-1 py-2.5 rounded-lg text-xs font-extrabold text-white border border-[#152449] bg-[#152449] hover:bg-[#1D4ED8] cursor-pointer shadow-sm uppercase"
              >
                Commit Expense
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 4. RESTOCK MODAL */}
      {restockModal && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <motion.div variants={modalVariants} className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl p-5 bg-white space-y-3.5 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-[#152449] uppercase tracking-wider">
                Restock: {restockModal.name}
              </h4>
              <button
                onClick={() => setRestockModal(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#5B6B85] hover:text-[#152449] transition cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 py-2 border-y border-[#E2E8F0] bg-[#F8FAFC] rounded-lg">
              <button
                onClick={() => setRestockQty(Math.max(1, restockQty - 1))}
                className="w-9 h-9 rounded bg-white border border-[#E2E8F0] font-extrabold text-[#152449] text-base cursor-pointer"
              >
                -
              </button>
              <span className="text-2xl font-extrabold text-[#152449]">{restockQty}</span>
              <button
                onClick={() => setRestockQty(restockQty + 1)}
                className="w-9 h-9 rounded bg-white border border-[#E2E8F0] font-extrabold text-[#152449] text-base cursor-pointer"
              >
                +
              </button>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRestockModal(null)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-white border border-[#E2E8F0] text-[#5B6B85] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmRestock}
                className="flex-1 py-2.5 rounded-lg text-xs font-extrabold text-white border border-[#1D4ED8] bg-[#1D4ED8] hover:bg-[#2B6CD4] cursor-pointer shadow-sm uppercase"
              >
                Add to Stock
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 5. TOP UP WALLET MODAL */}
      {topUpModal && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <motion.div variants={modalVariants} className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl p-5 bg-white space-y-3 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-sm text-[#152449] uppercase tracking-wider">
                Top Up Wallet
              </h4>
              <button
                onClick={() => setTopUpModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#5B6B85] hover:text-[#152449] transition cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#5B6B85]">
              Current Balance: <strong className="font-extrabold text-[#1D4ED8]">{fmt(wallet)}</strong>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[10, 25, 50].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleTopUp(amt)}
                  className="py-2 rounded-lg font-bold text-xs border border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white transition cursor-pointer"
                >
                  +{CURRENCIES[currency]?.symbol || "R"}{amt}
                </button>
              ))}
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#5B6B85] uppercase tracking-wider block">
                Custom Amount ({currency})
              </label>
              <input
                type="number"
                placeholder="100.00"
                value={topUpCustom}
                onChange={(e) => setTopUpCustom(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-lg text-xs outline-none border border-[#E2E8F0] font-extrabold text-[#152449] focus:border-[#1D4ED8]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setTopUpModal(false)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-white border border-[#E2E8F0] text-[#5B6B85] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleTopUp(topUpCustom)}
                className="flex-1 py-2.5 rounded-lg text-xs font-extrabold text-white border border-[#1D4ED8] bg-[#1D4ED8] hover:bg-[#2B6CD4] cursor-pointer shadow-sm uppercase"
              >
                Add Funds
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 6. STATEMENT PREVIEW MODAL */}
      {showStatementModal && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <motion.div variants={modalVariants} className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl p-5 bg-white space-y-3 shadow-2xl border border-slate-200 flex flex-col text-slate-900">
            <div className="flex justify-between items-center border-b pb-2 border-[#E2E8F0]">
              <h4 className="font-extrabold text-xs text-[#152449] uppercase tracking-wider">
                Official Business Statement
              </h4>
              <button
                onClick={() => setShowStatementModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#5B6B85] hover:text-[#152449] transition cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>
            <textarea
              readOnly
              value={getStatementText()}
              rows={12}
              className="w-full p-2.5 rounded-lg text-[11px] font-mono border border-[#E2E8F0] bg-[#F8FAFC] outline-none resize-none leading-tight text-[#152449]"
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowStatementModal(false)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-white border border-[#E2E8F0] text-[#5B6B85] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getStatementText());
                  setShareFeedback(true);
                  setTimeout(() => setShareFeedback(false), 2500);
                }}
                className="flex-1 py-2.5 rounded-lg text-xs font-extrabold text-white border border-[#1D4ED8] bg-[#1D4ED8] hover:bg-[#2B6CD4] cursor-pointer shadow-sm uppercase"
              >
                {shareFeedback ? "Copied Statement! ✓" : "Copy Statement"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 7. SNAP-LOG OCR MODAL */}
      <SnapLogOCR />

      {/* 8. MERCHANT SUBSCRIPTION & TIERS MODAL */}
      <SubscriptionModal />

      {/* 9. VOICE TALLY SPEECH-TO-LEDGER MODAL */}
      <VoiceTally />

      {/* 10. THERMAL TILL-SLIP STATEMENT GENERATOR */}
      <SlipReceiptModal />
    </AnimatePresence>
  );
}
