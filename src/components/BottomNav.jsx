import React from "react";
import { useApp } from "../context/AppContext";

export default function BottomNav() {
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

        return (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={`flex-1 py-3 px-1 text-center transition cursor-pointer relative border-b-2 ${
              active
                ? "border-[#0091CD] text-[#0091CD] font-extrabold"
                : "border-transparent text-[#5B6B85] font-semibold hover:text-[#152449]"
            }`}
          >
            <span className="text-xs tracking-tight uppercase block truncate">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
