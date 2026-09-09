import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";

export default function SlipReceiptModal() {
  const {
    slipReceiptModal,
    setSlipReceiptModal,
    profile,
    transactions,
    metrics,
  } = useApp();

  const receiptRef = useRef(null);

  if (!slipReceiptModal) return null;

  const category = profile?.category || profile?.businessType || "General Trade";
  const businessName = profile?.businessName || "My Enterprise";
  const ownerName = profile?.ownerName || "Trader";
  const phone = profile?.phone || "082 000 0000";
  const passportCode = profile?.passportCode || "C2C-ZA-DEMO";
  const now = new Date();
  const dateFormatted = now.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  const timeFormatted = now.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const salesCount = transactions.filter((t) => t.type === "sale").length;
  const totalIn = metrics?.todayMoneyIn ?? 0;
  const totalOut = metrics?.todayMoneyOut ?? 0;
  const netRetained = metrics?.todayNetRetained ?? totalIn - totalOut;
  const marginPct = metrics?.todayMargin ?? 0;
  const growthScore = metrics?.growthReadinessScore ?? metrics?.growthScore ?? 50;

  function handlePrintReceipt() {
    window.print();
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      {/* Print Styles for 80mm Thermal Receipt */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-thermal-receipt, #printable-thermal-receipt * {
            visibility: visible;
          }
          #printable-thermal-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm !important;
            margin: 0 !important;
            padding: 8mm !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl flex flex-col items-center text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between pb-2 text-white no-print">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">🧾</span>
            <span className="text-xs font-black uppercase tracking-wider">
              Thermal Till-Slip Statement (80mm)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSlipReceiptModal(false)}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-xs transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="w-full overflow-y-auto pr-1 flex justify-center">
          {/* Authentic Paper Thermal Receipt */}
          <div
            id="printable-thermal-receipt"
            ref={receiptRef}
            className="w-full max-w-[320px] bg-[#FAFAF8] text-slate-900 font-mono text-[11px] shadow-2xl relative overflow-hidden border-x border-slate-300"
          >
            {/* Top Zigzag Sawtooth Edge */}
            <div className="w-full overflow-hidden leading-none h-2.5 bg-slate-800">
              <svg className="w-full h-2.5 fill-[#FAFAF8]" preserveAspectRatio="none" viewBox="0 0 320 10">
                <polygon points="0,10 5,0 10,10 15,0 20,10 25,0 30,10 35,0 40,10 45,0 50,10 55,0 60,10 65,0 70,10 75,0 80,10 85,0 90,10 95,0 100,10 105,0 110,10 115,0 120,10 125,0 130,10 135,0 140,10 145,0 150,10 155,0 160,10 165,0 170,10 175,0 180,10 185,0 190,10 195,0 200,10 205,0 210,10 215,0 220,10 225,0 230,10 235,0 240,10 245,0 250,10 255,0 260,10 265,0 270,10 275,0 280,10 285,0 290,10 295,0 300,10 305,0 310,10 315,0 320,10" />
              </svg>
            </div>

            {/* Receipt Content */}
            <div className="p-4 space-y-3">
              {/* Center Store Title */}
              <div className="text-center space-y-0.5">
                <p className="font-bold text-[10px] tracking-widest text-slate-500">
                  ================================
                </p>
                <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">
                  {businessName}
                </h2>
                <p className="text-[10px] font-bold text-slate-600 uppercase">
                  {category} · MICRO-MERCHANT
                </p>
                <p className="text-[10px] text-slate-500">
                  PROP: {ownerName.toUpperCase()} · {phone}
                </p>
                <p className="text-[9px] text-slate-400 font-bold">
                  REG: INFORMAL SECTOR (C2C VERIFIED)
                </p>
                <p className="font-bold text-[10px] tracking-widest text-slate-500">
                  ================================
                </p>
              </div>

              {/* Receipt Metadata */}
              <div className="text-[10px] space-y-0.5 border-b border-dashed border-slate-300 pb-2">
                <div className="flex justify-between">
                  <span>DATE: {dateFormatted}</span>
                  <span>TIME: {timeFormatted}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>PASSPORT HASH:</span>
                  <span className="text-[#0072CE]">{passportCode}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>TERMINAL:</span>
                  <span>ANDROID-POS-80MM</span>
                </div>
              </div>

              {/* Itemized Financial Summary */}
              <div className="space-y-1.5 py-1">
                <p className="font-bold text-[10px] tracking-wider text-slate-600 uppercase border-b border-slate-300 pb-0.5">
                  AUDITED TRADING STATEMENT
                </p>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>TOTAL SALES COUNT</span>
                    <span className="font-bold">{salesCount} TRADES</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GROSS CASH INFLOW</span>
                    <span className="font-bold text-slate-900 font-mono">
                      +R{totalIn.toFixed(2).replace(".", ",")}
                    </span>
                  </div>

                  <div className="flex justify-between text-rose-700">
                    <span>TOTAL OPERATING EXPENSES</span>
                    <span className="font-bold font-mono">
                      -R{totalOut.toFixed(2).replace(".", ",")}
                    </span>
                  </div>

                  <div className="border-t-2 border-slate-900 pt-1.5 flex justify-between text-sm font-black">
                    <span>NET PROFIT RETAINED</span>
                    <span className="font-mono">
                      {netRetained >= 0 ? "+" : "-"}R{Math.abs(netRetained).toFixed(2).replace(".", ",")}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] font-bold text-emerald-700">
                    <span>OPERATING MARGIN</span>
                    <span>{marginPct}%</span>
                  </div>
                </div>
              </div>

              {/* Underwriting Readiness Box */}
              <div className="border-t border-dashed border-slate-300 pt-2 text-[10px] space-y-1">
                <div className="flex justify-between font-bold">
                  <span>GROWTH READINESS SCORE</span>
                  <span className="text-[#0072CE] font-mono text-xs font-black">
                    {growthScore}/100
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>POPIA CONSENT STATUS</span>
                  <span className="font-bold text-emerald-700">VERIFIED ACTIVE</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>UNDERWRITING STATUS</span>
                  <span className="font-bold uppercase">
                    {growthScore >= 75 ? "BANKABLE" : growthScore >= 60 ? "EMERGING" : "BUILDING"}
                  </span>
                </div>
              </div>

              {/* Red Official Audit Rubber Stamp */}
              <div className="py-2 flex justify-center">
                <div className="border-2 border-dashed border-red-700 text-red-700 font-black px-3 py-1.5 text-center text-[10px] uppercase tracking-widest rotate-[-1.5deg] shadow-2xs rounded-xs">
                  ★ OFFICIALLY AUDITED RECORD ★<br />
                  <span className="text-[9px] font-bold text-red-600">
                    CASH2CRED PROTOCOL · POPIA COMPLIANT
                  </span>
                </div>
              </div>

              {/* Barcode Mock */}
              <div className="text-center pt-1 border-t border-slate-200">
                <div className="flex justify-center items-center h-8 gap-[2px] py-1">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 2, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1].map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-black h-full"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <p className="text-[9px] font-bold tracking-widest text-slate-700 mt-0.5">
                  *{passportCode}*
                </p>
                <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold">
                  POWERING TOWNSHIP TRADE & CAPITAL ACCESS
                </p>
              </div>
            </div>

            {/* Bottom Zigzag Sawtooth Edge */}
            <div className="w-full overflow-hidden leading-none h-2.5 bg-slate-800 rotate-180">
              <svg className="w-full h-2.5 fill-[#FAFAF8]" preserveAspectRatio="none" viewBox="0 0 320 10">
                <polygon points="0,10 5,0 10,10 15,0 20,10 25,0 30,10 35,0 40,10 45,0 50,10 55,0 60,10 65,0 70,10 75,0 80,10 85,0 90,10 95,0 100,10 105,0 110,10 115,0 120,10 125,0 130,10 135,0 140,10 145,0 150,10 155,0 160,10 165,0 170,10 175,0 180,10 185,0 190,10 195,0 200,10 205,0 210,10 215,0 220,10 225,0 230,10 235,0 240,10 245,0 250,10 255,0 260,10 265,0 270,10 275,0 280,10 285,0 290,10 295,0 300,10 305,0 310,10 315,0 320,10" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Actions (No Print) */}
        <div className="w-full pt-3 flex gap-2 no-print">
          <button
            type="button"
            onClick={handlePrintReceipt}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>🖨️</span>
            <span>Print Thermal Slip</span>
          </button>
          <button
            type="button"
            onClick={() => setSlipReceiptModal(false)}
            className="py-2.5 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
