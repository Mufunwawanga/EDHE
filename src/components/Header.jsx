import React from "react";
import { useApp } from "../context/AppContext";
import { LANGUAGES } from "../constants/data";

export default function Header() {
  const {
    profile,
    screen,
    setScreen,
    resetToFirstPage,
    language,
    setLanguage,
    wallet,
    fmt,
    isPremium,
    setSubscriptionModal,
    isOffline,
    toggleOffline,
    offlineQueueCount,
    syncNotification,
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
          <button
            onClick={toggleOffline}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-extrabold border transition cursor-pointer active:scale-95 ${
              isOffline
                ? "bg-[#DC2626] border-red-300 text-white animate-pulse"
                : "bg-white/15 hover:bg-white/25 border-white/25 text-white"
            }`}
            title={isOffline ? "Click to reconnect cellular network" : "Click to simulate load-shedding / network drop"}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOffline ? "bg-white" : "bg-emerald-300"
              }`}
            />
            <span>{isOffline ? `Offline (${offlineQueueCount})` : "Online"}</span>
          </button>

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
          </select>
        </div>
      </div>

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
          </span>
        </div>
      )}

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
            ✕
          </button>
        </div>
      )}
    </header>
  );
}
