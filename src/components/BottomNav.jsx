import React from "react";
import { useApp } from "../context/AppContext";

export default function BottomNav() {
<<<<<<< HEAD
  const { screen, setScreen } = useApp();

  const navItems = [
    {
      id: "home",
      label: "HOME",
      isActive: (s) => s === "home",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-transform ${active ? "scale-105" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={active ? 2.3 : 1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: "trade",
      label: "TRADE",
      isActive: (s) => s === "trade" || s === "pos",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-transform ${active ? "scale-105" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={active ? 2.3 : 1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "stock",
      label: "STOCK",
      isActive: (s) => s === "stock" || s === "inventory",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-transform ${active ? "scale-105" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={active ? 2.3 : 1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      id: "creditId",
      label: "CREDIT ID",
      isActive: (s) => s === "creditId" || s === "access",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-transform ${active ? "scale-105" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={active ? 2.3 : 1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav className="flex items-center justify-around bg-white border-t border-slate-200 shrink-0 z-20 shadow-md">
      {navItems.map((item) => {
        const active = item.isActive(screen);
=======
  const { screen, setScreen, t } = useApp();

  const navItems = [
    { id: "home", label: t("home") || "Home" },
    { id: "pos", label: t("pos") || "POS" },
    { id: "inventory", label: t("stock") || "Stock" },
    { id: "reviews", label: "Report" },
    { id: "access", label: t("creditId") || "Credit ID" },
  ];

  return (
    <nav className="flex items-stretch justify-between px-2 bg-white border-t border-[#E2E8F0]">
      {navItems.map((item) => {
        const active = screen === item.id || (item.id === "access" && screen === "creditId");
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c

        return (
          <button
            key={item.id}
<<<<<<< HEAD
            type="button"
            onClick={() => setScreen(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 transition cursor-pointer relative ${
              active
                ? "text-[#0072CE] border-t-2 border-[#0072CE] bg-sky-50/30"
                : "text-slate-400 hover:text-slate-600 border-t-2 border-transparent"
            }`}
          >
            {item.icon(active)}
            <span
              className={`text-[10px] tracking-tight uppercase block mt-1 ${
                active ? "font-extrabold text-[#0072CE]" : "font-semibold text-slate-400"
              }`}
            >
=======
            onClick={() => setScreen(item.id)}
            className={`flex-1 py-3 px-1 text-center transition cursor-pointer relative border-b-2 ${
              active
                ? "border-[#0091CD] text-[#0091CD] font-extrabold"
                : "border-transparent text-[#5B6B85] font-semibold hover:text-[#152449]"
            }`}
          >
            <span className="text-xs tracking-tight uppercase block truncate">
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
