import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";

export default function POS() {
  const { fmt, products, logSaleItem, setExpenseModal } = useApp();

  const [selectedItemName, setSelectedItemName] = useState(products[0]?.name || "+ Other / Custom Item");
  const [customItemName, setCustomItemName] = useState("");
  const [saleAmountInput, setSaleAmountInput] = useState("");
  const [saleQtyInput, setSaleQtyInput] = useState(1);
  const [saleSuccessMessage, setSaleSuccessMessage] = useState(false);

  const isCustom = selectedItemName === "+ Other / Custom Item" || selectedItemName === "__custom__";
  const effectiveItemName = isCustom ? customItemName : selectedItemName;

  const unitAmount = parseFloat(saleAmountInput) || 0;
  const lineTotal = unitAmount * saleQtyInput;

  function handleCommitSale(e) {
    e.preventDefault();
    if (!unitAmount || !effectiveItemName.trim()) return;
    logSaleItem(effectiveItemName.trim(), unitAmount, saleQtyInput);
    setSaleSuccessMessage(true);
    setTimeout(() => setSaleSuccessMessage(false), 2500);

    // Reset inputs
    setSaleAmountInput("");
    setSaleQtyInput(1);
    if (isCustom) {
      setSelectedItemName(effectiveItemName.trim());
      setCustomItemName("");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-3.5 p-4 bg-white"
    >
      {/* View Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-[#152449] uppercase tracking-wide">Record Trade</h3>
          <p className="text-[11px] text-[#5B6B85]">Flexible trader-inserted pricing & custom items</p>
        </div>
        <button
          onClick={() => setExpenseModal(true)}
          className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          Record Expense
        </button>
      </div>

      {/* Primary Sale Logging Panel */}
      <form
        onSubmit={handleCommitSale}
        className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-3"
      >
        <div className="pb-2 border-b border-[#E2E8F0]">
          <span className="font-extrabold text-xs text-[#0072CE] uppercase tracking-wider block">
            Record Sale (Money In)
          </span>
        </div>

        {/* 1. Item / Service Dropdown */}
        <div>
          <label className="text-[11px] font-bold text-[#5B6B85] uppercase tracking-wider block mb-1">
            Select Service or Item
          </label>
          <select
            value={selectedItemName}
            onChange={(e) => setSelectedItemName(e.target.value)}
            className="w-full p-2.5 rounded-lg text-xs outline-none bg-[#F8FAFC] border border-[#E2E8F0] text-[#152449] font-semibold cursor-pointer focus:border-[#1D4ED8]"
          >
            {products.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
            <option value="+ Other / Custom Item">+ Other / Custom Item</option>
          </select>
        </div>

        {/* Inline Custom Item Input when "+ Other / Custom Item" is selected */}
        {isCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#D9E6F5] space-y-1"
          >
            <span className="text-[#152449] text-[11px] font-bold block uppercase tracking-wider">
              Specify Custom Item or Service Name:
            </span>
            <input
              type="text"
              placeholder="Type to search items or services..."
              value={customItemName}
              onChange={(e) => setCustomItemName(e.target.value)}
              className="w-full p-2 rounded text-xs outline-none bg-white border border-[#E2E8F0] font-medium text-[#152449] focus:border-[#1D4ED8]"
              required={isCustom}
            />
          </motion.div>
        )}

        {/* Quick Item Suggestion Chips */}
        <div className="flex flex-wrap gap-1">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedItemName(p.name)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded border transition cursor-pointer ${
                selectedItemName === p.name
                  ? "bg-[#1D4ED8] text-white border-[#1D4ED8]"
                  : "bg-white text-[#5B6B85] border-[#E2E8F0] hover:border-[#152449]"
              }`}
            >
              {p.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedItemName("+ Other / Custom Item")}
            className={`text-[10px] font-bold px-2 py-0.5 rounded border transition cursor-pointer ${
              isCustom
                ? "bg-[#1D4ED8] text-white border-[#1D4ED8]"
                : "bg-[#F8FAFC] text-[#1D4ED8] border-[#D9E6F5]"
            }`}
          >
            + Other
          </button>
        </div>

        {/* 2. Amount Input & Quantity Selector */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div>
            <label className="text-[11px] font-bold text-[#5B6B85] uppercase tracking-wider block mb-1">
              Amount Received
            </label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={saleAmountInput}
              onChange={(e) => setSaleAmountInput(e.target.value)}
              className="w-full p-2.5 rounded-lg text-xs outline-none bg-white border border-[#E2E8F0] font-extrabold text-[#152449] focus:border-[#1D4ED8]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#5B6B85] uppercase tracking-wider block mb-1">
              Quantity
            </label>
            <div className="flex items-center justify-between border border-[#E2E8F0] rounded-lg p-1 bg-[#F8FAFC]">
              <button
                type="button"
                onClick={() => setSaleQtyInput(Math.max(1, saleQtyInput - 1))}
                className="w-7 h-7 rounded bg-white border border-[#E2E8F0] font-extrabold text-[#152449] cursor-pointer"
              >
                -
              </button>
              <span className="font-extrabold text-xs text-[#152449]">{saleQtyInput}</span>
              <button
                type="button"
                onClick={() => setSaleQtyInput(saleQtyInput + 1)}
                className="w-7 h-7 rounded bg-white border border-[#E2E8F0] font-extrabold text-[#152449] cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 3. Live Auto-Total Display */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#D9E6F5] flex items-center justify-between">
          <span className="text-xs font-bold text-[#152449] uppercase tracking-wider">Calculated Line Total:</span>
          <span className="font-extrabold text-sm text-[#1D4ED8]">+ {fmt(lineTotal)}</span>
        </div>

        {/* Success Toast Banner */}
        {saleSuccessMessage && (
          <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-800 text-center uppercase tracking-wide">
            Sale Recorded Successfully ✓
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!unitAmount || !effectiveItemName.trim()}
          className={`w-full py-3 rounded-xl text-xs font-bold tracking-wide uppercase transition cursor-pointer border shadow-sm ${
            unitAmount && effectiveItemName.trim()
              ? "bg-[#0072CE] text-white border-[#0072CE] hover:bg-[#0284c7] active:scale-[0.99]"
              : "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
          }`}
        >
          Commit Sale Entry: {fmt(lineTotal)} →
        </button>
      </form>
    </motion.div>
  );
}
