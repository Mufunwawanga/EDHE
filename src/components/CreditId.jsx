<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import React, { useState } from "react";
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

/**
<<<<<<< HEAD
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
=======
 * Funder partners data enriched with specific facility limits and commercial terms
 */
const FUNDER_DETAILS = {
  a1: {
    id: "a1",
    name: "Thusong Microfinance",
    funderName: "Thusong Microfinance",
    pill: "Working Capital",
    facilityType: "Unsecured Revolving Working Capital",
    limit: 5000,
    term: "30 days @ 5% · Revolving",
    repayment: "Weekly digital turnover auto-deduction",
    minScore: 60,
    license: "NCRCP1044",
  },
  a2: {
    id: "a2",
    name: "Vuka Enterprise Fund",
    funderName: "Vuka Enterprise Fund",
    pill: "Asset Finance",
    facilityType: "Growth Equipment & Asset Finance",
    limit: 12000,
    term: "90 days @ 7.5% · Requires Score 75+",
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
    repayment: "Bi-weekly digital debit",
    minScore: 75,
    license: "NCRCP8921",
  },
<<<<<<< HEAD
  {
    id: "kopano",
    altId: "a3",
    name: "Kopano Supplier Credit",
    pill: "Stock Advance",
    facilityType: "Wholesale Stock Advance",
    limit: 3500,
    term: "14-Day Wholesale Stock Line",
=======
  a3: {
    id: "a3",
    name: "Kopano Supplier Credit",
    funderName: "Kopano Supplier Credit",
    pill: "Stock Advance",
    facilityType: "Wholesale Stock Advance",
    limit: 3500,
    term: "14-day wholesale stock line",
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
    repayment: "Direct settlement at partner cash-and-carry wholesalers",
    minScore: 50,
    license: "CP-TRADE-401",
  },
<<<<<<< HEAD
];
=======
};
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c

