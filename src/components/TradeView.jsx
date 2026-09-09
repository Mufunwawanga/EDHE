import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

export default function TradeView() {
  const {
    catalog,
    products,
    metrics,
    recordSale,
    recordExpense,
    addCatalogItem,
    setVoiceTallyModal,
    setSnapLogModal,
    setSnapLogStep,
    fmt,
  } = useApp();

  const availableCatalog = catalog || products || [];

  // Top Tab Switcher: "sale" (Money In) | "expense" (Money Out)
  const [activeTab, setActiveTab] = useState("sale");

  // ==========================================
  // SALE STATE
  // ==========================================
  const [selectedItem, setSelectedItem] = useState(null);
  const [saleAmount, setSaleAmount] = useState("");
  const [saleNote, setSaleNote] = useState("");
  const [saleQty, setSaleQty] = useState(1);
  const [unitCost, setUnitCost] = useState("");
  const [isManualCost, setIsManualCost] = useState(false);
  const [saleSuccessMsg, setSaleSuccessMsg] = useState(false);

  // Add Item to Catalog Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCost, setNewItemCost] = useState("");
  const [newItemStock, setNewItemStock] = useState("");

  // ==========================================
  // EXPENSE STATE
  // ==========================================
  const EXPENSE_CATEGORIES = [
    { label: "Supplier Stock", icon: "📦" },
    { label: "Transport Fare", icon: "🚐" },
    { label: "Paraffin / Gas", icon: "🔥" },
    { label: "Electricity", icon: "⚡" },
    { label: "Lunch", icon: "🍲" },
    { label: "Airtime & Data", icon: "📱" },
    { label: "Rent / Space Fee", icon: "🏪" },
    { label: "Other", icon: "📝" },
  ];

  const [expenseCategory, setExpenseCategory] = useState("Supplier Stock");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const [expenseSuccessMsg, setExpenseSuccessMsg] = useState(false);

  // ==========================================
  // CALCULATED METRICS FOR CURRENT SALE
  // ==========================================
  const rawUnitPrice = parseFloat(saleAmount) || 0;
  const lineTotal = rawUnitPrice * saleQty;

  // Cost calculation: use user-specified cost or estimated 35% cost if undefined
  const rawUnitCost =
    unitCost !== "" ? parseFloat(unitCost) || 0 : rawUnitPrice > 0 ? Math.round(rawUnitPrice * 0.35 * 100) / 100 : 0;
  const lineCostTotal = rawUnitCost * saleQty;
  const estimatedProfit = lineTotal - lineCostTotal;
  const marginPercent = lineTotal > 0 ? Math.round((estimatedProfit / lineTotal) * 100) : 0;

  // Handle Catalog Item Tap
  function handleSelectCatalogItem(item) {
    if (selectedItem?.id === item.id) {
      // Tapping same item increments quantity
      setSaleQty((prev) => prev + 1);
    } else {
      setSelectedItem(item);
      const price = item.sellingPrice !== undefined ? item.sellingPrice : item.price || 0;
      const cost = item.costPrice !== undefined ? item.costPrice : item.cost || 0;
      setSaleAmount(price > 0 ? String(price) : "");
      setUnitCost(cost > 0 ? String(cost) : "");
      setSaleNote(item.name);
      setSaleQty(1);
      setIsManualCost(false);
    }
  }

  // Deselect catalog item for direct manual entry
  function handleClearSelection() {
    setSelectedItem(null);
    setSaleAmount("");
    setUnitCost("");
    setSaleNote("");
    setSaleQty(1);
    setIsManualCost(false);
  }

  // Quick denomination increment chips
  function handleAddAmount(increment) {
    const current = parseFloat(saleAmount) || 0;
    const next = current + increment;
    setSaleAmount(String(next));
    if (!isManualCost) {
      setUnitCost(String(Math.round(next * 0.35 * 100) / 100));
    }
  }

  // Keypad button input
  function handleKeypadPress(val) {
    if (val === "CLEAR") {
      setSaleAmount("");
      if (!isManualCost) setUnitCost("");
      return;
    }
    if (val === "BACKSPACE") {
      setSaleAmount((prev) => prev.slice(0, -1));
      return;
    }
    if (val === "." && saleAmount.includes(".")) return;
    const next = saleAmount + val;
    setSaleAmount(next);
    if (!isManualCost) {
      const num = parseFloat(next) || 0;
      setUnitCost(num > 0 ? String(Math.round(num * 0.35 * 100) / 100) : "");
    }
  }

  // Commit Sale Submit
  function handleCommitSale(e) {
    e?.preventDefault();
    if (rawUnitPrice <= 0 || saleQty <= 0) return;

    const desc = saleNote.trim() || selectedItem?.name || "Quick Cash Sale";

    recordSale({
      description: desc,
      name: desc,
      amount: lineTotal,
      cost: lineCostTotal,
      qty: saleQty,
      paymentMethod: "cash",
    });

    setSaleSuccessMsg(true);
    setTimeout(() => {
      setSaleSuccessMsg(false);
      handleClearSelection();
    }, 1500);
  }

  // Commit Expense Submit
  function handleCommitExpense(e) {
    e?.preventDefault();
    const amt = parseFloat(expenseAmount) || 0;
    if (amt <= 0) return;

    const desc = expenseNote.trim() || `${expenseCategory} Outflow`;

    recordExpense({
      description: desc,
      amount: amt,
      category: expenseCategory,
      paymentMethod: "cash",
    });

    setExpenseSuccessMsg(true);
    setTimeout(() => {
      setExpenseSuccessMsg(false);
      setExpenseAmount("");
      setExpenseNote("");
    }, 1500);
  }

  // Add Item to Catalog Handler
  function handleSaveNewCatalogItem(e) {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) return;

    const price = parseFloat(newItemPrice) || 0;
    const cost = parseFloat(newItemCost) || 0;
    const stock = parseInt(newItemStock, 10) || 0;

    const created = addCatalogItem({
      name: newItemName.trim(),
      sellingPrice: price,
      costPrice: cost,
      stockQty: stock,
      trackStock: stock > 0,
    });

    // Reset modal & select newly created item
    setShowAddModal(false);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemCost("");
    setNewItemStock("");

    if (created) {
      handleSelectCatalogItem(created);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-3 p-3 bg-white min-h-[85vh] text-left"
    >
      {/* ========================================================================= */}
      {/* 1. TOP SWITCHER & MULTIMODAL ACTION BAR */}
      {/* ========================================================================= */}
      <div className="space-y-2">
        {/* Multimodal Quick-Shortcuts */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-[#152449] uppercase tracking-wider">
              Cash Till & Ledger
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setVoiceTallyModal(true)}
              className="px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0072CE] border border-sky-200 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span>Voice</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSnapLogStep("photo");
                setSnapLogModal(true);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              <span>OCR</span>
            </button>
          </div>
        </div>

        {/* Primary Action Switchers: Record Sale (Money In) vs Record Expense (Money Out) */}
        <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200 grid grid-cols-2 gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("sale")}
            className={`py-2 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "sale"
                ? "bg-white text-emerald-700 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${activeTab === "sale" ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"}`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <span>Record Sale (Money In)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("expense")}
            className={`py-2 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "expense"
                ? "bg-white text-rose-700 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${activeTab === "expense" ? "bg-rose-100 text-rose-600" : "bg-slate-200 text-slate-500"}`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <span>Record Expense (Money Out)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: RECORD SALE (MONEY IN) */}
      {/* ========================================================================= */}
      {activeTab === "sale" && (
        <div className="space-y-3">
          {/* Quick Cash Keypad & Direct Amount Entry Card */}
          <div className="p-3 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Direct Cash Amount Entry
              </span>
              {selectedItem && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-[10px] font-bold text-[#0072CE] hover:underline cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {/* Main Numeric Amount Display */}
            <div className="py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <span className="text-2xl font-bold tracking-tight text-slate-400 select-none font-mono mr-1">R</span>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={saleAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  setSaleAmount(val);
                  if (!isManualCost) {
                    const num = parseFloat(val) || 0;
                    setUnitCost(num > 0 ? String(Math.round(num * 0.35 * 100) / 100) : "");
                  }
                }}
                className="w-full text-right text-2xl font-bold tracking-tight text-slate-900 font-mono outline-none bg-transparent"
              />
            </div>

            {/* Quick Denomination Chips */}
            <div className="flex items-center justify-between gap-1.5 w-full mt-2">
              {[10, 20, 50, 100, 200].map((denom) => (
                <button
                  key={denom}
                  type="button"
                  onClick={() => handleAddAmount(denom)}
                  className="flex-1 py-1.5 px-0 text-center text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-[#0072CE] hover:text-[#0072CE] rounded-lg transition-all cursor-pointer active:scale-95"
                >
                  +{denom}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSaleAmount("")}
                className="py-1.5 px-2.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg shrink-0 cursor-pointer active:scale-95"
              >
                Clear
              </button>
            </div>

            {/* Optional Note & Quantity Stepper */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Optional Note / Item
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lunch special, Hair trim, 3 drinks"
                  value={saleNote}
                  onChange={(e) => setSaleNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs outline-none bg-white border border-slate-200 text-[#152449] font-semibold focus:border-[#0072CE]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Quantity
                </label>
                <div className="flex items-center justify-between p-1 rounded-xl border border-slate-200 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setSaleQty(Math.max(1, saleQty - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-black text-[#152449] text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-black text-xs text-[#152449]">{saleQty}</span>
                  <button
                    type="button"
                    onClick={() => setSaleQty(saleQty + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-black text-[#152449] text-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Profit Margin & Estimated Cost Tracker */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Estimated / Item Cost:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-mono text-[11px]">R</span>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={unitCost}
                    onChange={(e) => {
                      setIsManualCost(true);
                      setUnitCost(e.target.value);
                    }}
                    className="w-20 p-1 text-right rounded-lg bg-white border border-slate-200 font-mono font-bold text-xs outline-none focus:border-[#0072CE]"
                  />
                </div>
              </div>

              {/* Profit & Margin Bar */}
              <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    Estimated Profit
                  </span>
                  <span className="text-sm font-black text-emerald-600 font-mono">
                    +R{estimatedProfit.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    Gross Margin
                  </span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {marginPercent}% margin
                  </span>
                </div>
              </div>
            </div>

            {/* Success Toast */}
            {saleSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black text-center uppercase tracking-wider"
              >
                Cash Sale Committed to Ledger ✓
              </motion.div>
            )}

            {/* Commit Cash Sale Button */}
            <button
              type="button"
              onClick={handleCommitSale}
              disabled={rawUnitPrice <= 0}
              className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border shadow-sm ${
                rawUnitPrice > 0
                  ? "bg-[#0E8A4E] text-white border-[#0E8A4E] hover:bg-[#0b6e3e] active:scale-[0.99]"
                  : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
              }`}
            >
              Commit Cash Sale: +R{lineTotal.toFixed(2).replace(".", ",")} →
            </button>
          </div>

          {/* ========================================== */}
          {/* QUICK-TAP CATALOG GRID */}
          {/* ========================================== */}
          <div className="p-3 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-[#152449] uppercase tracking-wider">
                  Quick-Tap Catalog Grid
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {availableCatalog.length}
                </span>
              </div>
            </div>

            {availableCatalog.length === 0 ? (
              <div className="py-4 px-3 text-center space-y-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs font-bold text-slate-600">
                  No catalog items added yet
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Add items to your catalog for 1-tap counter selling, or use the direct amount keypad above.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#0072CE] hover:bg-[#005fa8] text-white text-xs font-bold transition cursor-pointer"
                >
                  + Add New Item to Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {availableCatalog.map((item, idx) => {
                  const isSelected = selectedItem?.id === item.id;
                  const price = item.sellingPrice !== undefined ? item.sellingPrice : item.price || 0;
                  const cost = item.costPrice !== undefined ? item.costPrice : item.cost || 0;

                  return (
                    <button
                      key={item.id || item.name || `item-${idx}`}
                      type="button"
                      onClick={() => handleSelectCatalogItem(item)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between group active:scale-[0.98] ${
                        isSelected
                          ? "bg-sky-50 border-[#0072CE] shadow-xs"
                          : "bg-slate-50/70 hover:bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-black text-[#152449] truncate block max-w-[120px]">
                          {item.name}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#0072CE] text-white flex items-center justify-center text-[10px] font-black">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-baseline justify-between">
                        <span className="text-sm font-black text-[#0072CE] font-mono">
                          R{price.toFixed(2).replace(".", ",")}
                        </span>
                        {cost > 0 && (
                          <span className="text-[9px] text-slate-400 font-mono">
                            Cost: R{cost}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* "+ Add New Item" Tile in Grid */}
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="p-2.5 rounded-xl border border-dashed border-slate-300 hover:border-[#0072CE] bg-white hover:bg-sky-50/50 text-left transition cursor-pointer flex flex-col items-center justify-center text-center group active:scale-[0.98]"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-[#0072CE] group-hover:text-white flex items-center justify-center text-slate-600 transition mb-1 text-xs font-bold">
                    +
                  </div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-[#0072CE]">
                    + Add New Item
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RECORD EXPENSE (MONEY OUT) */}
      {/* ========================================================================= */}
      {activeTab === "expense" && (
        <div className="p-3 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
          <div className="pb-1 border-b border-slate-100">
            <span className="text-xs font-black text-[#152449] uppercase tracking-wider block">
              Log Cash Outflow / Operational Cost
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Track stock purchases, transport fare, paraffin, or electricity
            </p>
          </div>

          {/* Amount Spent Display */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Amount Spent (ZAR)
            </label>
            <div className="py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center justify-between">
              <span className="text-2xl font-bold tracking-tight text-rose-400 select-none font-mono mr-1">-R</span>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="w-full text-right text-2xl font-bold tracking-tight text-rose-700 font-mono outline-none bg-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div className="flex items-center justify-between gap-1.5 w-full mt-2">
            {[15, 30, 50, 100, 200, 500].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setExpenseAmount(String(amt))}
                className="flex-1 py-1.5 px-0 text-center text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-rose-500 hover:text-rose-600 rounded-lg transition-all cursor-pointer active:scale-95"
              >
                R{amt}
              </button>
            ))}
          </div>

          {/* Expense Categories Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Select Outflow Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EXPENSE_CATEGORIES.map((cat) => {
                const isSelected = expenseCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setExpenseCategory(cat.label)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? "bg-rose-50 text-rose-700 border-rose-300 shadow-2xs font-black"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description Note */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Expense Note / Receipt Detail
            </label>
            <input
              type="text"
              placeholder="e.g. Taxi to wholesaler, 10kg sugar, generator fuel"
              value={expenseNote}
              onChange={(e) => setExpenseNote(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs outline-none bg-white border border-slate-200 text-[#152449] font-semibold focus:border-rose-500"
            />
          </div>

          {/* Success Toast */}
          {expenseSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black text-center uppercase tracking-wider"
            >
              Expense Recorded to Ledger ✓
            </motion.div>
          )}

          {/* Commit Expense Button */}
          <button
            type="button"
            onClick={handleCommitExpense}
            disabled={!expenseAmount || parseFloat(expenseAmount) <= 0}
            className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border shadow-sm ${
              expenseAmount && parseFloat(expenseAmount) > 0
                ? "bg-rose-600 text-white border-rose-600 hover:bg-rose-700 active:scale-[0.99]"
                : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
            }`}
          >
            Commit Cash Expense: -R{(parseFloat(expenseAmount) || 0).toFixed(2).replace(".", ",")} →
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: ADD NEW ITEM TO CATALOG */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl p-5 bg-white shadow-2xl border border-slate-200 space-y-4 text-left text-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-[#152449]">Add Item to Catalog</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Add product or service for 1-tap till sales</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-[#152449] transition cursor-pointer font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveNewCatalogItem} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                    Product / Service Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Box Braids, Vetkoek & Mince, Screen Fix"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs outline-none bg-white border border-slate-200 text-[#152449] font-semibold focus:border-[#0072CE]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1 min-w-0">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block truncate">
                      Selling Price (ZAR)
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full p-2.5 rounded-xl text-xs outline-none bg-white border border-slate-200 font-black text-[#152449] focus:border-[#0072CE]"
                      required
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block truncate">
                      Cost Price (ZAR)
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={newItemCost}
                      onChange={(e) => setNewItemCost(e.target.value)}
                      className="w-full p-2.5 rounded-xl text-xs outline-none bg-white border border-slate-200 font-black text-[#152449] focus:border-[#0072CE]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                    Initial Stock Qty (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="0 if service / untracked"
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs outline-none bg-white border border-slate-200 text-[#152449] font-semibold focus:border-[#0072CE]"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={!newItemName.trim() || !newItemPrice}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border shadow-sm ${
                      newItemName.trim() && newItemPrice
                        ? "bg-[#0072CE] text-white border-[#0072CE] hover:bg-[#005fa8]"
                        : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    }`}
                  >
                    Save to Catalog →
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-3 px-4 rounded-xl text-xs font-bold text-slate-500 hover:text-[#152449] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. TILL RIBBON SUMMARY */}
      {/* ========================================================================= */}
      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-medium text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-700">Today:</span>
          <span className="text-emerald-700 font-black font-mono">
            +R{(metrics?.todayMoneyIn || 0).toFixed(2).replace(".", ",")}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-rose-600 font-black font-mono">
            -R{(metrics?.todayMoneyOut || 0).toFixed(2).replace(".", ",")}
          </span>
        </div>
        <div className="text-right">
          <span className="font-black text-[#152449] font-mono">
            {metrics?.formattedNetRetained || "R0,00"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
