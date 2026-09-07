import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { CURRENCIES } from "../constants/data";
import { motion, AnimatePresence } from "framer-motion";

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
      {/* 1. POS SALE MODAL */}
      {saleModal && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute inset-0 flex items-end justify-center z-50 bg-[#152449]/70"
        >
          <motion.div variants={modalVariants} className="w-full rounded-t-2xl p-5 bg-white space-y-3.5 shadow-2xl border-t border-[#E2E8F0]">
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
          className="absolute inset-0 flex items-end justify-center z-50 bg-[#152449]/70"
        >
          <motion.div variants={modalVariants} className="w-full rounded-t-2xl p-5 bg-white space-y-3 shadow-2xl border-t border-[#E2E8F0]">
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
          className="absolute inset-0 flex items-end justify-center z-50 bg-[#152449]/70"
        >
          <motion.div variants={modalVariants} className="w-full rounded-t-2xl p-5 bg-white space-y-3 shadow-2xl border-t border-[#E2E8F0]">
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
                {(expenseCategories || []).map((cat) => (
                  <option key={cat} value={cat}>
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
          className="absolute inset-0 flex items-end justify-center z-50 bg-[#152449]/70"
        >
          <motion.div variants={modalVariants} className="w-full rounded-t-2xl p-5 bg-white space-y-3.5 shadow-2xl border-t border-[#E2E8F0]">
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
          className="absolute inset-0 flex items-end justify-center z-50 bg-[#152449]/70"
        >
          <motion.div variants={modalVariants} className="w-full rounded-t-2xl p-5 bg-white space-y-3 shadow-2xl border-t border-[#E2E8F0]">
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
          className="absolute inset-0 flex items-end justify-center z-50 bg-[#152449]/70"
        >
          <motion.div variants={modalVariants} className="w-full rounded-t-2xl p-5 bg-white space-y-3 max-h-[85vh] flex flex-col shadow-2xl border-t border-[#E2E8F0]">
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
      {snapLogModal && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute inset-0 flex items-end justify-center z-50 bg-[#152449]/70"
        >
          <motion.div variants={modalVariants} className="w-full rounded-t-2xl bg-white max-h-[85vh] overflow-y-auto shadow-2xl border-t border-[#E2E8F0]">
            {snapLogStep === "photo" && (
              <div className="p-5 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B6B85]">
                      Step 1 of 3: OCR Capture
                    </span>
                    <h4 className="font-extrabold text-sm text-[#152449]">
                      Scan Notebook Page
                    </h4>
                  </div>
                  <button
                    onClick={() => setSnapLogModal(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#5B6B85] hover:text-[#152449] transition cursor-pointer font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-[#5B6B85]">
                  Select notebook photo to extract handwriting and ledger entries.
                </p>

                <input
                  type="file"
                  accept="image/*"
                  id="snap-log-file-input"
                  className="hidden"
                  onChange={handleSnapLogFileSelect}
                />

                <div className="rounded-xl p-5 text-center border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
                  {snapLogImage ? (
                    <div>
                      <img
                        src={snapLogImage}
                        alt="Notebook Preview"
                        className="w-full h-32 object-cover rounded-lg border border-[#E2E8F0] mb-2"
                      />
                      <p className="text-[11px] font-bold text-[#1D4ED8]">Notebook photo selected for parsing</p>
                    </div>
                  ) : (
                    <div className="py-4">
                      <p className="text-xs font-bold text-[#152449]">Select notebook photo to extract</p>
                      <p className="text-[10px] text-[#5B6B85] mt-0.5">Supports PNG, JPG, and mobile camera photos</p>
                    </div>
                  )}

                  <button
                    onClick={() => document.getElementById("snap-log-file-input").click()}
                    className="w-full py-2.5 rounded-lg text-xs font-extrabold text-white uppercase border border-[#1D4ED8] bg-[#1D4ED8] hover:bg-[#2B6CD4] cursor-pointer shadow-sm"
                  >
                    Select Photo / Document
                  </button>
                </div>
              </div>
            )}

            {snapLogStep === "parsing" && (
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B6B85]">
                    Step 2 of 3: Processing
                  </span>
                  <h4 className="font-extrabold text-sm mt-1 text-[#152449]">
                    Extracting Transactions...
                  </h4>
                </div>
                <div className="py-6">
                  <div className="w-full h-2 rounded bg-[#E2E8F0] overflow-hidden">
                    <motion.div
                      className="h-full bg-[#1D4ED8]"
                      animate={{ width: `${snapLogProgress}%` }}
                      transition={{ duration: 0.15 }}
                    />
                  </div>
                  <p className="text-center text-xs mt-3 font-extrabold text-[#152449]">
                    {snapLogProgress}% Complete
                  </p>
                </div>
              </div>
            )}

            {snapLogStep === "review" && (
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B6B85]">
                      Step 3 of 3: Verification
                    </span>
                    <h4 className="font-extrabold text-sm text-[#152449]">
                      Review Extracted Data
                    </h4>
                  </div>
                  <button
                    onClick={() => setSnapLogModal(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#5B6B85] hover:text-[#152449] transition cursor-pointer font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {extractedTransactions.map((tx, index) => (
                    <div
                      key={tx.id}
                      className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleSnapLogTxType(index)}
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase transition cursor-pointer ${tx.type === "sale"
                            ? "bg-white text-[#1D4ED8] border-[#1D4ED8]"
                            : "bg-white text-[#152449] border-[#152449]"
                            }`}
                        >
                          {tx.type === "sale" ? "+ IN (Sale)" : "- OUT (Expense)"}
                        </button>
                        <button
                          onClick={() => {
                            const updated = [...extractedTransactions];
                            updated.splice(index, 1);
                            setExtractedTransactions(updated);
                          }}
                          className="text-xs font-bold text-[#5B6B85] hover:text-[#152449] cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#5B6B85] uppercase tracking-wider block mb-0.5">
                          Line Item Name
                        </label>
                        <input
                          type="text"
                          value={tx.name}
                          onChange={(e) => updateSnapLogLineItem(index, "name", e.target.value)}
                          className="w-full text-xs font-bold p-1.5 rounded bg-white border border-[#E2E8F0] text-[#152449]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <div className="w-16">
                          <label className="text-[10px] font-bold text-[#5B6B85] uppercase tracking-wider block mb-0.5">
                            Qty
                          </label>
                          <input
                            type="number"
                            value={tx.qty}
                            onChange={(e) => updateSnapLogLineItem(index, "qty", parseInt(e.target.value) || 1)}
                            className="w-full text-xs p-1.5 rounded bg-white border border-[#E2E8F0] text-[#152449] font-bold"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-[#5B6B85] uppercase tracking-wider block mb-0.5">
                            Amount ({currency})
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={tx.amount}
                            onChange={(e) => updateSnapLogLineItem(index, "amount", parseFloat(e.target.value) || 0)}
                            className="w-full text-xs p-1.5 rounded bg-white border border-[#E2E8F0] font-extrabold text-[#152449]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addSnapLogLineItem}
                  className="w-full py-2 rounded-lg text-xs font-bold border border-dashed border-[#1D4ED8] text-[#1D4ED8] bg-[#EFF6FF] hover:bg-[#1D4ED8] hover:text-white transition cursor-pointer uppercase"
                >
                  + Add Line Item
                </button>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSnapLogModal(false);
                      setSnapLogStep("photo");
                      setExtractedTransactions([]);
                    }}
                    className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-white border border-[#E2E8F0] text-[#5B6B85] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSnapLogImport}
                    className="flex-1 py-2.5 rounded-lg text-xs font-extrabold text-white border border-[#1D4ED8] bg-[#1D4ED8] hover:bg-[#2B6CD4] cursor-pointer shadow-sm uppercase"
                  >
                    Confirm Import
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* 8. MERCHANT SUBSCRIPTION & WALLET GATE MODAL */}
      {subscriptionModal && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute inset-0 flex items-end justify-center z-50 bg-[#152449]/70"
          onClick={() => setSubscriptionModal(false)}
        >
          <motion.div
            variants={modalVariants}
            className="w-full rounded-t-2xl p-5 bg-white space-y-4 shadow-2xl border-t border-[#E2E8F0] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0091CD] block">
                  Two-Sided Monetization Model
                </span>
                <h3 className="text-sm font-extrabold text-[#152449]">
                  Merchant Plan & Micro-Billing
                </h3>
              </div>
              <button
                onClick={() => setSubscriptionModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#5B6B85] hover:text-[#152449] transition cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Current Plan Status Card */}
            <div className="p-3.5 rounded-xl border border-[#D9E6F5] bg-gradient-to-br from-[#F8FAFC] to-[#F1F8FD] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5B6B85]">Current Subscription:</span>
                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                    isPremium
                      ? "bg-[#EBF9F1] text-[#0E8A4E] border-[#BDEBD3]"
                      : "bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]"
                  }`}
                >
                  {isPremium ? "Growth Pro Active" : "Free Tier"}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <h4 className="text-lg font-black text-[#152449]">
                    {isPremium ? "Growth Pro" : "Free Plan"}
                  </h4>
                  <p className="text-[11px] text-[#5B6B85]">
                    {isPremium
                      ? "R20 / month · Unlimited AI Scanning & Scoring"
                      : "R0 / month · Pay-As-You-Go via Digital Wallet"}
                  </p>
                </div>

                <button
                  onClick={() => setIsPremium(!isPremium)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition cursor-pointer border shadow-xs ${
                    isPremium
                      ? "border-[#E2E8F0] bg-white text-[#5B6B85] hover:bg-[#F8FAFC]"
                      : "border-[#0091CD] bg-[#0091CD] text-white hover:bg-[#0077B6]"
                  }`}
                >
                  {isPremium ? "Switch to Free" : "Upgrade to Pro (R20/mo)"}
                </button>
              </div>
            </div>

            {/* Digital Wallet Gate / Micro-Billing Balance */}
            <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#152449]">Merchant Digital Wallet</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-[#EFF6FF] text-[#0091CD] border border-[#BFDBFE]">
                    In-App Ledger
                  </span>
                </div>
                <span className="text-sm font-extrabold text-[#0091CD]">
                  {fmt(wallet)}
                </span>
              </div>

              <p className="text-[11px] text-[#64748B] leading-relaxed">
                {isPremium
                  ? "Your subscription covers all OCR scans and voice logs. Your wallet remains available for supplier restocks and settlements."
                  : "On the Free tier, automated OCR notebook scans and Voice Tally deduct R0.50/scan directly from this wallet balance."}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#5B6B85] uppercase">Quick Top-Up:</span>
                <div className="flex gap-1.5 flex-1">
                  {[20, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleTopUp(amt)}
                      className="flex-1 py-1 rounded-lg text-xs font-bold border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#0091CD] hover:text-[#0091CD] text-[#152449] transition cursor-pointer"
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Plan Feature Comparison */}
            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <span className="font-semibold text-[#152449]">Snap-Log Notebook OCR</span>
                <span className="font-extrabold text-[11px] text-[#0091CD]">
                  {isPremium ? "Unlimited Included" : "R0.50 / scan"}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <span className="font-semibold text-[#152449]">Voice Tally Daily Logger</span>
                <span className="font-extrabold text-[11px] text-[#0091CD]">
                  {isPremium ? "Unlimited Included" : "R0.50 / log"}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <span className="font-semibold text-[#152449]">Credit ID & Readiness Score</span>
                <span className="font-extrabold text-[11px] text-[#0E8A4E]">
                  Full Access
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <span className="font-semibold text-[#152449]">Pre-Approval Funder Match</span>
                <span className="font-extrabold text-[11px] text-[#0E8A4E]">
                  0% Merchant Fee
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSubscriptionModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wide border border-[#152449] bg-[#152449] text-white hover:bg-[#1D4ED8] hover:border-[#1D4ED8] transition cursor-pointer shadow-sm"
            >
              Done
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* 9. VOICE TALLY SPEECH-TO-LEDGER MODAL */}
      {voiceTallyModal && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute inset-0 flex items-end justify-center z-50 bg-[#152449]/70"
          onClick={() => {
            setVoiceTallyModal(false);
            setVoiceState("idle");
          }}
        >
          <motion.div
            variants={modalVariants}
            className="w-full rounded-t-3xl sm:rounded-2xl p-5 bg-white space-y-3.5 shadow-2xl border-t border-[#E2E8F0] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0091CD] block">
                  Multimodal Speech-to-Ledger
                </span>
                <h3 className="text-sm font-extrabold text-[#152449]">
                  Voice Tally
                </h3>
              </div>
              <button
                onClick={() => {
                  setVoiceTallyModal(false);
                  setVoiceState("idle");
                }}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#5B6B85] hover:text-[#152449] transition cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Micro-Monetization Badge */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] text-[11px]">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#0091CD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[#0369A1] font-medium">
                  Included in Growth Pro (R20/mo) · Free trial active
                </span>
              </div>
              {isOffline && (
                <span className="text-[9px] font-extrabold text-[#DC2626] bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                  Data Shield Active
                </span>
              )}
            </div>

            {/* Content: Idle State */}
            {voiceState === "idle" && (
              <div className="py-2 space-y-4 text-center">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#152449]">
                    Tap microphone to capture transaction intent
                  </p>
                  <p className="text-[11px] text-[#5B6B85]">
                    Speak in isiZulu, Sesotho, Afrikaans, or English
                  </p>
                </div>

                {/* Big Central Mic Button */}
                <div className="flex justify-center py-2">
                  <button
                    onClick={() => handleStartRecording(selectedVoicePreset)}
                    className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0091CD] to-[#00A3E0] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-lg transition cursor-pointer border-4 border-white ring-4 ring-[#E0F2FE]"
                    title="Tap to speak"
                  >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </div>

                {/* Local Vernacular Presets (Demo Pills for Judges) */}
                <div className="space-y-1.5 text-left pt-2 border-t border-[#F1F5F9]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B6B85] block">
                    Simulate Vernacular Speech Inputs:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {VOICE_PRESETS.map((p, idx) => (
                      <button
                        key={p.language}
                        onClick={() => handleStartRecording(idx)}
                        className={`w-full p-2 rounded-xl text-left text-xs transition border cursor-pointer flex items-center justify-between ${
                          selectedVoicePreset === idx
                            ? "bg-[#EFF6FF] border-[#0091CD] text-[#152449]"
                            : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#0091CD] text-[#475569]"
                        }`}
                      >
                        <div className="truncate pr-2">
                          <span className="text-[9px] font-black uppercase text-[#0091CD] block">
                            {p.language}
                          </span>
                          <span className="font-semibold text-[11px] truncate block">
                            "{p.phrase}"
                          </span>
                        </div>
                        <span className="text-[10px] font-extrabold text-[#0091CD] shrink-0">
                          Try →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Content: Active Recording State */}
            {voiceState === "recording" && (
              <div className="py-8 space-y-4 text-center">
                <div className="relative inline-flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className="absolute w-24 h-24 rounded-full bg-[#0091CD]"
                  />
                  <div className="w-16 h-16 rounded-full bg-[#0091CD] text-white flex items-center justify-center shadow-md relative z-10">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-[#152449]">
                    Listening to Vernacular Speech...
                  </h4>
                  <p className="text-[11px] text-[#5B6B85] mt-1 italic">
                    "{VOICE_PRESETS[selectedVoicePreset].phrase}"
                  </p>
                </div>

                <div className="flex justify-center items-center gap-1">
                  {[0.4, 0.8, 1.2, 0.6, 1.0, 0.5, 0.9].map((delay, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: ["8px", "24px", "8px"] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: delay * 0.2 }}
                      className="w-1 bg-[#0091CD] rounded-full inline-block"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Content: Parsed Result State */}
            {voiceState === "parsed" && (
              <div className="space-y-3.5 py-1 text-left">
                {/* Speech Transcript Card */}
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#0091CD]">
                      Captured {VOICE_PRESETS[selectedVoicePreset].language} Intent
                    </span>
                    <span className="text-[9px] font-bold text-[#0E8A4E]">
                      98% Confidence
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#152449]">
                    "{VOICE_PRESETS[selectedVoicePreset].phrase}"
                  </p>
                  <p className="text-[10px] text-[#64748B] italic">
                    Translation: {VOICE_PRESETS[selectedVoicePreset].translation}
                  </p>
                </div>

                {/* Parsed Breakdown Card */}
                <div className="p-3.5 rounded-xl border border-[#D9E6F5] bg-gradient-to-br from-white to-[#F1F8FD] space-y-2">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-[#5B6B85]">
                      Structured Line Item
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-white text-[#0091CD] border border-[#BFDBFE]">
                      Tender: {VOICE_PRESETS[selectedVoicePreset].tender}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-xs text-[#152449]">
                        {VOICE_PRESETS[selectedVoicePreset].item}
                      </p>
                      <span className="text-[11px] text-[#5B6B85] font-semibold">
                        Quantity: {VOICE_PRESETS[selectedVoicePreset].qty}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-[#0091CD]">
                        {fmt(VOICE_PRESETS[selectedVoicePreset].total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Underwriting Impact Pill */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] text-[#065F46]">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                    <span>Growth Pipeline Impact:</span>
                  </div>
                  <span className="font-extrabold">
                    +12 Pts Consistency Streak
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setVoiceState("idle")}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white border border-[#E2E8F0] text-[#5B6B85] hover:bg-[#F8FAFC] transition cursor-pointer"
                  >
                    Retry Voice Note
                  </button>
                  <button
                    onClick={() => confirmVoiceTally(VOICE_PRESETS[selectedVoicePreset])}
                    className="flex-1 py-2.5 rounded-xl text-xs font-extrabold text-white border border-[#0091CD] bg-[#0091CD] hover:bg-[#0077B6] transition cursor-pointer shadow-sm uppercase tracking-wide"
                  >
                    Confirm & Log
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
