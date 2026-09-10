import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Pre-approved funder facility definitions
 */
const FUNDERS = [
  {
    id: "thusong",
    altId: "a1",
    name: "Thusong Microfinance",
    pill: "Working Capital",
    facilityType: "Unsecured Revolving Working Capital",
    limit: 5000,
    term: "30-day revolving line @ 5%",
    repayment: "Weekly digital turnover auto-deduction",
    minScore: 50,
    license: "NCRCP1044",
  },
  {
    id: "vuka",
    altId: "a2",
    name: "Vuka Enterprise Fund",
    pill: "Asset Finance",
    facilityType: "Growth Equipment & Asset Finance",
    limit: 12000,
    term: "90 days @ 7.5%",
    repayment: "Bi-weekly digital debit",
    minScore: 75,
    license: "NCRCP8921",
  },
  {
    id: "kopano",
    altId: "a3",
    name: "Kopano Supplier Credit",
    pill: "Stock Advance",
    facilityType: "Wholesale Stock Advance",
    limit: 3500,
    term: "14-Day Wholesale Stock Line",
    repayment: "Direct settlement at partner cash-and-carry wholesalers",
    minScore: 50,
    license: "CP-TRADE-401",
  },
];

export default function CreditId() {
  const {
    profile,
    metrics,
    growthScore,
    transactions,
    margin,
    partnersAccess,
    setPartnersAccess,
    consent,
    toggleConsent,
    fmt,
    isPremium,
    upgradeSubscription,
    recordExpense,
    setSlipReceiptModal,
  } = useApp();

  const isPro = profile?.subscriptionTier === "growth_pro" || isPremium;
  const [showTillSlipPaywall, setShowTillSlipPaywall] = useState(false);

  function handleOpenTillSlip() {
    if (!isPro) {
      setShowTillSlipPaywall(true);
    } else {
      setSlipReceiptModal(true);
    }
  }

  function handleInstantUpgradePro() {
    if (upgradeSubscription) {
      upgradeSubscription("growth_pro");
    }
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
    setShowTillSlipPaywall(false);
    setSlipReceiptModal(true);
  }

  // Determine Growth Readiness Score
  const score = metrics?.growthScore ?? metrics?.growthReadinessScore ?? growthScore ?? 65;

  // Dynamic status badge band
  let statusBadge = {
    label: "Building",
    color: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    textColor: "text-amber-400",
  };
  if (score >= 75) {
    statusBadge = {
      label: "Bankable",
      color: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
      textColor: "text-emerald-400",
    };
  } else if (score >= 60) {
    statusBadge = {
      label: "Emerging",
      color: "bg-sky-500/20 text-sky-300 border-sky-400/30",
      textColor: "text-sky-400",
    };
  }

  // Persistent Passport Hash Code
  const [passportCode, setPassportCode] = useState(() => {
    if (profile?.passportCode) return profile.passportCode;
    const stored = localStorage.getItem("c2c_passport_code");
    if (stored) return stored;
    const randPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    const generated = `C2C-ZA-${randPart}`;
    localStorage.setItem("c2c_passport_code", generated);
    return generated;
  });

  useEffect(() => {
    if (profile?.passportCode && profile.passportCode !== passportCode) {
      setPassportCode(profile.passportCode);
    }
  }, [profile?.passportCode]);

  // Telemetry aggregates
  const thirtyDayTurnover = metrics?.thirtyDayTurnover ?? 0;
  const operatingMargin = metrics?.grossMarginPercent ?? metrics?.todayMargin ?? margin ?? 0;
  const activeStreak = metrics?.activeStreak ?? (transactions?.length > 0 ? 1 : 0);
  const auditedCount = transactions?.length ?? metrics?.totalTransactions ?? 0;

  // Local consent state synchronized with AppContext
  const [localConsents, setLocalConsents] = useState(() => {
    return {
      thusong: consent?.thusong ?? partnersAccess?.a1 ?? partnersAccess?.thusong ?? true,
      vuka: consent?.vuka ?? partnersAccess?.a2 ?? partnersAccess?.vuka ?? false,
      kopano: consent?.kopano ?? partnersAccess?.a3 ?? partnersAccess?.kopano ?? true,
    };
  });

  function handleToggle(funderId, altId) {
    const nextVal = !localConsents[funderId];
    setLocalConsents((prev) => ({ ...prev, [funderId]: nextVal }));

    if (toggleConsent) {
      toggleConsent(funderId);
    }
    if (setPartnersAccess) {
      setPartnersAccess((prev) => ({
        ...prev,
        [altId]: nextVal,
        [funderId]: nextVal,
      }));
    }
  }

  // Export PDF simulated loading state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  function handleDownloadPassport() {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(15);
    setExportSuccess(false);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 280);

    setTimeout(() => {
      clearInterval(interval);
      setExportProgress(100);
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
      }, 4000);
    }, 1500);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4 p-4 bg-slate-50 min-h-[85vh] text-left"
    >
      {/* ========================================================================= */}
      {/* 1. BUSINESS BANKING PASSPORT CARD (#152449) */}
      {/* ========================================================================= */}
      <div className="rounded-3xl p-5 bg-[#152449] text-white shadow-xl relative overflow-hidden border border-[#1e3366]">
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#0072CE]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#0E8A4E]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row: Verified POPIA Shield Badge */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black tracking-wide">
            <svg
              className="w-3.5 h-3.5 text-emerald-400 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM13.707 7.707a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>POPIA Underwritten Shield</span>
          </div>
        </div>

        {/* Enterprise Identity */}
        <div className="mt-4 relative z-10">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-white tracking-tight leading-tight">
              {profile?.businessName || "My Enterprise"}
            </h3>
            <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-extrabold text-slate-200">
              {profile?.category || profile?.businessType || "General Trade"}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium mt-1">
            {profile?.ownerName || "Trader"} · {profile?.phone || "072 000 0000"}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-4 relative z-10" />

        {/* Growth Readiness Score & Passport Hash Code */}
        <div className="flex items-end justify-between relative z-10">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">
              Growth Readiness Score
            </span>
            <div className="flex items-center gap-2.5 mt-1">
              <span className="text-2xl font-mono font-black text-white">
                {score}/100
              </span>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${statusBadge.color}`}
              >
                {statusBadge.label}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">
              Passport Hash Code
            </span>
            <p className="font-mono text-[#0072CE] bg-sky-50/10 border border-sky-400/20 px-2 py-1 rounded-lg text-xs font-black tracking-wider mt-1 inline-block">
              {passportCode}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TELEMETRY SUMMARY (2x2 GRID) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#152449]">
            Audited Cash Telemetry (30-Day)
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            Real-Time Verified
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 30-Day Turnover Aggregate */}
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 block">
              30-Day Turnover Aggregate
            </span>
            <span className="text-base font-mono font-black text-slate-900 block mt-1">
              {fmt(thirtyDayTurnover)}
            </span>
          </div>

          {/* Operating Margin % */}
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 block">
              Operating Margin %
            </span>
            <span className="text-base font-mono font-black text-emerald-600 block mt-1">
              {operatingMargin}%
            </span>
          </div>

          {/* Active Consistency Streak */}
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 block">
              Active Consistency Streak
            </span>
            <span className="text-xs font-black text-[#152449] block mt-1.5">
              {activeStreak} Days Logged
            </span>
          </div>

          {/* Audited Transactions Count */}
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 block">
              Audited Transactions
            </span>
            <span className="text-xs font-black text-[#152449] block mt-1.5">
              {auditedCount} Records Logged
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PRE-APPROVED CREDIT FACILITIES & CONSENT TOGGLES */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#152449]">
            Pre-Approved Facilities & POPIA Consent
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            Disbursement Ready
          </span>
        </div>

        <div className="space-y-2.5">
          {/* Facility 1: Thusong Microfinance (R5,000 Working Capital limit) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-[#0072CE] transition">
            {/* Line 1: Lender Name */}
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              Thusong Microfinance
            </h4>

            {/* Line 2: Category Badge & Status Button on exact same horizontal line */}
            <div className="flex items-center justify-between gap-2 mb-3 w-full">
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md border border-blue-200 bg-blue-50 text-[#0072CE] uppercase inline-flex items-center">
                Working Capital
              </span>

              <button
                type="button"
                onClick={() => handleToggle("thusong", "a1")}
                className={`px-3 py-1 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  localConsents.thusong
                    ? "bg-[#152449] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    localConsents.thusong ? "bg-emerald-400" : "bg-slate-400"
                  }`}
                />
                <span>{localConsents.thusong ? "Consent Active" : "Grant Consent"}</span>
              </button>
            </div>

            {/* Facility Amount & Details */}
            <p className="text-base font-mono font-black text-[#0072CE]">
              R5,000.00 Limit
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              30-day revolving line @ 5% · Weekly digital turnover auto-deduction
            </p>
          </div>

          {/* Facility 2: Vuka Enterprise Fund (R12,000 Asset & Equipment loan) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-[#0072CE] transition opacity-95">
            {/* Line 1: Lender Name */}
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              Vuka Enterprise Fund
            </h4>

            {/* Line 2: Category Badge & Status Button on exact same horizontal line */}
            <div className="flex items-center justify-between gap-2 mb-3 w-full">
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md border border-blue-200 bg-blue-50 text-[#0072CE] uppercase inline-flex items-center">
                Asset Finance
              </span>

              {score >= 75 ? (
                <button
                  type="button"
                  onClick={() => handleToggle("vuka", "a2")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                    localConsents.vuka
                      ? "bg-[#152449] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      localConsents.vuka ? "bg-emerald-400" : "bg-slate-400"
                    }`}
                  />
                  <span>{localConsents.vuka ? "Consent Active" : "Grant Consent"}</span>
                </button>
              ) : (
                <span className="px-3 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-500 border border-slate-200 inline-flex items-center gap-1.5 shrink-0">
                  <span>🔒</span>
                  <span>Unlocks at Score 75+</span>
                </span>
              )}
            </div>

            {/* Facility Amount & Details */}
            <p className="text-base font-mono font-black text-slate-800">
              R12,000.00 Loan
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              90 days @ 7.5% · Asset & equipment finance
            </p>
          </div>

          {/* Facility 3: Kopano Supplier Credit (R3,500 14-Day Wholesale Stock Line) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-[#0072CE] transition">
            {/* Line 1: Lender Name */}
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              Kopano Supplier Credit
            </h4>

            {/* Line 2: Category Badge & Status Button on exact same horizontal line */}
            <div className="flex items-center justify-between gap-2 mb-3 w-full">
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md border border-blue-200 bg-blue-50 text-[#0072CE] uppercase inline-flex items-center">
                Stock Advance
              </span>

              <button
                type="button"
                onClick={() => handleToggle("kopano", "a3")}
                className={`px-3 py-1 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  localConsents.kopano
                    ? "bg-[#152449] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    localConsents.kopano ? "bg-emerald-400" : "bg-slate-400"
                  }`}
                />
                <span>{localConsents.kopano ? "Consent Active" : "Grant Consent"}</span>
              </button>
            </div>

            {/* Facility Amount & Details */}
            <p className="text-base font-mono font-black text-[#0072CE]">
              R3,500.00 Stock Line
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              14-Day Wholesale Stock Line · Direct settlement at partner wholesalers
            </p>
          </div>
        </div>

        {/* Subtle B2B Revenue & Monetization Disclosure Card */}
        <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200/80 text-left space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0072CE]"></span>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#0072CE] block">
              B2B Commercial Model & Transparency
            </span>
          </div>
          <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
            Commercial Model: Zero upfront fees for basic traders. Cash2Cred earns a 2% origination fee paid directly by underwriting partners upon facility drawdown.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. EXPORT AUDITABLE STATEMENT */}
      {/* ========================================================================= */}
      <div className="pt-2 space-y-2">
        {/* Progress bar during export */}
        {isExporting && (
          <div className="space-y-1.5 p-3 rounded-2xl bg-white border border-slate-200">
            <div className="flex justify-between text-[11px] font-bold text-[#152449]">
              <span>Generating Auditable Business Passport (PDF)...</span>
              <span className="font-mono">{exportProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#0072CE] h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Success Confirmation Toast */}
        <AnimatePresence>
          {exportSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>Auditable Business Passport (PDF) downloaded successfully!</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCertificateModal(true)}
                className="text-[10px] underline font-extrabold text-emerald-900 cursor-pointer"
              >
                View Certificate
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={handleOpenTillSlip}
          className="w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-[0.99] border bg-[#0072CE] hover:bg-[#005fa8] text-white border-[#0072CE]"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          <span>Print / Export Official Thermal Till-Slip</span>
          {!isPro && (
            <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-400 text-[#152449]">
              PRO
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TILL-SLIP GROWTH PRO PAYWALL MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showTillSlipPaywall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowTillSlipPaywall(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl p-5 bg-white shadow-2xl border border-slate-200 space-y-4 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm shadow-xs font-bold">
                    👑
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">
                      Growth Pro Feature
                    </span>
                    <h3 className="text-sm font-black text-[#152449]">
                      Certified Till Slip Statement
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTillSlipPaywall(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5 leading-relaxed">
                <p className="font-bold">
                  Official Stamped Till Slip Statements require Growth Pro (R20/mo). Upgrade to print and export certified records.
                </p>
                <p className="text-[11px] text-amber-800">
                  Includes full 80mm thermal receipt format, QR verification hash, operating margins, and POPIA underwriter stamp.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleInstantUpgradePro}
                  className="w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-[#152449] hover:bg-[#0f1a35] text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition"
                >
                  <span>⚡ Upgrade to Growth Pro (R20/mo)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowTillSlipPaywall(false)}
                  className="w-full py-2 px-4 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-800 transition cursor-pointer text-center"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
