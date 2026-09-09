<<<<<<< HEAD
import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { LANGUAGES } from "../constants/data";
import { motion, AnimatePresence } from "framer-motion";
import { getDefaultBusinessNameForCategory, DEFAULT_BUSINESS_NAMES } from "../services/db";

const TRADE_CATEGORIES = [
  "Salon & Beauty",
  "Street Food",
  "Spaza Shop",
  "General Trade",
  "Freelance / Services",
  "Fruit & Veg Vendor",
  "Auto Repair & Spares",
  "Tailor & Craft",
];
=======
import React from "react";
import { useApp } from "../context/AppContext";
import { LANGUAGES } from "../constants/data";
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c

export default function Header() {
  const {
    profile,
<<<<<<< HEAD
    updateProfile,
    currentLanguage,
    language,
    setLanguage,
=======
    screen,
    setScreen,
    resetToFirstPage,
    language,
    setLanguage,
    wallet,
    fmt,
    isPremium,
    setSubscriptionModal,
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
    isOffline,
    toggleOffline,
    offlineQueueCount,
    syncNotification,
<<<<<<< HEAD
    setSyncNotification,
    screen,
    setScreen,
    goBack,
    subscriptionModal,
    setSubscriptionModal,
    resetAppToNewTrader,
  } = useApp();

  // Quick Profile Edit Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editOwner, setEditOwner] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isCustomName, setIsCustomName] = useState(false);

  const category = profile?.category || profile?.businessType || "General Trade";
  const rawName = profile?.businessName || profile?.storeName || profile?.name;
  // Never display "Set Business Name" - fallback to category default or "My Enterprise"
  const businessName =
    rawName && rawName.trim() !== "" && rawName !== "Set Business Name"
      ? rawName
      : getDefaultBusinessNameForCategory(category);

  function handleBack() {
    if (isProfileModalOpen) {
      setIsProfileModalOpen(false);
      return;
    }
    if (goBack) {
      goBack();
    } else if (screen !== "home") {
      setScreen("home");
    }
  }

  function handleOpenProfileModal() {
    const isCustom = Boolean(
      profile?.isCustomName &&
      businessName &&
      !DEFAULT_BUSINESS_NAMES.includes(businessName.trim())
    );
    setIsCustomName(isCustom);
    setEditName(isCustom ? businessName : (businessName || getDefaultBusinessNameForCategory(category)));
    setEditCategory(category);
    setEditOwner(profile?.ownerName && profile?.ownerName !== "Trader" ? profile.ownerName : "");
    setEditPhone(profile?.phone || "");
    setIsProfileModalOpen(true);
  }

  function handleSelectCategory(cat) {
    setEditCategory(cat);
    // When category changes, auto-set matching default if trader hasn't typed custom name
    if (!isCustomName || !editName.trim() || DEFAULT_BUSINESS_NAMES.includes(editName.trim())) {
      const defaultName = getDefaultBusinessNameForCategory(cat);
      setEditName(defaultName);
      setIsCustomName(false);
    }
  }

  function handleSaveProfile(e) {
    e.preventDefault();
    const trimmed = editName.trim();
    const isCustom = Boolean(trimmed && !DEFAULT_BUSINESS_NAMES.includes(trimmed));
    const finalName = isCustom ? trimmed : (trimmed || getDefaultBusinessNameForCategory(editCategory) || "My Enterprise");

    updateProfile({
      businessName: finalName,
      storeName: finalName,
      name: finalName,
      category: editCategory || "General Trade",
      businessType: editCategory || "General Trade",
      ownerName: editOwner.trim() || profile?.ownerName || "Trader",
      phone: editPhone.trim() || profile?.phone || "",
      isConfigured: true,
      isCustomName: isCustom,
    });
    setIsProfileModalOpen(false);
  }

  return (
    <header 
      className="sticky top-0 z-30 relative overflow-hidden bg-[#0072CE] text-white shadow-sm"
      style={{
        background: "radial-gradient(circle at top right, rgba(190, 242, 100, 0.25) 0%, rgba(52, 211, 153, 0.12) 35%, transparent 70%), #0072CE",
      }}
    >
      {/* Subtle Glowing Spotlight from top-right behind Online badge & language selector */}
      <div 
        className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-gradient-to-br from-lime-300/30 via-emerald-400/20 to-transparent blur-2xl pointer-events-none z-0" 
        aria-hidden="true"
      />

      {/* Main Bar */}
      <div className="relative z-10 flex items-center justify-between px-3.5 py-2.5 gap-2">
        {/* Left: Back Chevron & Business Name / Category */}
        <div className="flex items-center gap-2 flex-1 min-w-0 pr-1">
          {/* Back Chevron Button */}
          <button
            type="button"
            onClick={handleBack}
            className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label="Go back"
            title="Go back"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Dynamic Business Name & Category Badge (Clean, No Pencil Icon) */}
          <div
            onClick={handleOpenProfileModal}
            className="flex-1 min-w-0 flex flex-col items-start cursor-pointer group select-none"
            title="Click to edit business name & trade category"
          >
            <div className="flex items-center max-w-full">
              <span className="text-sm font-extrabold tracking-tight truncate text-white">
                {businessName}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-white/15 text-white/90 border border-white/20 truncate max-w-[100px]">
                {category}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSubscriptionModal(true);
                }}
                className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border transition cursor-pointer flex items-center gap-1 shrink-0 active:scale-95 ${
                  profile?.subscriptionTier === "growth_pro" || profile?.isPremium
                    ? "bg-emerald-500/25 border-emerald-300/40 text-emerald-100 hover:bg-emerald-500/35"
                    : "bg-white/15 border-white/25 text-white/90 hover:bg-white/25"
                }`}
                title="Tap to manage subscription & unlock features"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    profile?.subscriptionTier === "growth_pro" || profile?.isPremium
                      ? "bg-emerald-400"
                      : "bg-amber-300"
                  }`}
                />
                <span>
                  {profile?.subscriptionTier === "growth_pro" || profile?.isPremium
                    ? "Growth Pro (R20/mo)"
                    : "Starter Free"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Connectivity Indicator + Language Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0 relative z-20 pointer-events-auto">
          {/* Connectivity Indicator (Online / Offline) */}
=======
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#0091CD] text-white shadow-xs">
      <div className="flex items-center justify-between px-3 py-2.5">
        {/* Left: Clean SVG Back Arrow */}
        <button
          onClick={() => {
            if (screen !== "home") {
              setScreen("home");
            } else {
              resetToFirstPage();
            }
          }}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 active:scale-95 transition cursor-pointer shrink-0"
          aria-label="Back"
          title={screen !== "home" ? "Back to Dashboard" : "Back to Language Selection"}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.4}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Center: Brand Title, Trader Name, and Subtle Plan Badge */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-sm font-extrabold text-white leading-tight tracking-tight">
            Cash2Cred
          </h1>
          <div className="flex items-center gap-1.5 justify-center mt-0.5">
            <span className="text-[11px] text-white/90 font-medium truncate max-w-[100px]">
              {profile?.storeName || profile?.ownerName || "Merchant"}
            </span>
            <button
              onClick={() => setSubscriptionModal(true)}
              className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold tracking-tight transition cursor-pointer border ${
                isPremium
                  ? "bg-white/20 hover:bg-white/30 text-white border-white/40"
                  : "bg-[#152449]/40 hover:bg-[#152449]/60 text-amber-200 border-amber-300/40"
              }`}
              title="Manage Plan & Micro-Billing"
            >
              {isPremium ? "Growth Pro (R20/mo)" : "Free Plan"}
            </button>
          </div>
        </div>

        {/* Right: Offline / Data Shield Toggle + Language Picker */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Load-Shedding & Data Shield Toggle */}
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
          <button
            onClick={toggleOffline}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-extrabold border transition cursor-pointer active:scale-95 ${
              isOffline
<<<<<<< HEAD
                ? "bg-[#DC2626] border-red-300 text-white shadow-xs"
                : "bg-white/15 hover:bg-white/25 border-white/25 text-white"
            }`}
            title={isOffline ? "Click to reconnect to network" : "Simulate offline / load-shedding data shield"}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOffline ? "bg-white animate-ping" : "bg-[#0E8A4E] ring-2 ring-emerald-300/40"
