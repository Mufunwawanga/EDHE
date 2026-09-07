import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { LANGUAGES, INITIAL_WALLET, BUSINESS_SUGGESTION_CHIPS } from "../constants/data";
import { motion } from "framer-motion";

export function LanguageSelection() {
  const { setLanguage, t } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col justify-between p-6 bg-white"
    >
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-2">
          <span className="text-[11px] font-bold text-[#5B6B85] uppercase tracking-wider block">
            Informal Trade Ledger
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-[#152449] tracking-tight">
          Cash2Cred
        </h1>
        <p className="text-[#5B6B85] text-xs mt-1.5 font-medium leading-relaxed">
          {t("chooseLanguage")}
        </p>

        <div className="flex flex-col gap-2 mt-6 overflow-y-auto max-h-[380px] pr-1">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition bg-white border border-[#E2E8F0] hover:border-[#1D4ED8] hover:text-[#1D4ED8] hover:bg-[#F8FAFC] text-[#152449] cursor-pointer shadow-xs group"
            >
              <span>{l.label}</span>
              <span className="text-xs font-bold text-[#5B6B85] group-hover:text-[#1D4ED8] transition">
                →
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-center font-medium mt-4 text-[#5B6B85]">
        {t("multiLanguageSupport")}
      </p>
    </motion.div>
  );
}

export function BusinessRegistration() {
  const { goBackToLanguage, handleCreateAccount, fmt, t } = useApp();
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [storeInput, setStoreInput] = useState("");
  const [businessTypeInput, setBusinessTypeInput] = useState("Hair Salon");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col justify-between p-6 bg-white overflow-y-auto"
    >
      <div className="flex-1 flex flex-col justify-center">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0]">
          <button
            onClick={goBackToLanguage}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-[#0072CE] hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            ← Back to Language
          </button>
          <span className="font-extrabold text-base text-[#152449]">Cash2Cred</span>
        </div>

        <h2 className="text-2xl font-extrabold text-[#152449]">
          {t("registerBusiness")}
        </h2>
        <p className="text-[#5B6B85] text-xs mt-1 font-medium">
          {t("registerDesc")}
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-bold text-[#5B6B85] uppercase tracking-wider block">
              {t("traderName")}
            </label>
            <input
              type="text"
              placeholder="e.g. Sipho Dlamini"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-lg text-xs outline-none bg-white border border-[#E2E8F0] text-[#152449] font-medium focus:border-[#1D4ED8]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#5B6B85] uppercase tracking-wider block">
              {t("tradingName")}
            </label>
            <input
              type="text"
              placeholder="e.g. Sipho Corner Store & Salon"
              value={storeInput}
              onChange={(e) => setStoreInput(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-lg text-xs outline-none bg-white border border-[#E2E8F0] text-[#152449] font-medium focus:border-[#1D4ED8]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#5B6B85] uppercase tracking-wider block">
              Business Type / Trade
            </label>
            <input
              type="text"
              placeholder="e.g. Car Wash, Bakery, Spaza, Tailor"
              value={businessTypeInput}
              onChange={(e) => setBusinessTypeInput(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-lg text-xs outline-none bg-white border border-[#E2E8F0] text-[#152449] font-medium focus:border-[#1D4ED8]"
            />
            {/* Clickable Suggestion Chips */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {BUSINESS_SUGGESTION_CHIPS.map((chip) => {
                const isSelected = businessTypeInput.toLowerCase() === chip.toLowerCase();
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setBusinessTypeInput(chip)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border transition cursor-pointer ${
                      isSelected
                        ? "bg-[#1D4ED8] text-white border-[#1D4ED8]"
                        : "bg-white text-[#5B6B85] border-[#E2E8F0] hover:border-[#152449]"
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setBusinessTypeInput("")}
                className={`text-[10px] font-bold px-2 py-0.5 rounded border transition cursor-pointer ${
                  !BUSINESS_SUGGESTION_CHIPS.some((c) => c.toLowerCase() === businessTypeInput.toLowerCase()) &&
                  businessTypeInput !== ""
                    ? "bg-[#1D4ED8] text-white border-[#1D4ED8]"
                    : "bg-[#F8FAFC] text-[#1D4ED8] border-[#D9E6F5]"
                }`}
              >
                + Specify Other
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#5B6B85] uppercase tracking-wider block">
              {t("mobileNumber")}
            </label>
            <input
              type="text"
              placeholder="072 000 0000"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-lg text-xs outline-none bg-white border border-[#E2E8F0] text-[#152449] font-medium focus:border-[#1D4ED8]"
            />
          </div>
        </div>

        <div className="mt-3.5 rounded-lg p-3 bg-[#F8FAFC] border border-[#E2E8F0]">
          <p className="text-[#152449] text-xs leading-relaxed font-medium">
            {t("starterWallet", { amount: fmt(INITIAL_WALLET) })}
          </p>
        </div>
      </div>

      <button
        onClick={() => handleCreateAccount(nameInput, storeInput, businessTypeInput, phoneInput)}
        disabled={!nameInput.trim()}
        className={`w-full mt-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wide transition border shadow-sm ${
          nameInput.trim()
            ? "bg-[#0072CE] text-white border-[#0072CE] hover:bg-[#0284c7] cursor-pointer active:scale-[0.99]"
            : "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
        }`}
      >
        {t("createAccount")} →
      </button>
    </motion.div>
  );
}

export function LockScreen() {
  const { profile, wallet, fmt, setIsLoggedIn, resetToFirstPage, t } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col justify-between p-6 bg-white"
    >
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between w-full mb-6 pb-2 border-b border-slate-200">
          <button
            onClick={resetToFirstPage}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-[#0072CE] hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            ← Language Screen
          </button>
          <span className="font-extrabold text-sm text-[#152449]">Cash2Cred</span>
        </div>

        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 bg-[#003B5C] border border-[#1E3A8A] text-white text-2xl font-black shadow-md">
          {profile?.ownerName?.charAt(0) || "C"}
        </div>
        <h2 className="text-xl font-black text-slate-900">
          {t("welcomeBack", { name: profile?.ownerName?.split(" ")[0] || "Trader" })}
        </h2>
        <p className="text-slate-500 text-xs mt-1 font-semibold">
          {profile?.storeName} · {profile?.businessType}
        </p>

        <div className="mt-4 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800">
          {t("walletBalance")} <span className="text-[#0072CE] font-mono font-black">{fmt(wallet)}</span>
        </div>

        <div className="mt-5 w-full rounded-2xl p-3.5 text-left bg-white border border-slate-200 shadow-2xs">
          <p className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {t("offlineSync")}
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Signing in verifies your local Room DB ledger for free.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <button
          onClick={() => setIsLoggedIn(true)}
          className="w-full py-3.5 rounded-xl text-xs font-bold text-white uppercase tracking-wide border border-[#0072CE] bg-[#0072CE] hover:bg-[#0284c7] transition cursor-pointer shadow-sm active:scale-[0.99]"
        >
          {t("signIn")} →
        </button>

        <button
          onClick={resetToFirstPage}
          className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 bg-white border border-slate-200 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
        >
          Switch Language / Start Screen
        </button>
      </div>
    </motion.div>
  );
}