export default function CreditId() {
  const {
    profile,
<<<<<<< HEAD
    metrics,
=======
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
    growthScore,
    transactions,
    margin,
    partnersAccess,
    setPartnersAccess,
<<<<<<< HEAD
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
=======
    totalRevenue,
    totalExpenses,
    activeStreak,
    fmt,
  } = useApp();

  // Partner Terms Modal State
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [shareTurnover, setShareTurnover] = useState(true);
  const [shareStockFreq, setShareStockFreq] = useState(true);
  const [shareConsistency, setShareConsistency] = useState(true);
  const [drawdownSuccess, setDrawdownSuccess] = useState(false);

  // Statement Certificate Modal State
  const [showCertificate, setShowCertificate] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState(false);

  const rawCode = profile?.accessCode || "GENKH";
  const businessCode = rawCode.startsWith("C2C-") ? rawCode : `C2C-ZA-${rawCode}`;
  const traderName = profile?.ownerName || "Zanele Khumalo";
  const storeName = profile?.storeName || "zwa's Hair Salon";
  const traderPhone = profile?.phone || "+27 82 555 3192";
  const effectiveScore = growthScore || 70;
  const isBankable = effectiveScore >= 60;

  function handleOpenPartnerModal(partner) {
    setSelectedPartner(partner);
    setDrawdownSuccess(false);
  }

  function handleToggleConsent(partnerId) {
    const current = !!partnersAccess[partnerId];
    setPartnersAccess({
      ...partnersAccess,
      [partnerId]: !current,
    });
  }

  function handleDrawdownOffer() {
    if (!selectedPartner) return;
    setPartnersAccess({
      ...partnersAccess,
      [selectedPartner.id]: true,
    });
    setDrawdownSuccess(true);
    setTimeout(() => {
      setSelectedPartner(null);
      setDrawdownSuccess(false);
    }, 2200);
  }

  function handleCopyVerifyLink() {
    navigator.clipboard.writeText(`https://cash2cred.co.za/verify/${businessCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  }

  function handleDownloadStatement() {
    setDownloadFeedback(true);
    setTimeout(() => setDownloadFeedback(false), 2500);
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
<<<<<<< HEAD
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
=======
      className="space-y-4 p-4 bg-white"
    >
      {/* ========================================================================= */}
      {/* 1. MERCHANT PASSPORT HEADER (NAVY CARD #003B5C) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl p-5 bg-[#003B5C] text-white shadow-md relative overflow-hidden">
        {/* Top Row: Single clean pill */}
        <div className="flex items-center justify-between">
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            POPIA Verified Merchant
          </span>
          <span className="text-[9px] font-bold text-sky-200 uppercase tracking-wider">
            Capitec Alternative Pipeline
          </span>
        </div>

        {/* Middle: Store name & Owner info */}
        <div className="mt-3">
          <h3 className="text-[18px] font-bold text-white tracking-tight leading-snug">
            {storeName}
          </h3>
          <p className="text-[12px] text-slate-300 font-normal mt-0.5">
            {traderName} · {traderPhone}
          </p>
        </div>

        {/* Divider line */}
        <div className="border-t border-white/10 my-3" />

        {/* Bottom Row (Split 2-Column) */}
        <div className="flex justify-between items-end">
          {/* Left Column: Growth Readiness Score */}
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
              GROWTH READINESS SCORE
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[20px] font-mono font-bold text-white">
                {effectiveScore}/100
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/15 text-white">
                {isBankable ? "Bankable" : "Building"}
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
              </span>
            </div>
          </div>

<<<<<<< HEAD
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">
              Passport Hash Code
            </span>
            <p className="font-mono text-[#0072CE] bg-sky-50/10 border border-sky-400/20 px-2 py-1 rounded-lg text-xs font-black tracking-wider mt-1 inline-block">
              {passportCode}
=======
          {/* Right Column: Passport Code */}
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
              PASSPORT CODE
            </span>
            <p className="font-mono text-sky-200 text-sm font-bold tracking-wide mt-0.5">
              {businessCode}
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
<<<<<<< HEAD
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
=======
      {/* 2. FINANCIAL IDENTITY & CASH VELOCITY METRICS (MERGED 2x2 GRID) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-[#E5EEF5] p-4 bg-white shadow-sm space-y-3">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          Verified Cash Velocity (30-Day)
        </span>

        {/* 4 Clean Data Cells (no nested bulky card borders) */}
        <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
          <div>
            <span className="text-[10px] font-medium text-slate-500 block">30-Day Turnover</span>
            <span className="bold text-slate-900 font-mono text-base block mt-0.5">
              {fmt(totalRevenue || 1104)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-medium text-slate-500 block">Net Operating Margin</span>
            <span className="bold text-emerald-600 font-mono text-base block mt-0.5">
              {margin || 84}%
            </span>
          </div>

          <div>
            <span className="text-[10px] font-medium text-slate-500 block">Consistency Streak</span>
            <span className="text-slate-800 text-xs font-semibold block mt-0.5">
              {activeStreak || 2} Days Logged
            </span>
          </div>

          <div>
            <span className="text-[10px] font-medium text-slate-500 block">Audited Records</span>
            <span className="text-slate-800 text-xs font-semibold block mt-0.5">
              {transactions.length || 5} Transactions
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
<<<<<<< HEAD
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
=======
      {/* 3. PARTNER PRE-APPROVAL FACILITIES */}
      {/* ========================================================================= */}
      <div className="space-y-2.5">
        <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500 block">
          Pre-Approved Credit Facilities
        </span>

        <div className="space-y-2.5">
          {/* Card 1: Thusong Microfinance */}
          <div
            onClick={() => handleOpenPartnerModal(FUNDER_DETAILS.a1)}
            className="rounded-2xl border border-[#E5EEF5] bg-white p-4 shadow-sm hover:border-[#0091CD] transition cursor-pointer flex items-center justify-between"
          >
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2">
                <h4 className="bold text-sm text-slate-900">Thusong Microfinance</h4>
                <span className="bg-[#F2F6FA] text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-[#E5EEF5]">
                  Working Capital
                </span>
              </div>
              <p className="large bold text-[#0091CD] font-mono text-lg mt-1">
                R5,000
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                30 days @ 5% · Revolving
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenPartnerModal(FUNDER_DETAILS.a1);
              }}
              className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer hover:bg-emerald-100 transition shadow-2xs shrink-0"
            >
              Consent Active
            </button>
          </div>

          {/* Card 2: Vuka Enterprise Fund */}
          <div className="rounded-2xl border border-[#E5EEF5] bg-white p-4 shadow-sm opacity-85 flex items-center justify-between">
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2">
                <h4 className="bold text-sm text-slate-900">Vuka Enterprise Fund</h4>
                <span className="bg-[#F2F6FA] text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-[#E5EEF5]">
                  Asset Finance
                </span>
              </div>
              <p className="text-slate-400 font-mono text-base mt-1 font-bold">
                R12,000
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                90 days @ 7.5% · Requires Score 75+
              </p>
            </div>

            <span className="bg-slate-100 text-slate-400 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 select-none border border-slate-200">
              Score 75+ Req
            </span>
          </div>

          {/* Card 3: Kopano Wholesale Credit */}
          <div
            onClick={() => handleOpenPartnerModal(FUNDER_DETAILS.a3)}
            className="rounded-2xl border border-[#E5EEF5] bg-white p-4 shadow-sm hover:border-[#0091CD] transition cursor-pointer flex items-center justify-between"
          >
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2">
                <h4 className="bold text-sm text-slate-900">Kopano Supplier Credit</h4>
                <span className="bg-[#F2F6FA] text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-[#E5EEF5]">
                  Stock Advance
                </span>
              </div>
              <p className="bold text-[#0091CD] font-mono text-base mt-1">
                R3,500
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                14-day wholesale stock line
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenPartnerModal(FUNDER_DETAILS.a3);
              }}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition cursor-pointer shadow-2xs shrink-0 ${
                partnersAccess.a3
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                  : "bg-[#0091CD] text-white hover:bg-[#0077B6]"
              }`}
            >
              {partnersAccess.a3 ? "Consent Active" : "Grant Consent"}
            </button>
          </div>
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
        </div>
      </div>

      {/* ========================================================================= */}
<<<<<<< HEAD
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
=======
      {/* 4. EXPORT ACTION BUTTON */}
      {/* ========================================================================= */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowCertificate(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#0091CD] text-white hover:bg-[#0077B6] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition cursor-pointer active:scale-[0.99]"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Official Business Passport (PDF)
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
        </button>
      </div>

      {/* ========================================================================= */}
<<<<<<< HEAD
      {/* TILL-SLIP GROWTH PRO PAYWALL MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showTillSlipPaywall && (
=======
      {/* MODAL 1: PARTNER TERMS & POPIA CONSENT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedPartner && (
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
<<<<<<< HEAD
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
=======
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#003B5C]/75 backdrop-blur-xs p-0 sm:p-4"
            onClick={() => setSelectedPartner(null)}
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
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EEF5]">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0091CD] block">
                    Funder Terms & Consent Portal
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedPartner.funderName || selectedPartner.name}
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    NCR Registered Credit Provider · License {selectedPartner.license}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F6FA] text-slate-500 hover:text-slate-900 transition cursor-pointer font-bold text-xs"
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                >
                  ✕
                </button>
              </div>

<<<<<<< HEAD
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
=======
              {/* Commercial Terms Summary Card */}
              <div className="p-4 rounded-2xl bg-[#F2F6FA] border border-[#E5EEF5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">Facility Type:</span>
                  <span className="text-xs font-bold text-slate-900">
                    {selectedPartner.facilityType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center pt-1">
                  <div className="p-2.5 rounded-xl bg-white border border-[#E5EEF5]">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">Pre-Approved Limit</span>
                    <span className="text-base font-mono font-bold text-[#0091CD]">
                      R{selectedPartner.limit.toLocaleString()}.00
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#E5EEF5]">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">Repayment Term</span>
                    <span className="text-xs font-bold text-slate-900 mt-1 block">
                      {selectedPartner.term}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-600 pt-1">
                  <div className="flex justify-between">
                    <span>Repayment Mechanism:</span>
                    <span className="font-bold text-slate-900">{selectedPartner.repayment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Merchant Upfront Fee:</span>
                    <span className="font-bold text-emerald-600">R0.00 (Zero Upfront Fee)</span>
                  </div>
                </div>

                {/* Business Model Footnote */}
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[10px] text-[#003B5C] leading-relaxed">
                  <strong className="block font-bold">Platform Business Model:</strong>
                  2% origination fee paid by credit provider upon disbursement. Zero upfront borrowing fee for merchant.
                </div>
              </div>

              {/* POPIA Consent Toggles */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900 block">
                  POPIA Statutory Consent Toggles
                </span>

                <label className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F2F6FA] border border-[#E5EEF5] text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={shareTurnover}
                    onChange={(e) => setShareTurnover(e.target.checked)}
                    className="w-4 h-4 accent-[#0091CD] rounded cursor-pointer"
                  />
                  <span className="font-semibold text-slate-900">
                    Share 30-day verified turnover aggregate
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F2F6FA] border border-[#E5EEF5] text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={shareStockFreq}
                    onChange={(e) => setShareStockFreq(e.target.checked)}
                    className="w-4 h-4 accent-[#0091CD] rounded cursor-pointer"
                  />
                  <span className="font-semibold text-slate-900">
                    Share stock purchase frequency
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F2F6FA] border border-[#E5EEF5] text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={shareConsistency}
                    onChange={(e) => setShareConsistency(e.target.checked)}
                    className="w-4 h-4 accent-[#0091CD] rounded cursor-pointer"
                  />
                  <span className="font-semibold text-slate-900">
                    Share daily logging streak and margin stability
                  </span>
                </label>
              </div>

              {/* Grant Direct Pre-Approval Access Toggle */}
              <div className="p-3 rounded-xl border border-[#E5EEF5] bg-white flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Grant Lender Direct Pre-Approval Access
                  </p>
                  <span className="text-[10px] text-slate-500">
                    Allows {selectedPartner.funderName} to underwrite stock advance
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleConsent(selectedPartner.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                    partnersAccess[selectedPartner.id]
                      ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                      : "bg-[#F2F6FA] text-slate-600 border-slate-300"
                  }`}
                >
                  {partnersAccess[selectedPartner.id] ? "Granted" : "Grant Access"}
                </button>
              </div>

              {/* Confirm Drawdown Offer Action */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleDrawdownOffer}
                  disabled={drawdownSuccess}
                  className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wide border border-[#0091CD] bg-[#0091CD] text-white hover:bg-[#0077B6] transition cursor-pointer shadow-sm"
                >
                  {drawdownSuccess
                    ? "Disbursement Dispatched to Merchant Wallet ✓"
                    : "Confirm Consent & Draw Down Facility →"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: SINGLE-PAGE EXPORT VERIFIED STATEMENT VIEW */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#003B5C]/75 backdrop-blur-xs p-3 sm:p-4"
            onClick={() => setShowCertificate(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5EEF5] p-5 space-y-4 max-h-[92vh] overflow-y-auto text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Certificate Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EEF5]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0091CD] text-white flex items-center justify-center font-black text-sm">
                    C2C
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight uppercase tracking-wider">
                      Official Business Passport
                    </h3>
                    <span className="text-[10px] text-[#0091CD] font-semibold">
                      Capitec & Cash2Cred Underwriting Protocol
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCertificate(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F2F6FA] text-slate-500 hover:text-slate-900 transition cursor-pointer font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Merchant Details Block */}
              <div className="p-3.5 rounded-xl bg-[#F2F6FA] border border-[#E5EEF5] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500">Merchant & Enterprise</span>
                    <h4 className="text-sm font-bold text-slate-900">{storeName}</h4>
                    <p className="text-xs text-slate-600 font-medium">{traderName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-500">Passport Code</span>
                    <p className="font-mono font-bold text-xs text-[#0091CD]">{businessCode}</p>
                    <span className="text-[9px] text-slate-500">Date: {new Date().toLocaleDateString("en-ZA")}</span>
                  </div>
                </div>
              </div>

              {/* Verified Underwriting Metrics Table */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Audited Cash-Flow Summary (Past 30 Days)
                </span>
                <div className="divide-y divide-[#E5EEF5] rounded-xl border border-[#E5EEF5] text-xs">
                  <div className="flex justify-between p-2.5 bg-white">
                    <span className="font-medium text-slate-600">30-Day Gross Cash Turnover</span>
                    <span className="font-mono font-bold text-slate-900">{fmt(totalRevenue || 1104)}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#F2F6FA]">
                    <span className="font-medium text-slate-600">Total Operating Expenses</span>
                    <span className="font-mono font-bold text-slate-900">{fmt(totalExpenses || 176)}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-white">
                    <span className="font-medium text-slate-600">Net Operating Margin</span>
                    <span className="font-mono font-bold text-emerald-600">{margin || 84}%</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#F2F6FA]">
                    <span className="font-medium text-slate-600">Consistency Streak</span>
                    <span className="font-semibold text-slate-900">{activeStreak || 2} Days Logged</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-white">
                    <span className="font-medium text-slate-600">Audited Digital Records</span>
                    <span className="font-semibold text-slate-900">{transactions.length || 5} Verified Entries</span>
                  </div>
                </div>
              </div>

              {/* Score & Verified Protocol Seal */}
              <div className="p-3.5 rounded-xl border border-[#B3DFFA] bg-gradient-to-br from-[#F0F9FF] to-white flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase text-[#0091CD] block">
                    Verified Growth Score
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-mono font-bold text-slate-900">{effectiveScore}</span>
                    <span className="text-xs font-bold text-slate-500">/100</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">
                    {isBankable ? "Status: Bankable (Tier A)" : "Status: Building (Tier B)"}
                  </span>
                </div>

                {/* Cryptographic Verification Seal */}
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#0091CD] flex flex-col items-center justify-center text-center p-1 bg-white shadow-xs">
                  <svg className="w-5 h-5 text-[#0091CD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-[8px] font-bold uppercase text-slate-900 leading-tight mt-0.5">
                    Verified
                  </span>
                </div>
              </div>

              <p className="text-[9px] text-slate-500 text-center font-mono">
                SHA-256: 4f8b9e11c82b09da · cash2cred.co.za/verify/{businessCode}
              </p>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadStatement}
                  className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide border border-[#0091CD] bg-[#0091CD] text-white hover:bg-[#0077B6] transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {downloadFeedback ? "Passport PDF Downloaded ✓" : "Download Official Passport (PDF)"}
                </button>
                <button
                  type="button"
                  onClick={handleCopyVerifyLink}
                  className="w-full py-2 rounded-xl text-xs font-bold border border-[#E5EEF5] bg-[#F2F6FA] text-slate-800 hover:bg-[#E5EEF5] transition cursor-pointer"
                >
                  {copiedLink ? "Link Copied to Clipboard ✓" : "Copy Verification URL"}
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
