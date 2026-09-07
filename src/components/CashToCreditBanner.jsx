import React from "react";
import { useApp } from "../context/AppContext";

/**
 * CashToCreditBanner Component
 * 
 * Capitec-inspired minimalist "Explore products and benefits" link card.
 * Clean, lightweight, high-trust action bar for Financial Identity & Readiness.
 */
export default function CashToCreditBanner({ onNavigateToCreditId }) {
  const { setScreen } = useApp();

  const handleAction = () => {
    if (onNavigateToCreditId) {
      onNavigateToCreditId();
    } else {
      setScreen("creditId");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAction();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleAction}
      onKeyDown={handleKeyDown}
      className="w-full bg-white rounded-2xl p-3.5 border border-[#E5EEF5] shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-50 transition active:scale-[0.99] select-none text-left"
    >
      {/* Left Section: Icon + Text Column */}
      <div className="flex items-center gap-3">
        {/* Outline circle plus icon in Capitec Cerulean Blue (#0091CD) */}
        <div className="w-8 h-8 rounded-full border border-[#0091CD] flex items-center justify-center text-[#0091CD] shrink-0">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>

        {/* Text Column */}
        <div>
          <h4 className="font-bold text-[13px] text-slate-900 leading-snug">
            Financial Identity and Readiness
          </h4>
          <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
            View Credit ID and Pre-approval Partners
          </p>
        </div>
      </div>

      {/* Right Section: Clean right chevron arrow */}
      <div className="shrink-0 pl-2">
        <svg
          className="w-4 h-4 text-[#0091CD]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
