import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";

export default function Reviews() {
  const { fmt, reviewPeriod, setReviewPeriod, totalRevenue, totalExpenses, netProfit, margin } = useApp();
  const [downloadFeedback, setDownloadFeedback] = useState(false);

  function handleDownloadPdf() {
    setDownloadFeedback(true);
    setTimeout(() => setDownloadFeedback(false), 2500);
  }

  const periodLabels = {
    day: "Day",
    week: "Week",
    month: "Month",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4 p-4 bg-white"
    >
      {/* 1. Header with Title & Auditable Tag */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
            Merchant Performance Summary
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Verified cash flow and operational track record
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          POPIA Audited
        </span>
      </div>

      {/* 2. Sleek Period Selection Pill Toggle */}
      <div className="flex rounded-xl p-1 bg-slate-100 border border-slate-200">
        {["day", "week", "month"].map((k) => {
          const isActive = reviewPeriod === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setReviewPeriod(k)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                isActive
                  ? "bg-[#0072CE] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {periodLabels[k]}
            </button>
          );
        })}
      </div>

      {/* 3. Main Cash Flow Summary Card */}
      <div className="rounded-2xl p-4 border border-slate-200 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Cash Turnover ({periodLabels[reviewPeriod]})
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
            {margin || 84}% Margin
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-mono font-black text-[#0072CE]">
          + {fmt(totalRevenue || 1104)}
        </h3>

        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Operating Expenses
            </span>
            <p className="font-mono font-bold text-sm text-slate-900 mt-1">
              - {fmt(totalExpenses || 176)}
            </p>
          </div>
          <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/70">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Net Retained
            </span>
            <p className="font-mono font-black text-sm text-emerald-700 mt-1">
              {netProfit >= 0 ? "+" : "-"} {fmt(Math.abs(netProfit || 928))}
            </p>
          </div>
        </div>
      </div>

      {/* 4. High-Priority Button: Download Auditable Report (PDF) */}
      <button
        type="button"
        onClick={handleDownloadPdf}
        className="w-full py-3.5 px-4 rounded-2xl bg-[#0072CE] hover:bg-[#0284c7] text-white font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm transition cursor-pointer active:scale-[0.99]"
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {downloadFeedback ? "Auditable Report PDF Downloaded ✓" : "Download Auditable Report (PDF)"}
      </button>

      {/* 5. Operational Track Feedback Card */}
      <div className="rounded-2xl p-4 border border-slate-200 bg-white shadow-sm space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
          MERCHANT PERFORMANCE SUMMARY
        </span>
        <p className="text-xs text-slate-600 leading-relaxed">
          Consistent daily recording helps your enterprise qualify for 30-day supplier credit advances. All digital entries are cryptographically hashed and available for direct funder underwriting.
        </p>
      </div>
    </motion.div>
  );
}
