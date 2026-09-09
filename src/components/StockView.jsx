import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Wrench } from "lucide-react";

export default function StockView() {
  const {
    catalog,
    addCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
    recordExpense,
  } = useApp();

  const items = catalog || [];

  // Add / Edit Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    itemType: "product", // "product" | "service"
    sellingPrice: "",
    costPrice: "",
    stockQty: "10",
    lowStockThreshold: "5",
  });

  // Restock Modal State
  const [restockItem, setRestockItem] = useState(null);
  const [restockUnits, setRestockUnits] = useState(5);
  const [restockSuccess, setRestockSuccess] = useState(false);

  // Open Add Modal
  function handleOpenAdd() {
    setEditingItem(null);
    setFormData({
      name: "",
      itemType: "product",
      sellingPrice: "",
      costPrice: "",
      stockQty: "10",
      lowStockThreshold: "5",
    });
    setIsFormOpen(true);
  }

  // Open Edit Modal
  function handleOpenEdit(item) {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      itemType: item.itemType || (item.trackStock ? "product" : "service"),
      sellingPrice: item.sellingPrice !== undefined ? String(item.sellingPrice) : "",
      costPrice: item.costPrice !== undefined ? String(item.costPrice) : "",
      stockQty: String(item.stockQty !== undefined ? item.stockQty : item.stock || 0),
      lowStockThreshold: String(item.lowStockThreshold || item.minStock || 5),
    });
    setIsFormOpen(true);
  }

  // Save Item (Add or Update)
  function handleSaveForm(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sellingPrice) return;

    const sellPrice = parseFloat(formData.sellingPrice) || 0;
    const costPrice = parseFloat(formData.costPrice) || 0;
    const isProduct = formData.itemType === "product";
    const stockQty = isProduct ? parseInt(formData.stockQty, 10) || 0 : 0;
    const lowStockThreshold = isProduct ? parseInt(formData.lowStockThreshold, 10) || 5 : 0;

    const payload = {
      name: formData.name.trim(),
      itemType: formData.itemType,
      sellingPrice: sellPrice,
      price: sellPrice,
      costPrice: costPrice,
      cost: costPrice,
      stockQty: stockQty,
      stock: stockQty,
      trackStock: isProduct,
      lowStockThreshold: lowStockThreshold,
      minStock: lowStockThreshold,
    };

    if (editingItem) {
      updateCatalogItem(editingItem.id, payload);
    } else {
      addCatalogItem(payload);
    }

    setIsFormOpen(false);
  }

  // Delete Item
  function handleDelete(id) {
    deleteCatalogItem(id);
    setIsFormOpen(false);
  }

  // Handle Quick Restock Submission
  function handleConfirmRestock(e) {
    e.preventDefault();
    if (!restockItem || restockUnits <= 0) return;

    const addedUnits = parseInt(restockUnits, 10) || 0;
    const currentStock = parseInt(restockItem.stockQty !== undefined ? restockItem.stockQty : restockItem.stock || 0, 10);
    const newStock = currentStock + addedUnits;
    const unitCost = parseFloat(restockItem.costPrice || restockItem.cost || 0);
    const totalOutflow = unitCost * addedUnits;

    // 1. Update Catalog stock quantity
    updateCatalogItem(restockItem.id, {
      stockQty: newStock,
      stock: newStock,
    });

    // 2. Record Restock Expense in Cash Ledger
    if (totalOutflow > 0) {
      recordExpense({
        description: `Restock: ${restockItem.name} (${addedUnits} units)`,
        amount: totalOutflow,
        category: "Supplier Stock",
        paymentMethod: "cash",
      });
    }

    setRestockSuccess(true);
    setTimeout(() => {
      setRestockSuccess(false);
      setRestockItem(null);
      setRestockUnits(5);
    }, 1200);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4 p-4 bg-white min-h-[85vh] text-left"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-extrabold text-sm text-[#152449] uppercase tracking-wide">
            Catalog & Inventory
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            {items.length} custom products and services defined
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-3.5 py-2 rounded-xl bg-[#0072CE] hover:bg-[#005fa8] text-white font-black text-xs uppercase tracking-wide flex items-center gap-1.5 shadow-sm transition active:scale-[0.98] cursor-pointer"
        >
          <span>+</span>
          <span>Add Item / Service</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. CLEAN EMPTY STATE */}
      {/* ========================================================================= */}
      {items.length === 0 ? (
        <div className="p-8 my-6 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 space-y-3.5">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-[#0072CE] mx-auto flex items-center justify-center shadow-xs">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="text-xs font-black text-[#152449] uppercase tracking-wider">
              No Items Configured
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Your catalog is empty. Add your products or services with your own selling prices and cost prices to start tracking inventory and profit.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-2 px-4 py-2.5 rounded-xl bg-[#0072CE] hover:bg-[#005fa8] text-white font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer"
          >
            + Add Item / Service
          </button>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. DYNAMIC STOCK LIST */
        /* ========================================================================= */
        <div className="space-y-2.5">
          {items.map((item, idx) => {
            const sellPrice = parseFloat(item.sellingPrice !== undefined ? item.sellingPrice : item.price || 0);
            const costPrice = parseFloat(item.costPrice !== undefined ? item.costPrice : item.cost || 0);
            const isProduct = item.itemType === "product" || item.trackStock;
            const stockUnits = parseInt(item.stockQty !== undefined ? item.stockQty : item.stock || 0, 10);
            const threshold = parseInt(item.lowStockThreshold || item.minStock || 5, 10);

            // Calculated Unit Margin
            const unitProfit = sellPrice - costPrice;
            const marginPercent = sellPrice > 0 ? Math.round((unitProfit / sellPrice) * 100) : 0;

            // Status Badge determination
            let badgeText = "Service";
            let badgeStyle = "bg-sky-50 text-[#0072CE] border-sky-200";

            if (isProduct) {
              if (stockUnits === 0) {
                badgeText = "Out of Stock";
                badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
              } else if (stockUnits <= threshold) {
                badgeText = "Low Stock";
                badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
              } else {
                badgeText = "In Stock";
                badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
              }
            }

            return (
              <div
                key={item.id || item.name || `stock-${idx}`}
                className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-[#0072CE] transition space-y-2.5"
              >
                {/* Header Row: Item Name, Status Badge, and Edit Button on a single clean baseline */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                    {isProduct ? (
                      <Package className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <Wrench className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <h4 className="font-extrabold text-xs text-[#152449] truncate leading-tight">
                      {item.name}
                    </h4>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider shrink-0 ${badgeStyle}`}>
                      {badgeText}
                    </span>
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleOpenEdit(item)} 
                    className="w-7 h-7 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
                    aria-label="Edit item"
                  >
                    <svg className="w-3.5 h-3.5 stroke-[1.75]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                </div>

                {/* Pricing & Calculated Unit Margin */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-black text-slate-900">
                    R{sellPrice.toFixed(2).replace(".", ",")}
                  </span>
                  {costPrice > 0 && (
                    <span className="font-mono text-slate-400 text-[11px]">
                      Cost: R{costPrice.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                  {sellPrice > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-mono">
                      R{unitProfit.toFixed(2).replace(".", ",")} profit / {marginPercent}% margin
                    </span>
                  )}
                </div>

                {/* Stock Units & Quick Restock Bar (for physical products) */}
                {isProduct ? (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium">Live Stock:</span>
                      <span className={`font-mono font-black ${stockUnits <= threshold ? "text-amber-700" : "text-slate-800"}`}>
                        {stockUnits} units
                      </span>
                      {stockUnits <= threshold && (
                        <span className="text-[10px] text-amber-600 font-medium">
                          (Alert ≤ {threshold})
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setRestockItem(item)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-slate-800 text-xs font-black transition cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <span>+ Restock</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Labor / Non-physical service</span>
                    <span className="font-semibold text-slate-500">Unlimited supply</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL: + ADD / EDIT ITEM OR SERVICE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-left"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl p-5 bg-white shadow-2xl border border-slate-200 space-y-4 text-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-[#152449]">
                    {editingItem ? "Edit Catalog Item" : "+ Add Item / Service"}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Configure custom prices and inventory tracking
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-[#152449] transition cursor-pointer font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-3.5">
                {/* Item Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder='e.g., "Kota Special", "Wig Install", "2L Milk", "Phone Screen"'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#152449] outline-none focus:border-[#0072CE]"
                  />
                </div>

                {/* Item Type Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                    Item Type *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, itemType: "product" })}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 ${
                        formData.itemType === "product"
                          ? "bg-sky-50 text-[#0072CE] border-[#0072CE] shadow-2xs font-black"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Package className="w-4 h-4 shrink-0" />
                      <span>Physical Product</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, itemType: "service" })}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 ${
                        formData.itemType === "service"
                          ? "bg-sky-50 text-[#0072CE] border-[#0072CE] shadow-2xs font-black"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Wrench className="w-4 h-4 shrink-0" />
                      <span>Service / Labor</span>
                    </button>
                  </div>
                </div>

                {/* Pricing: Selling Price (R) & Cost Price (R) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      Selling Price (R) *
                    </label>
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2">
                      <span className="text-xs font-bold text-slate-400 font-mono">R</span>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        required
                        placeholder="0.00"
                        value={formData.sellingPrice}
                        onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                        className="w-full p-2 text-right text-xs font-black font-mono text-[#152449] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      Cost / Supply Price (R)
                    </label>
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2">
                      <span className="text-xs font-bold text-slate-400 font-mono">R</span>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        placeholder="0.00"
                        value={formData.costPrice}
                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                        className="w-full p-2 text-right text-xs font-black font-mono text-[#152449] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Stock Controls (Only if Physical Product) */}
                {formData.itemType === "product" && (
                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                        Current Stock Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stockQty}
                        onChange={(e) => setFormData({ ...formData, stockQty: e.target.value })}
                        className="w-full p-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-[#152449] outline-none focus:border-[#0072CE]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                        Low-Stock Alert Threshold
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.lowStockThreshold}
                        onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                        className="w-full p-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-[#152449] outline-none focus:border-[#0072CE]"
                      />
                    </div>
                  </div>
                )}

                {/* Modal Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  {editingItem && (
                    <button
                      type="button"
                      onClick={() => handleDelete(editingItem.id)}
                      className="py-3 px-3.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 text-xs font-bold hover:bg-rose-100 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!formData.name.trim() || !formData.sellingPrice}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border shadow-sm ${
                      formData.name.trim() && formData.sellingPrice
                        ? "bg-[#0072CE] text-white border-[#0072CE] hover:bg-[#005fa8] active:scale-[0.99]"
                        : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    }`}
                  >
                    {editingItem ? "Save Changes" : "Save Item to Catalog →"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. MODAL: QUICK + RESTOCK & EXPENSE LOGGER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {restockItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-left"
            onClick={() => setRestockItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl p-5 bg-white shadow-2xl border border-slate-200 space-y-4 text-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-[#152449]">
                    Restock Product Units
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {restockItem.name} · Current: {restockItem.stockQty || 0} units
                  </p>
                </div>
                <button
                  onClick={() => setRestockItem(null)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-[#152449] transition cursor-pointer font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirmRestock} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                    Additional Units Received
                  </label>
                  <div className="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setRestockUnits(Math.max(1, restockUnits - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-black text-[#152449] text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-black text-base text-[#152449] font-mono">
                      +{restockUnits} units
                    </span>
                    <button
                      type="button"
                      onClick={() => setRestockUnits(restockUnits + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-black text-[#152449] text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Preset increment chips */}
                <div className="flex gap-1.5">
                  {[5, 10, 20, 50].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setRestockUnits(qty)}
                      className="flex-1 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:border-[#0072CE] hover:text-[#0072CE] text-xs font-bold transition cursor-pointer"
                    >
                      +{qty}
                    </button>
                  ))}
                </div>

                {/* Restock Cost Impact Summary */}
                <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-rose-600 block">
                      Supply Expense Incurred
                    </span>
                    <span className="text-[10px] text-slate-500">
                      R{parseFloat(restockItem.costPrice || restockItem.cost || 0).toFixed(2).replace(".", ",")} × {restockUnits} units
                    </span>
                  </div>
                  <span className="font-mono font-black text-rose-700 text-sm">
                    -R{(parseFloat(restockItem.costPrice || restockItem.cost || 0) * restockUnits).toFixed(2).replace(".", ",")}
                  </span>
                </div>

                {restockSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black text-center uppercase tracking-wider"
                  >
                    Restock & Supply Expense Logged ✓
                  </motion.div>
                )}

                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#0E8A4E] hover:bg-[#0b6e3e] text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-sm active:scale-[0.99]"
                  >
                    Confirm Restock & Log Expense →
                  </button>
                  <button
                    type="button"
                    onClick={() => setRestockItem(null)}
                    className="py-3 px-3 text-xs font-bold text-slate-500 hover:text-[#152449] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