=======
                ? "bg-[#DC2626] border-red-300 text-white animate-pulse"
                : "bg-white/15 hover:bg-white/25 border-white/25 text-white"
            }`}
            title={isOffline ? "Click to reconnect cellular network" : "Click to simulate load-shedding / network drop"}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOffline ? "bg-white" : "bg-emerald-300"
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
              }`}
            />
            <span>{isOffline ? `Offline (${offlineQueueCount})` : "Online"}</span>
          </button>

<<<<<<< HEAD
          {/* Language Picker (EN / ZU / ST / AF / XH / NS / VE) */}
          <select
            id="header-language-select"
            value={currentLanguage || "EN"}
            onChange={(e) => {
              setLanguage(e.target.value);
              localStorage.setItem('preferred_language', e.target.value);
            }}
            className="bg-transparent text-white font-semibold cursor-pointer outline-none text-[11px] px-2 py-1 rounded-lg border border-white/30 hover:bg-white/20 transition backdrop-blur-xs relative z-20 pointer-events-auto"
            aria-label="Select Language"
          >
            <option value="EN" className="text-slate-900 bg-white font-bold" title="English">EN</option>
            <option value="ZU" className="text-slate-900 bg-white font-bold" title="isiZulu">ZU</option>
            <option value="ST" className="text-slate-900 bg-white font-bold" title="Sesotho">ST</option>
            <option value="VE" className="text-slate-900 bg-white font-bold" title="Tshivenda">VE</option>
            <option value="NS" className="text-slate-900 bg-white font-bold" title="Sepedi">NS</option>
            <option value="XH" className="text-slate-900 bg-white font-bold" title="isiXhosa">XH</option>
            <option value="AF" className="text-slate-900 bg-white font-bold" title="Afrikaans">AF</option>
