import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import CashToCreditBanner from "./CashToCreditBanner";

<<<<<<< HEAD
function getRelativeTime(timestamp) {
  if (!timestamp) return "Today";
  const time = typeof timestamp === "string" ? new Date(timestamp).getTime() : timestamp;
  if (!time || isNaN(time)) return "Today";
  const diffSec = Math.floor((Date.now() - time) / 1000);
  if (diffSec < 45) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return new Date(time).toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function Dashboard({ onNavigateToCreditId }) {
  const {
    t,
    currentLanguage,
    metrics,
    transactions,
    products,
    catalog,
    recordSale,
    recordExpense,
=======
export default function Dashboard({ onNavigateToCreditId }) {
  const {
    fmt,
    todayRevenue,
    todayExpenses,
    todayNetProfit,
    margin,
    transactions,
    products,
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
    logSaleItem,
    setExpenseModal,
    setSnapLogStep,
    setSnapLogModal,
    setScreen,
<<<<<<< HEAD
    setVoiceTallyModal,
    resetAppToNewTrader,
    fmt,
=======
    growthScore,
    activeStreak,
    setVoiceTallyModal,
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
  } = useApp();

  const handleNavigateToCreditId = onNavigateToCreditId || (() => setScreen("creditId"));

<<<<<<< HEAD
  const availableProducts = catalog || products || [];

  // Fast Counter POS Modal State
  const [showFastPos, setShowFastPos] = useState(false);
  const [posSelectedItem, setPosSelectedItem] = useState(
    availableProducts[0]?.name || "custom"
  );
  const [posCustomName, setPosCustomName] = useState("");
  const [posPrice, setPosPrice] = useState(
    availableProducts[0]?.price !== undefined && availableProducts[0]?.price !== null
      ? String(availableProducts[0].price)
      : ""
  );
=======
  // Fast Counter POS Modal State
  const [showFastPos, setShowFastPos] = useState(false);
  const [posSelectedItem, setPosSelectedItem] = useState(products[0]?.name || "Albany Superior Bread");
  const [posCustomName, setPosCustomName] = useState("");
  const [posPrice, setPosPrice] = useState(products[0]?.price ? String(products[0].price) : "18");
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
  const [posQty, setPosQty] = useState(1);
  const [posSuccessMsg, setPosSuccessMsg] = useState(false);

  // Transactions expansion state
  const [showAllTx, setShowAllTx] = useState(false);

  // Main Business Account collapsed/expanded state
  const [isAccountExpanded, setIsAccountExpanded] = useState(false);

<<<<<<< HEAD
  const isCustomPos = posSelectedItem === "custom" || availableProducts.length === 0;
=======
  const isCustomPos = posSelectedItem === "custom";
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c

  function handleSelectProduct(prodName) {
    setPosSelectedItem(prodName);
    if (prodName === "custom") {
      setPosPrice("");
    } else {
<<<<<<< HEAD
      const found = availableProducts.find((p) => p.name === prodName);
      if (found && found.price !== undefined) {
=======
      const found = products.find((p) => p.name === prodName);
      if (found && found.price) {
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
        setPosPrice(String(found.price));
      }
    }
  }

  function handleFastPosSubmit(e) {
    e.preventDefault();
    const effectiveName = isCustomPos ? posCustomName.trim() : posSelectedItem.trim();
    const unitAmt = parseFloat(posPrice);
    if (!effectiveName || !unitAmt || unitAmt <= 0 || posQty <= 0) return;

<<<<<<< HEAD
    if (recordSale) {
      recordSale({
        description: effectiveName,
        name: effectiveName,
        amount: unitAmt * posQty,
        qty: posQty,
        paymentMethod: "cash",
      });
    } else if (logSaleItem) {
      logSaleItem(effectiveName, unitAmt, posQty);
    }

=======
    logSaleItem(effectiveName, unitAmt, posQty);
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
    setPosSuccessMsg(true);

    setTimeout(() => {
      setPosSuccessMsg(false);
      setShowFastPos(false);
      setPosQty(1);
      if (isCustomPos) {
        setPosCustomName("");
      }
    }, 1200);
  }

  // Display latest 3 transactions or full list when expanded
  const displayTransactions = showAllTx ? transactions : transactions.slice(0, 3);

<<<<<<< HEAD
  // Dynamic calculations from metrics
  const todayIn = metrics?.todayMoneyIn ?? 0;
  const todayOut = metrics?.todayMoneyOut ?? 0;
  const todayNet = metrics?.todayNetRetained ?? metrics?.netRetained ?? 0;
  const todayMargin = metrics?.todayMargin ?? metrics?.grossMarginPercent ?? 0;

  const formatZar = (val) => {
    const num = typeof val === "number" ? val : parseFloat(val) || 0;
    return `R${Math.abs(num).toFixed(2).replace(".", ",")}`;
  };

  const netSign = todayNet >= 0 ? "+" : "-";
  const netRetainedDisplay = `${netSign}${formatZar(todayNet)}`;
  const moneyInDisplay = `+${formatZar(todayIn)}`;
  const moneyOutDisplay = `-${formatZar(todayOut)}`;

=======
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4 p-4 bg-white"
    >
      {/* 1. Capitec Main Business Account Card (Collapsed by Default) */}
      <div
        onClick={() => setIsAccountExpanded(!isAccountExpanded)}
        className="w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-sm cursor-pointer hover:border-slate-300 transition-all duration-200 ease-in-out text-left select-none"
      >
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
<<<<<<< HEAD
            {t.mainAccount}
=======
            MAIN BUSINESS ACCOUNT
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
          </span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ease-in-out ${
              isAccountExpanded ? "rotate-90 text-[#0091CD]" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Primary Metric & Sub-label */}
        <div className="mt-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
<<<<<<< HEAD
            {netRetainedDisplay}
          </h2>
          <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {t.netProfit} • {todayMargin}% margin
=======
            {todayNetProfit ? (todayNetProfit >= 0 ? "+" : "-") : "+"} {fmt(todayNetProfit ? Math.abs(todayNetProfit) : 125)}
          </h2>
          <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Today's Net Profit • {margin || 63}% margin
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
          </p>
        </div>

        {/* Expanded State (In-place Breakdown & Micro-actions) */}
        <AnimatePresence>
          {isAccountExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-3">
                <div className="space-y-2 text-xs">
                  {/* Money In (Today) */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-sky-100 text-[#0072CE] flex items-center justify-center font-bold">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </div>
                      <span className="text-slate-600 font-medium">Money In (Today)</span>
                    </div>
                    <span className="font-mono font-bold text-sky-700">
<<<<<<< HEAD
                      {moneyInDisplay}
                    </span>
                  </div>

                  {/* Money Out (Today) */}
=======
                      + {fmt(todayRevenue || 200)}
                    </span>
                  </div>

                  {/* Money Out (Operating) */}
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
<<<<<<< HEAD
                      <span className="text-slate-600 font-medium">Money Out (Today)</span>
                    </div>
                    <span className="font-mono font-bold text-rose-600">
                      {moneyOutDisplay}
=======
                      <span className="text-slate-600 font-medium">Money Out (Operating)</span>
                    </div>
                    <span className="font-mono font-bold text-rose-600">
                      - {fmt(todayExpenses || 75)}
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                    </span>
                  </div>

                  {/* Net Cash Retained */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
                    <span className="text-slate-800 font-bold">Net Cash Retained</span>
                    <span className="font-mono font-black text-emerald-700 text-sm">
<<<<<<< HEAD
                      {netRetainedDisplay}
=======
                      {todayNetProfit ? (todayNetProfit >= 0 ? "+" : "-") : "+"} {fmt(todayNetProfit ? Math.abs(todayNetProfit) : 125)}
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                    </span>
                  </div>
                </div>

                {/* Quick Action Micro-buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFastPos(true);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center cursor-pointer active:scale-[0.98]"
                  >
                    + Quick Log
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setScreen("pos");
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#0091CD] hover:bg-[#0077B6] text-white text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-2xs active:scale-[0.98]"
                  >
                    View Full Ledger
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

<<<<<<< HEAD
      {/* 2. Onboarding Banner for First-Time Traders (0 Transactions Logged) */}
      {transactions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-emerald-50 border border-sky-200 shadow-xs text-left"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0072CE] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0072CE] bg-white px-2 py-0.5 rounded-full border border-sky-200">
                  New Trader Welcome
                </span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                Welcome to Cash2Cred. Tap <span className="font-bold text-[#0072CE]">+ Quick Sale</span> or use <span className="font-bold text-[#0072CE]">Voice Tally</span> below to log your first cash trade of the day.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. Financial Identity and Readiness Link Card */}
      <CashToCreditBanner onNavigateToCreditId={handleNavigateToCreditId} />

      {/* 4. Quick Actions Section */}
=======
      {/* 2. Financial Identity and Readiness Link Card */}
      <CashToCreditBanner onNavigateToCreditId={handleNavigateToCreditId} />

      {/* 3. Quick Actions Section */}
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
      <div className="pt-2">
        {/* Section Header */}
        <div className="flex items-center justify-between px-1 mb-3">
          <span className="font-bold text-[12px] text-slate-800 tracking-tight">
<<<<<<< HEAD
            {t.quickActions}
=======
            Quick Actions
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
          </span>
          <button
            type="button"
            onClick={() => setScreen("pos")}
            className="font-bold text-[11px] text-[#0091CD] hover:underline cursor-pointer"
          >
            All Tools &gt;
          </button>
        </div>

        {/* Clean 2x2 Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Tile 1: Fast Counter POS */}
          <button
            onClick={() => setShowFastPos(true)}
            className="p-3.5 rounded-2xl border border-[#E5EEF5] bg-white hover:border-[#0091CD] transition text-left cursor-pointer shadow-xs flex flex-col justify-between group active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-[#F0F9FF] border border-[#B3DFFA] flex items-center justify-center text-[#0091CD] group-hover:bg-[#0091CD] group-hover:text-white transition shadow-2xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs font-black text-[#0091CD] opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </div>
            <div className="mt-2.5">
              <h4 className="text-xs font-black text-[#152449] tracking-tight">
<<<<<<< HEAD
                {t.pos}
=======
                Fast Counter POS
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
              </h4>
              <p className="text-[10px] text-[#5B6B85] mt-0.5 font-medium leading-tight">
                Quick tap-to-sell
              </p>
            </div>
          </button>

          {/* Tile 2: Snap-Log OCR */}
          <button
            onClick={() => {
              setSnapLogStep("photo");
              setSnapLogModal(true);
            }}
            className="p-3.5 rounded-2xl border border-[#E5EEF5] bg-white hover:border-[#0091CD] transition text-left cursor-pointer shadow-xs flex flex-col justify-between group active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-[#F0F9FF] border border-[#B3DFFA] flex items-center justify-center text-[#0091CD] group-hover:bg-[#0091CD] group-hover:text-white transition shadow-2xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs font-black text-[#0091CD] opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </div>
            <div className="mt-2.5">
              <h4 className="text-xs font-black text-[#152449] tracking-tight">
                Snap-Log OCR
              </h4>
              <p className="text-[10px] text-[#5B6B85] mt-0.5 font-medium leading-tight">
                Scan counter books
              </p>
            </div>
          </button>

          {/* Tile 3: Voice Tally */}
          <button
            onClick={() => setVoiceTallyModal(true)}
            className="p-3.5 rounded-2xl border border-[#E5EEF5] bg-white hover:border-[#0091CD] transition text-left cursor-pointer shadow-xs flex flex-col justify-between group active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-[#F0F9FF] border border-[#B3DFFA] flex items-center justify-center text-[#0091CD] group-hover:bg-[#0091CD] group-hover:text-white transition relative shadow-2xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#0091CD] animate-ping"></span>
              </div>
              <span className="text-xs font-black text-[#0091CD] opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </div>
            <div className="mt-2.5">
              <h4 className="text-xs font-black text-[#152449] tracking-tight">
                Voice Tally
              </h4>
              <p className="text-[10px] text-[#5B6B85] mt-0.5 font-medium leading-tight">
                Local speech-to-sale
              </p>
            </div>
          </button>

          {/* Tile 4: Log Expense */}
          <button
            onClick={() => setExpenseModal(true)}
            className="p-3.5 rounded-2xl border border-[#E5EEF5] bg-white hover:border-[#0091CD] transition text-left cursor-pointer shadow-xs flex flex-col justify-between group active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-[#F0F9FF] border border-[#B3DFFA] flex items-center justify-center text-[#0091CD] group-hover:bg-[#0091CD] group-hover:text-white transition shadow-2xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs font-black text-[#0091CD] opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </div>
            <div className="mt-2.5">
              <h4 className="text-xs font-black text-[#152449] tracking-tight">
                Log Expense
              </h4>
              <p className="text-[10px] text-[#5B6B85] mt-0.5 font-medium leading-tight">
                Stock, taxi, power
              </p>
            </div>
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* 5. Recent Transactions Feed */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs p-3.5 space-y-2.5 text-left">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold text-[#152449] uppercase tracking-wider">
              {t.recentTransactions}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
=======
      {/* 4. Cleaned Up Recent Transactions (Directly below 2x2 Grid) */}
      <div className="rounded-2xl border border-[#E5EEF5] bg-white shadow-xs p-3.5 space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5EEF5]">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold text-[#152449] uppercase tracking-wider">
              Recent Transactions
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#F1F5F9] text-[#5B6B85]">
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
              {transactions.length}
            </span>
          </div>
          {transactions.length > 3 && (
            <button
              onClick={() => setShowAllTx(!showAllTx)}
              className="text-[11px] font-extrabold text-[#0091CD] hover:underline cursor-pointer"
            >
              {showAllTx ? "Show Latest 3" : "View All"}
            </button>
          )}
        </div>

<<<<<<< HEAD
        {transactions.length === 0 ? (
          <div className="py-8 px-4 text-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 mx-auto flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-700">No transactions recorded yet today</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-0.5 font-medium">
                Tap <span className="text-[#0072CE] font-bold">+ Quick Sale</span> or use Voice Tally to log your first trade.
              </p>
            </div>
            <div className="pt-1.5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowFastPos(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
              >
                + Quick Sale
              </button>
              <button
                type="button"
                onClick={() => setVoiceTallyModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0072CE] border border-sky-200 text-xs font-bold transition cursor-pointer"
              >
                Voice Tally
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {displayTransactions.map((tx, idx) => {
              const isSale = tx.type === "sale";
              const rawAmt = parseFloat(tx.amount) || 0;
              const title = tx.description || tx.name || (isSale ? "Cash Sale" : "Operating Expense");
              const txTime = tx.ts || (tx.date ? new Date(tx.date).getTime() : 0);
              const relTime = getRelativeTime(txTime);

              return (
                <div
                  key={tx.id || `tx-${tx.ts || tx.date || idx}`}
                  className="p-2.5 rounded-xl flex items-center justify-between text-xs border border-slate-100 bg-slate-50/60 hover:bg-white transition"
                >
                  <div className="flex items-center gap-2.5 truncate min-w-0">
=======
        {displayTransactions.length === 0 ? (
          <p className="text-center text-xs text-[#5B6B85] py-3 font-medium">
            No transactions recorded yet
          </p>
        ) : (
          <div className="space-y-2">
            {displayTransactions.map((tx) => {
              const isSale = tx.type === "sale";
              return (
                <div
                  key={tx.id}
                  className="p-2.5 rounded-xl flex items-center justify-between text-xs border border-[#E5EEF5] bg-[#F8FAFC] hover:bg-white transition"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {/* Clean circular indicator: Green/Blue upward for sales, Red downward for expenses */}
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                        isSale
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-rose-50 text-rose-600 border-rose-200"
                      }`}
                    >
                      {isSale ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                    </div>

<<<<<<< HEAD
                    <div className="truncate min-w-0">
                      <p className="font-extrabold text-[#152449] truncate leading-tight">
                        {title} {tx.qty > 1 ? `x${tx.qty}` : ""}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500 font-medium">
                        <span className="px-1.5 py-0.2 rounded-md bg-slate-200/80 text-slate-700 font-bold text-[9px] uppercase tracking-wider">
                          Cash
                        </span>
                        {tx.category && (
                          <span className="text-slate-400">· {tx.category}</span>
                        )}
                        <span className="text-slate-400">· {relTime}</span>
                      </div>
=======
                    <div className="truncate">
                      <p className="font-extrabold text-[#152449] truncate leading-tight">
                        {tx.name} {tx.qty > 1 ? `x${tx.qty}` : ""}
                      </p>
                      <span className="text-[10px] text-[#5B6B85] font-medium block mt-0.5">
                        {new Date(tx.ts).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} · {isSale ? "Cash In" : "Expense Out"}
                      </span>
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                    </div>
                  </div>

                  <span
<<<<<<< HEAD
                    className={`font-black text-xs shrink-0 ml-2 font-mono ${
                      isSale ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isSale ? "+" : "-"}R{rawAmt.toFixed(2).replace(".", ",")}
=======
                    className={`font-black text-xs shrink-0 ml-2 ${
                      isSale ? "text-emerald-700" : "text-rose-600"
                    }`}
                  >
                    {isSale ? "+" : "-"} {fmt(tx.amount)}
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                  </span>
                </div>
              );
            })}
          </div>
        )}

<<<<<<< HEAD
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[10px]">
          <span className="text-slate-500 font-medium">
=======
        <div className="pt-2 flex items-center justify-between border-t border-[#E5EEF5] text-[10px]">
          <span className="text-[#5B6B85] font-medium">
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
            {showAllTx
              ? `All ${transactions.length} records shown`
              : `Showing latest ${displayTransactions.length} of ${transactions.length}`}
          </span>
          <button
            onClick={() => setScreen("pos")}
            className="font-extrabold text-[#0091CD] hover:underline cursor-pointer"
          >
            Detailed POS Mode →
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Reset App Data Action */}
      <div className="pt-2 pb-2 text-center">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset app data to fresh Day-1 trader state? This clears catalog, transactions, and profile registration.")) {
              resetAppToNewTrader();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-500 text-[11px] font-bold transition cursor-pointer shadow-2xs active:scale-95"
        >
          <span>↺</span>
          <span>Reset App Data</span>
        </button>
      </div>

=======
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
      {/* ========================================================================= */}
      {/* FAST COUNTER POS MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showFastPos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
<<<<<<< HEAD
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowFastPos(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl p-5 bg-white shadow-2xl border border-slate-200 space-y-4 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0091CD]">
=======
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#152449]/70 backdrop-blur-xs p-0 sm:p-4"
            onClick={() => setShowFastPos(false)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-[#E5EEF5] max-h-[90vh] overflow-y-auto space-y-4 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E5EEF5]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#F0F9FF] border border-[#B3DFFA] flex items-center justify-center text-[#0091CD]">
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#152449]">Fast Counter POS</h3>
<<<<<<< HEAD
                    <p className="text-[10px] text-slate-500 font-medium">Quick tap-to-sell cash register</p>
=======
                    <p className="text-[10px] text-[#5B6B85] font-medium">Quick tap-to-sell cash register</p>
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                  </div>
                </div>
                <button
                  onClick={() => setShowFastPos(false)}
<<<<<<< HEAD
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-[#152449] transition cursor-pointer font-bold text-xs"
=======
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#5B6B85] hover:text-[#152449] transition cursor-pointer font-bold text-xs"
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                >
                  ✕
                </button>
              </div>

              {/* Quick Select Catalog Pills */}
              <div className="space-y-1.5">
<<<<<<< HEAD
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Quick Select Catalog
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {availableProducts.map((p, pIdx) => {
                    const isSelected = posSelectedItem === p.name;
                    const price = p.sellingPrice !== undefined ? p.sellingPrice : p.price || 0;
                    return (
                      <button
                        key={p.id ? `prod-id-${p.id}` : (p.name ? `prod-name-${p.name}` : `prod-idx-${pIdx}`)}
=======
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B6B85] block">
                  Quick Select Catalog
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {products.map((p) => {
                    const isSelected = posSelectedItem === p.name;
                    return (
                      <button
                        key={p.id}
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                        type="button"
                        onClick={() => handleSelectProduct(p.name)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          isSelected
                            ? "bg-[#0091CD] text-white border-[#0091CD] shadow-xs"
<<<<<<< HEAD
                            : "bg-slate-50 text-[#152449] border-slate-200 hover:border-[#0091CD]"
                        }`}
                      >
                        {p.name} · {fmt(price)}
=======
                            : "bg-[#F8FAFC] text-[#152449] border-[#E5EEF5] hover:border-[#0091CD]"
                        }`}
                      >
                        {p.name} · {fmt(p.price)}
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => handleSelectProduct("custom")}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      isCustomPos
                        ? "bg-[#0091CD] text-white border-[#0091CD] shadow-xs"
<<<<<<< HEAD
                        : "bg-slate-50 text-[#152449] border-slate-200 hover:border-[#0091CD]"
=======
                        : "bg-[#F8FAFC] text-[#152449] border-[#E5EEF5] hover:border-[#0091CD]"
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                    }`}
                  >
                    + Custom Item
                  </button>
                </div>
              </div>

              {/* Custom Item Name Input */}
              {isCustomPos && (
                <div className="space-y-1">
<<<<<<< HEAD
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
=======
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B6B85] block">
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                    Custom Item Description
                  </label>
                  <input
                    type="text"
<<<<<<< HEAD
                    placeholder="e.g. Loose Stock, Daily Service, Quick Item"
                    value={posCustomName}
                    onChange={(e) => setPosCustomName(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs outline-none bg-white border border-slate-200 text-[#152449] font-semibold focus:border-[#0091CD]"
=======
                    placeholder="e.g. Loose Cigarettes, Milk 1L, Paraffin"
                    value={posCustomName}
                    onChange={(e) => setPosCustomName(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs outline-none bg-white border border-[#E5EEF5] text-[#152449] font-semibold focus:border-[#0091CD]"
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                    required
                  />
                </div>
              )}

              {/* Unit Price & Quantity Stepper */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
<<<<<<< HEAD
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
=======
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B6B85] block">
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                    Price (ZAR)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={posPrice}
                    onChange={(e) => setPosPrice(e.target.value)}
<<<<<<< HEAD
                    className="w-full p-2.5 rounded-xl text-xs outline-none bg-white border border-slate-200 font-black text-[#152449] focus:border-[#0091CD]"
=======
                    className="w-full p-2.5 rounded-xl text-xs outline-none bg-white border border-[#E5EEF5] font-black text-[#152449] focus:border-[#0091CD]"
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                    required
                  />
                </div>

                <div className="space-y-1">
<<<<<<< HEAD
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                    Quantity
                  </label>
                  <div className="flex items-center justify-between p-1 rounded-xl border border-slate-200 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setPosQty(Math.max(1, posQty - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-black text-[#152449] text-xs cursor-pointer"
=======
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B6B85] block">
                    Quantity
                  </label>
                  <div className="flex items-center justify-between p-1 rounded-xl border border-[#E5EEF5] bg-[#F8FAFC]">
                    <button
                      type="button"
                      onClick={() => setPosQty(Math.max(1, posQty - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-[#E5EEF5] font-black text-[#152449] text-xs cursor-pointer"
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                    >
                      -
                    </button>
                    <span className="font-black text-sm text-[#152449]">{posQty}</span>
                    <button
                      type="button"
                      onClick={() => setPosQty(posQty + 1)}
<<<<<<< HEAD
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-black text-[#152449] text-xs cursor-pointer"
=======
                      className="w-7 h-7 rounded-lg bg-white border border-[#E5EEF5] font-black text-[#152449] text-xs cursor-pointer"
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Amount Increment Chips */}
              <div className="flex gap-1.5">
                {[10, 20, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPosPrice(String(amt))}
<<<<<<< HEAD
                    className="flex-1 py-1 rounded-lg text-[10px] font-extrabold border border-slate-200 bg-slate-50 text-slate-600 hover:border-[#0091CD] hover:text-[#0091CD] transition cursor-pointer"
=======
                    className="flex-1 py-1 rounded-lg text-[10px] font-extrabold border border-[#E5EEF5] bg-[#F8FAFC] text-[#5B6B85] hover:border-[#0091CD] hover:text-[#0091CD] transition cursor-pointer"
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                  >
                    R{amt}
                  </button>
                ))}
              </div>

              {/* Total Summary Strip */}
<<<<<<< HEAD
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#0072CE] font-extrabold uppercase tracking-wide block">
                    Cash Tender Total
                  </span>
                  <span className="text-[10px] text-slate-500">Zero fees · 100% retained</span>
                </div>
                <span className="text-base font-black text-[#152449]">
                  R{((parseFloat(posPrice) || 0) * posQty).toFixed(2).replace(".", ",")}
=======
              <div className="p-3 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#0284C7] font-extrabold uppercase tracking-wide block">
                    Cash Tender Total
                  </span>
                  <span className="text-[10px] text-[#5B6B85]">Zero fees · 100% retained</span>
                </div>
                <span className="text-base font-black text-[#152449]">
                  {fmt((parseFloat(posPrice) || 0) * posQty)}
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleFastPosSubmit}
                  disabled={!posPrice || (isCustomPos && !posCustomName.trim())}
                  className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wide border transition shadow-sm cursor-pointer ${
                    posPrice && (!isCustomPos || posCustomName.trim())
                      ? "bg-[#0091CD] text-white border-[#0091CD] hover:bg-[#0077B6]"
<<<<<<< HEAD
                      : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
=======
                      : "bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0] cursor-not-allowed"
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                  }`}
                >
                  {posSuccessMsg ? "Sale Logged to Ledger ✓" : "Record Cash Sale →"}
                </button>
<<<<<<< HEAD
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFastPos(false);
                      setScreen("pos");
                    }}
                    className="text-xs font-bold text-[#0072CE] hover:underline cursor-pointer"
                  >
                    Switch to Full TRADE Tab →
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFastPos(false)}
                    className="text-xs font-bold text-slate-500 hover:text-[#152449] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
=======
                <button
                  type="button"
                  onClick={() => setShowFastPos(false)}
                  className="w-full py-2 text-xs font-bold text-[#5B6B85] hover:text-[#152449] cursor-pointer"
                >
                  Cancel
                </button>
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
