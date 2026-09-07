import React from "react";
import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";

const SPAZA_DEFAULTS = [
  { id: "spz-1", name: "Iwisa Maize Meal 10kg", price: 115.0, stock: 18, minStock: 10 },
  { id: "spz-2", name: "Sunfoil Cooking Oil 2L", price: 75.0, stock: 8, minStock: 10 },
  { id: "spz-3", name: "Albany Superior White Bread", price: 18.5, stock: 24, minStock: 10 },
  { id: "spz-4", name: "Coca-Cola 1.25L", price: 22.0, stock: 12, minStock: 10 },
];

export default function Inventory() {
  const { fmt, products, setRestockModal, setRestockQty } = useApp();

  // Combine or prioritize Spaza growth items
  const displayItems = products && products.length > 0 && products.some(p => p.name.includes("Maize") || p.name.includes("Sunfoil"))
    ? products
    : SPAZA_DEFAULTS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4 p-4 bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
            Inventory & Stock
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            {displayItems.length} Growth-stage Spaza items tracked
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0072CE] border border-sky-200">
          Auto-Reorder Ready
        </span>
      </div>

      {/* Item Cards */}
      <div className="space-y-2.5">
        {displayItems.map((p) => {
          const currentStock = p.stock !== undefined ? p.stock : 10;
          const minStock = p.minStock !== undefined ? p.minStock : 10;
          const isLow = currentStock <= minStock;

          return (
            <div
              key={p.id}
              className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between shadow-sm hover:border-slate-300 transition"
            >
              <div className="pr-2">
                <p className="font-bold text-xs text-slate-900 leading-snug">{p.name}</p>
                <span className="text-xs font-mono font-bold text-[#0072CE] block mt-0.5">
                  {fmt(p.price || 50)}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="font-mono font-bold text-sm block text-slate-900">
                    {currentStock} units
                  </span>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${
                      isLow
                        ? "border-amber-200 text-amber-700 bg-amber-50"
                        : "border-emerald-200 text-emerald-700 bg-emerald-50"
                    }`}
                  >
                    {isLow ? "Low Stock" : "In Stock"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRestockModal(p);
                    setRestockQty(5);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[#0072CE] text-[#0072CE] bg-white hover:bg-sky-50 transition cursor-pointer shadow-2xs active:scale-[0.98]"
                >
                  + Stock
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