=======
          {/* Compact Semi-Transparent Language Picker Dropdown */}
          <select
            value={language || "en"}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/20 text-white rounded-lg px-1.5 py-1 text-xs font-bold border border-white/30 outline-none cursor-pointer hover:bg-white/30 transition backdrop-blur-xs"
            aria-label="Select Language"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="text-[#152449] bg-white font-medium">
                {l.code.toUpperCase()}
              </option>
            ))}
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
          </select>
        </div>
      </div>

<<<<<<< HEAD
      {/* Offline Alert Strip */}
      {isOffline && (
        <div className="bg-[#B91C1C] px-3 py-1 text-white text-[10px] font-bold flex items-center justify-between border-t border-red-400/40">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>Data Shield Active · Offline Queue ({offlineQueueCount})</span>
          </div>
          <span className="text-[9px] font-extrabold uppercase bg-black/20 px-1.5 py-0.5 rounded">
            Auto-Sync
=======
      {/* Persistent Data Shield Offline Strip */}
      {isOffline && (
        <div className="bg-[#B91C1C] px-3 py-1 text-white text-[10px] font-bold flex items-center justify-between border-t border-red-400/40">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Data Shield Active · Transactions Queued Locally</span>
          </div>
          <span className="font-extrabold bg-white/20 px-1.5 py-0.2 rounded text-[9px]">
            {offlineQueueCount} Queued
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
          </span>
        </div>
      )}

<<<<<<< HEAD
      {/* Sync Banner */}
      {syncNotification && (
        <div className="bg-[#0E8A4E] px-3 py-1 text-white text-[10px] font-bold flex items-center justify-between border-t border-emerald-400">
          <span className="truncate">{syncNotification}</span>
          <button onClick={() => setSyncNotification("")} className="ml-2 font-bold cursor-pointer">
=======
      {/* Sync Notification Banner */}
      {syncNotification && (
        <div className="bg-[#059669] px-3 py-1.5 text-white text-[10px] font-extrabold flex items-center justify-between border-t border-emerald-400 transition-all">
          <div className="flex items-center gap-1.5 truncate">
            <svg className="w-3.5 h-3.5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="truncate">{syncNotification}</span>
          </div>
          <button
            onClick={() => setSyncNotification("")}
            className="text-[10px] text-white/80 hover:text-white ml-2 font-bold cursor-pointer"
          >
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
            ✕
          </button>
        </div>
      )}
<<<<<<< HEAD

      {/* Quick Profile Edit Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-5 w-full max-w-[360px] max-h-[90%] overflow-y-auto border border-slate-200 shadow-2xl space-y-4 text-slate-900"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0072CE] block">
                    Merchant Configuration
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">
                    Business Identity & Category
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3.5 text-left">
                {/* Business Name */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Enter Trading Name (e.g. Shaz Salon, Joe's Tuckshop)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shaz Salon, Joe's Tuckshop"
                    value={editName}
                    onChange={(e) => {
                      setEditName(e.target.value);
                      setIsCustomName(true);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-[#0072CE] outline-none"
                  />
                </div>

                {/* Trade Category Selector */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Sector / Trade Category
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {TRADE_CATEGORIES.map((cat, idx) => (
                      <button
                        key={cat ? `trade-cat-${cat}` : `trade-cat-idx-${idx}`}
                        type="button"
                        onClick={() => handleSelectCategory(cat)}
                        className={`p-2 rounded-xl text-left text-xs transition border cursor-pointer font-bold ${
                          editCategory === cat
                            ? "bg-sky-50 border-[#0072CE] text-[#0072CE]"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Owner & Phone (Optional) */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      placeholder="Trader"
                      value={editOwner}
                      onChange={(e) => setEditOwner(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:border-[#0072CE] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="072 000 0000"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:border-[#0072CE] outline-none"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0072CE] hover:bg-[#0284c7] text-white text-xs font-extrabold uppercase tracking-wide transition cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    Save Profile
                  </button>
                </div>

                {/* Reset App Data Action */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Reset app data to fresh Day-1 trader state? This clears catalog, transactions, and profile registration.")) {
                        setIsProfileModalOpen(false);
                        resetAppToNewTrader();
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>↺</span>
                    <span>Reset App Data</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
=======
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
    </header>
  );
}
