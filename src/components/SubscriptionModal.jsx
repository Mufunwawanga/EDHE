import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";

export default function SubscriptionModal() {
  const {
    subscriptionModal,
    setSubscriptionModal,
    profile,
    upgradeSubscription,
    recordExpense,
  } = useApp();

  const [toastMessage, setToastMessage] = useState("");

  if (!subscriptionModal) return null;

  const currentTier = profile?.subscriptionTier === "free" ? "free" : "growth_pro";
  const isPro = currentTier === "growth_pro";

  function handleTogglePlan(tier) {
    if (tier === "growth_pro") {
      // 1. Upgrade subscription tier in profile and localStorage
      upgradeSubscription("growth_pro");

      // 2. Log -R20.00 expense directly into accounting ledger
      if (recordExpense) {
        recordExpense({
          description: "Cash2Cred Growth Pro Subscription",
          name: "Cash2Cred Growth Pro Subscription",
          category: "Software & Tools",
          amount: 20.0,
          date: new Date().toISOString(),
          paymentMethod: "digital",
        });
      }

      setToastMessage("🎉 Growth Pro Activated! -R20,00 expense logged to ledger.");
    } else {
      // 3. Downgrade handling: switch back to free without reversing past transaction entries
      upgradeSubscription("free");
      setToastMessage("Switched to Starter Free (past ledger records preserved).");
    }

    setTimeout(() => {
      setToastMessage("");
    }, 3200);
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl p-5 bg-white shadow-2xl border border-slate-200 flex flex-col text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 shrink-0">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0072CE] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                Merchant Monetization
              </span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                  isPro
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {isPro ? "Pro Active" : "Free Tier"}
              </span>
            </div>
            <h3 className="text-base font-black text-[#152449] mt-1 tracking-tight">
              Subscription & Business Tiers
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Transparent, low-cost micro-billing built for township traders.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSubscriptionModal(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-xs transition cursor-pointer shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Comparison Cards */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-0.5">
          {/* Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center shadow-xs"
              >
                {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Plan 1: Starter Free (R0) */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              !isPro
                ? "border-[#0072CE] bg-sky-50/40 ring-2 ring-[#0072CE]/20 shadow-xs"
                : "border-slate-200 bg-slate-50/60 opacity-80 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-[#152449]">Starter Free</span>
                <p className="text-[10px] text-slate-500 font-semibold">For day-to-day cash tallying</p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-[#152449] font-mono">R0</span>
                <span className="text-[10px] text-slate-400 block -mt-1 font-bold">Forever free</span>
              </div>
            </div>

            <ul className="mt-3 space-y-2 text-[11px] text-slate-700">
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span><strong>Basic Cash Till:</strong> Fast Counter POS tap-to-sell</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span><strong>Voice Tally:</strong> Up to 15 voice logs / day</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span><strong>Snap-Log OCR:</strong> 1 notebook scan / day</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span><strong>Micro-Credit:</strong> Working Capital access up to R5,000</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-3.5 h-3.5 text-center leading-none text-xs font-bold text-slate-300 shrink-0">✕</span>
                <span className="line-through">Print Official Thermal Till-Slips</span>
              </li>
            </ul>

            {isPro && (
              <button
                type="button"
                onClick={() => handleTogglePlan("free")}
                className="mt-3 w-full py-1.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold transition cursor-pointer"
              >
                Switch to Starter Free (Demo)
              </button>
            )}
          </div>

          {/* Plan 2: Growth Pro (R20/mo) - Highlighted */}
          <div
            className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
              isPro
                ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/25 shadow-md"
                : "border-[#0072CE] bg-gradient-to-br from-white to-sky-50/50 shadow-sm"
            }`}
          >
            {/* Pro Pill Banner */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-[#152449]">Growth Pro</span>
                  <span className="text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-2xs">
                    Recommended
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold">For serious micro-enterprise expansion</p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-0.5">
                  <span className="text-base font-black text-[#0072CE] font-mono">R20</span>
                  <span className="text-[10px] font-bold text-slate-500">/mo</span>
                </div>
                <span className="text-[9px] text-emerald-600 block -mt-1 font-bold">Automated Float-Deduct</span>
              </div>
            </div>

            <ul className="mt-3 space-y-2 text-[11px] text-slate-800">
              <li className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span><strong>Unlimited Daily Snap-Log OCR Scans</strong> (Free limited to 1 page/day)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span><strong>Print Official Thermal Till-Slip Statements & Receipts</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span><strong>Asset Finance Access:</strong> Unlocks R12,000+ equipment loans</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span><strong>POPIA Audited Passport Export:</strong> Official certified business profile</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span><strong>Automated Wholesale Restock:</strong> Supplier credit lines</span>
              </li>
            </ul>

            {/* Micro-Billing Information */}
            <div className="mt-3 p-2.5 rounded-xl bg-white/90 border border-slate-200 text-[10px] text-slate-600 leading-snug">
              <span className="font-bold text-[#152449] block">Smart Town Micro-Billing:</span>
              Deducted automatically as <strong>R0.66/day</strong> only on active trading days from recorded digital till revenue. Zero debit orders, zero overdraft penalties.
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-3 border-t border-slate-100 space-y-2 shrink-0">
          {!isPro ? (
            <button
              type="button"
              onClick={() => handleTogglePlan("growth_pro")}
              className="w-full py-3 px-4 rounded-xl bg-[#0072CE] hover:bg-[#0284c7] text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <span>⚡</span>
              <span>Activate Growth Pro — R20/mo</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSubscriptionModal(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wide transition cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Keep Growth Pro Active ✓
              </button>
              <button
                type="button"
                onClick={() => handleTogglePlan("free")}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-600 text-xs font-bold transition cursor-pointer"
                title="Switch back to free tier for demo testing"
              >
                Switch Free
              </button>
            </div>
          )}

          <p className="text-[10px] text-center text-slate-400 font-medium">
            Demo Mode: Instant state toggle for testing and showcase verification.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
