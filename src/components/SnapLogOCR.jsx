import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import Tesseract from "tesseract.js";

const EXPENSE_KEYWORDS = [
  "stock",
  "wholesale",
  "bought",
  "transport",
  "taxi",
  "fare",
  "fuel",
  "petrol",
  "diesel",
  "gas",
  "paraffin",
  "electricity",
  "power",
  "eskom",
  "lunch",
  "food",
  "rent",
  "paid",
  "supplier",
  "airtime",
  "data",
  "expense",
  "repairs",
  "maintenance",
  "cleaning",
  "delivery",
  "bread delivery",
  "stock delivery",
  "outflow",
  "cost",
  "purchase",
];

/**
 * Image Preprocessing for Clean Handwritten / Low-Contrast Counter-Book OCR:
 * Converts image to grayscale and applies adaptive contrast thresholding.
 */
export async function preprocessImageForOcr(imageSource) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const maxDim = 1600;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        const len = data.length;

        let sum = 0;
        const grayValues = new Uint8Array(len / 4);
        for (let i = 0, j = 0; i < len; i += 4, j++) {
          const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
          grayValues[j] = gray;
          sum += gray;
        }

        const avg = sum / (len / 4);
        const threshold = Math.max(90, Math.min(170, avg * 0.95));

        for (let i = 0, j = 0; i < len; i += 4, j++) {
          const val = grayValues[j] > threshold ? 255 : 0;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (err) {
        console.warn("Preprocessing canvas error, using raw image:", err);
        resolve(imageSource);
      }
    };
    img.onerror = () => resolve(imageSource);
    img.src = imageSource;
  });
}

/**
 * Enhanced Line-Item Parser:
 * Resiliently scans real-world handwritten counter-book and till formats:
 * - Shorthand line item with quantity & price: "3x Bread @ 18.00" -> Title: "3x Bread", Amount: 54.00, Type: 'sale'
 * - Hyphenated shorthand: "Paraffin - R45" -> Title: "Paraffin", Amount: 45.00, Type: 'expense'
 * - Simple service / item: "Braids 300" -> Title: "Braids", Amount: 300.00, Type: 'sale'
 * - Outflows: "Bread delivery 120", "Stock wholesale 350", "Rent 500" -> Type: 'expense'
 */
export function parseOcrLineItems(ocrText) {
  if (!ocrText || typeof ocrText !== "string") return [];

  const lines = ocrText.split(/\r?\n/);
  const items = [];

  for (let i = 0; i < lines.length; i++) {
    let rawLine = lines[i].trim();
    if (!rawLine || rawLine.length < 2) continue;

    // Filter out common receipt header words
    if (/^(date|total|subtotal|balance|page|slip|receipt|cash2cred|teller|thank\s*you|tax\s*invoice|vat|cashier)/i.test(rawLine)) {
      continue;
    }

    // Strip common OCR edge artifacts and noisy punctuation
    rawLine = rawLine
      .replace(/^[|~_[\]{}*^;:"'«»`\\/+=]+/g, "")
      .replace(/[|~_[\]{}*^;:"'«»`\\/+=]+$/g, "")
      .trim();

    if (!rawLine || rawLine.length < 2) continue;

    let name = "";
    let amount = 0;
    let qty = 1;

    // Pattern A: Unit price with @ notation: e.g., '3x Bread @ 18.00' or '2 Bread @ 15'
    const atMatch = rawLine.match(/^(\d+)\s*[xX]?\s+(.+?)\s*@\s*(?:\bR\s*|\bZAR\s*|\$)?(\d+(?:[.,]\d{1,2})?)/i);
    // Pattern B: Hyphenated format: e.g., 'Paraffin - R45' or 'Paraffin - 45'
    const dashMatch = rawLine.match(/^(.+?)\s*[-–—]\s*(?:\bR\s*|\bZAR\s*|\$)?(\d+(?:[.,]\d{1,2})?)\s*$/i);
    // Pattern C: Trailing number: e.g., 'Braids 300', 'Bread 18', '2x Coldrink 40', 'Bread delivery 120'
    const endNumberMatch = rawLine.match(/(?:\bR\s*|\bZAR\s*|\$)?(\d+(?:[.,]\d{1,2})?)\s*(?:\brand\b|\brands\b)?\s*$/i);
    // Pattern D: Leading number: e.g., 'R50 Paraffin', '18 Bread'
    const startNumberMatch = rawLine.match(/^(?:\bR\s*|\bZAR\s*|\$)?(\d+(?:[.,]\d{1,2})?)\s+(.+)$/i);

    if (atMatch) {
      qty = parseInt(atMatch[1], 10) || 1;
      const itemName = atMatch[2].trim();
      const unitPrice = parseFloat(atMatch[3].replace(",", ".")) || 0;
      amount = Math.round(qty * unitPrice * 100) / 100;
      name = (qty > 1 ? qty + "x " : "") + itemName;
    } else if (dashMatch) {
      name = dashMatch[1].trim();
      amount = parseFloat(dashMatch[2].replace(",", ".")) || 0;
    } else if (endNumberMatch) {
      amount = parseFloat(endNumberMatch[1].replace(",", ".")) || 0;
      name = rawLine.substring(0, endNumberMatch.index).trim();
    } else if (startNumberMatch) {
      amount = parseFloat(startNumberMatch[1].replace(",", ".")) || 0;
      name = startNumberMatch[2].trim();
    } else {
      // Pattern E: Fallback search for any number with currency tag or isolated digits
      const anyNum = rawLine.match(/(?:\bR\s*)?(\d+(?:[.,]\d{1,2})?)/);
      if (anyNum) {
        amount = parseFloat(anyNum[1].replace(",", ".")) || 0;
        name = rawLine.replace(anyNum[0], "").trim();
      }
    }

    // Detect quantity notation like "2x" or "2 x" in name if not already extracted
    const qtyMatch = name.match(/\b(\d+)\s*[xX]\b/);
    if (qtyMatch && qty === 1) {
      qty = parseInt(qtyMatch[1], 10) || 1;
    }

    // Clean up item name by stripping OCR artifacts, symbols, and stray noise
    name = name
      .replace(/[=\-–—:@#*|~_+^\\/[\]{}]+/g, " ")
      .replace(/\b(rand|rands|zar)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    // Must have a valid positive amount and a recognizable item name
    if (amount <= 0 || !name || name.length < 2) continue;

    const lowerName = name.toLowerCase();

    // Format normalization: "Stock wholesale" / "Wholesale stock" -> "Wholesale Stock"
    let formattedName = name;
    if (lowerName.includes("stock wholesale") || lowerName.includes("wholesale stock")) {
      formattedName = "Wholesale Stock";
    } else {
      if (qty > 1 && !formattedName.toLowerCase().startsWith(`${qty}x`)) {
        if (rawLine.toLowerCase().includes(`${qty}x`)) {
          formattedName = `${qty}x ` + formattedName.replace(new RegExp(`^${qty}\\s*x\\s*`, "i"), "");
        }
      }
      formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
    }

    // Determine default transaction type based on outflow keywords or minus signs
    const isExpense =
      rawLine.startsWith("-") ||
      rawLine.includes(" - ") ||
      EXPENSE_KEYWORDS.some((kw) => lowerName.includes(kw));

    items.push({
      id: "ocr-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6) + "-" + i,
      name: formattedName.trim(),
      amount,
      qty,
      type: isExpense ? "expense" : "sale",
      checked: true, // Default to checked for commit
    });
  }

  return items;
}

// Sample notebook text presets
const SAMPLE_RECEIPTS = [
  {
    title: "Township Counter-Book",
    preview: "3x Bread @ 18.00\nParaffin - R45\nBraids 300\nBread delivery 120",
    text: "3x Bread @ 18.00\nParaffin - R45\nBraids 300\nBread delivery 120",
  },
  {
    title: "Salon Cash Log",
    preview: "Braids 300\nHair wash 60\nShampoo stock 45\nRent 500",
    text: "Braids 300\nHair wash 60\nShampoo stock 45\nRent 500",
  },
];

/**
 * Creates a synthetic paper canvas receipt image for demonstration.
 */
function createSyntheticReceiptImage(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");

  // Paper background with subtle texture
  ctx.fillStyle = "#FBFBF9";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Notebook line grid
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 1;
  for (let y = 40; y < canvas.height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(380, y);
    ctx.stroke();
  }

  // Margin line
  ctx.strokeStyle = "#FCA5A5";
  ctx.beginPath();
  ctx.moveTo(60, 0);
  ctx.lineTo(60, canvas.height);
  ctx.stroke();

  // Handwritten text
  ctx.fillStyle = "#1E293B";
  ctx.font = "bold 16px monospace";
  const lines = text.split("\n");
  lines.forEach((line, idx) => {
    ctx.fillText(line, 75, 60 + idx * 32);
  });

  return canvas.toDataURL("image/png");
}

export default function SnapLogOCR() {
  const {
    snapLogModal,
    setSnapLogModal,
    recordSale,
    recordExpense,
    recordTransactionBatch,
    setSyncNotification,
    profile,
    isPremium,
    upgradeSubscription,
    todayOcrScansCount,
    incrementOcrScansCount,
    setSubscriptionModal,
    db,
  } = useApp();

  const isPro = profile?.subscriptionTier === "growth_pro" || isPremium;
  const isLimitReached = !isPro && todayOcrScansCount >= 1;
  const [upgradeToast, setUpgradeToast] = useState("");

  function handleInstantUpgrade() {
    upgradeSubscription("growth_pro");
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
    if (setSubscriptionModal) {
      setSubscriptionModal(true);
    }
    setUpgradeToast("🎉 Growth Pro Activated! Unlimited scanning unlocked (-R20,00 recorded).");
    setErrorMessage("");
    setTimeout(() => setUpgradeToast(""), 3500);
  }

  // Workflow Step: "capture" | "viewfinder" | "scanning" | "review"
  const [step, setStep] = useState("capture");
  const [previewImage, setPreviewImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("Initializing OCR Engine...");
  const [extractedRows, setExtractedRows] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Live Viewfinder Camera Stream
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [viewfinderLoading, setViewfinderLoading] = useState(false);
  const [viewfinderError, setViewfinderError] = useState("");

  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  function stopLiveViewfinder() {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  // Cleanup camera stream when unmounting or leaving viewfinder
  useEffect(() => {
    return () => {
      stopLiveViewfinder();
    };
  }, []);

  // 1. Launch In-App Live Camera Viewfinder
  async function handleStartLiveViewfinder() {
    if (isLimitReached) {
      setErrorMessage(
        "Free Daily Scan Limit Reached (1/1). Upgrade to Growth Pro (R20/mo) for unlimited counter-book batch scanning."
      );
      return;
    }
    setErrorMessage("");
    setViewfinderError("");
    setStep("viewfinder");
    setViewfinderLoading(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Live mediaDevices camera is not supported in this browser. Please use 'Snap Camera' or 'Upload Image'.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setViewfinderLoading(false);
    } catch (err) {
      console.warn("Live Viewfinder camera initialization error:", err);
      setViewfinderError(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Camera permission was denied. You can enable camera in site permissions or use 'Snap Camera' below."
          : "Could not start live camera feed. Please use 'Snap Camera' or 'Upload Image' below."
      );
      setViewfinderLoading(false);
    }
  }

  // 2. Capture Frame from In-App Live Viewfinder
  function handleCaptureFromViewfinder() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    if (incrementOcrScansCount) {
      incrementOcrScansCount();
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    stopLiveViewfinder();
    setPreviewImage(dataUrl);
    runTesseractOcr(dataUrl);
  }

  // Handle selected/captured file from native input
  function handleFileChange(e) {
    if (isLimitReached) {
      setErrorMessage(
        "Free Daily Scan Limit Reached (1/1). Upgrade to Growth Pro (R20/mo) for unlimited counter-book batch scanning."
      );
      return;
    }
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (incrementOcrScansCount) {
      incrementOcrScansCount();
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result;
      setPreviewImage(dataUrl);
      runTesseractOcr(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  // Run Tesseract OCR pipeline with image preprocessing and progress updates
  async function runTesseractOcr(imageSource, fallbackText = null) {
    setStep("scanning");
    setProgress(5);
    setProgressStatus("Preprocessing image (grayscale + thresholding)...");
    setErrorMessage("");

    try {
      // Step 1: Pre-process image with grayscale & contrast thresholding
      const preprocessedImage = await preprocessImageForOcr(imageSource);
      setProgress(15);
      setProgressStatus("Initializing Tesseract OCR Engine...");

      const result = await Tesseract.recognize(preprocessedImage, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            const pct = Math.round(m.progress * 100);
            setProgress(Math.max(20, Math.min(95, pct)));
            setProgressStatus(`Scanning notebook entries (${pct}%)...`);
          } else if (m.status === "loading tesseract core") {
            setProgress(15);
            setProgressStatus("Loading OCR Core...");
          }
        },
      });

      const extractedText = result?.data?.text || fallbackText || "";
      setProgress(100);
      setProgressStatus("Parsing structured line items...");

      const parsedItems = parseOcrLineItems(extractedText);

      // If OCR yielded items, use them; if not and fallback exists, use fallback
      if (parsedItems.length > 0) {
        setExtractedRows(parsedItems);
      } else if (fallbackText) {
        const fallbackItems = parseOcrLineItems(fallbackText);
        setExtractedRows(fallbackItems);
      } else {
        // Starter line if image text was unclear
        setExtractedRows([
          { id: "row-1", name: "Counter Item", amount: 20, qty: 1, type: "sale", checked: true },
        ]);
      }

      setTimeout(() => {
        setStep("review");
      }, 500);
    } catch (err) {
      console.warn("OCR Recognition Failed, using fallback parser:", err);
      if (fallbackText) {
        setExtractedRows(parseOcrLineItems(fallbackText));
        setStep("review");
      } else {
        setErrorMessage("Could not read text clearly. Please try again or tap a sample notebook.");
        setStep("capture");
      }
    }
  }

  // Handle sample receipt button click
  function handleSelectSample(sample) {
    if (isLimitReached) {
      setErrorMessage(
        "Free Daily Scan Limit Reached (1/1). Upgrade to Growth Pro (R20/mo) for unlimited counter-book batch scanning."
      );
      return;
    }
    if (incrementOcrScansCount) {
      incrementOcrScansCount();
    }
    const dataUrl = createSyntheticReceiptImage(sample.text);
    setPreviewImage(dataUrl);
    runTesseractOcr(dataUrl, sample.text);
  }

  // Review Table Handlers
  function handleUpdateRow(index, field, value) {
    setExtractedRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function handleToggleRowType(index) {
    setExtractedRows((prev) => {
      const updated = [...prev];
      const current = updated[index].type;
      updated[index] = { ...updated[index], type: current === "sale" ? "expense" : "sale" };
      return updated;
    });
  }

  function handleRemoveRow(index) {
    setExtractedRows((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddEmptyRow() {
    setExtractedRows((prev) => [
      ...prev,
      {
        id: "new-" + Date.now(),
        name: "New Entry",
        amount: 15,
        qty: 1,
        type: "sale",
        checked: true,
      },
    ]);
  }

  // 1-Tap Batch Commit: Writes all scanned entries into the ledger and closes modal
  function handleCommitAllScanned() {
    const validRows = extractedRows.filter((r) => {
      const amt = parseFloat(r.amount) || 0;
      return amt > 0 && r.name && r.name.trim().length > 0;
    });

    if (validRows.length === 0) return;

    if (recordTransactionBatch) {
      recordTransactionBatch(validRows);
    } else if (db?.logTransactionBatch) {
      db.logTransactionBatch(validRows);
    }

    if (setSyncNotification) {
      setSyncNotification(`Successfully logged ${validRows.length} historical entries`);
      setTimeout(() => setSyncNotification(""), 3500);
    }

    setSnapLogModal(false);
    setStep("capture");
    setPreviewImage(null);
    setExtractedRows([]);
  }

  function handleCloseModal() {
    stopLiveViewfinder();
    setSnapLogModal(false);
    setStep("capture");
    setPreviewImage(null);
    setErrorMessage("");
  }

  // Summary computations for review step
  const totalSales = extractedRows
    .filter((r) => r.type === "sale")
    .reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

  const totalExpenses = extractedRows
    .filter((r) => r.type === "expense")
    .reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

  const netImpact = totalSales - totalExpenses;

  if (!snapLogModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-left"
        onClick={handleCloseModal}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl p-4 sm:p-5 bg-white shadow-2xl border border-slate-200 space-y-4 text-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Real Native Mobile Camera Ingestion Input with capture="environment" */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          {/* 2. Gallery / File Upload Input without forced camera capture */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0072CE]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-[#152449]">Snap-Log OCR</h3>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                      isPro
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : todayOcrScansCount >= 1
                        ? "bg-amber-50 text-amber-800 border-amber-300"
                        : "bg-sky-50 text-[#0072CE] border-sky-200"
                    }`}
                  >
                    {isPro ? "Growth Pro: Unlimited" : `Daily Free Scans: ${todayOcrScansCount}/1`}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Scan paper receipts & handwritten counter notebooks
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-[#152449] transition cursor-pointer font-bold text-xs"
            >
              ✕
            </button>
          </div>

          {/* Upgrade Toast Notification */}
          <AnimatePresence>
            {upgradeToast && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center shadow-xs"
              >
                {upgradeToast}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========================================================================= */}
          {/* STEP 1: CAPTURE & IMAGE SELECTION */}
          {/* ========================================================================= */}
          {step === "capture" && (
            <div className="space-y-4">
              {/* Paywall Gate Banner when daily limit reached */}
              {isLimitReached && (
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-left space-y-2 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      🔒
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-amber-950">
                        Free Daily Scan Limit Reached (1/1)
                      </h4>
                      <p className="text-[11px] text-amber-800 font-medium mt-0.5 leading-snug">
                        Free tier includes 1 scan per day. Upgrade to Growth Pro (R20/mo) for unlimited counter-book batch scanning.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleInstantUpgrade}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0072CE] hover:bg-[#0284c7] text-white text-xs font-black tracking-wide shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>⚡</span>
                    <span>Upgrade to Growth Pro (R20/mo)</span>
                  </button>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#0072CE] mx-auto flex items-center justify-center shadow-2xs">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#152449]">
                    Photograph Your Daily Sales Book
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Tesseract.js extracts item names, cash amounts, and expenses automatically
                  </p>
                </div>

                {/* Primary Action Buttons: Viewfinder, Native Camera & Gallery */}
                <div className="space-y-2 pt-1">
                  {/* Option 1: Live Stream Viewfinder */}
                  <button
                    type="button"
                    onClick={handleStartLiveViewfinder}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#0072CE] hover:bg-[#005fa8] text-white text-xs font-black shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>🎥</span>
                    <span>Scan with Live Viewfinder</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Option 2: Native Rear Camera */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isLimitReached) {
                          setErrorMessage(
                            "Free Daily Scan Limit Reached (1/1). Upgrade to Growth Pro (R20/mo) for unlimited counter-book batch scanning."
                          );
                          return;
                        }
                        cameraInputRef.current?.click();
                      }}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#152449] text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                      title="Direct capture using mobile rear camera"
                    >
                      <span>📷 Snap Camera</span>
                    </button>

                    {/* Option 3: Gallery / File Upload */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isLimitReached) {
                          setErrorMessage(
                            "Free Daily Scan Limit Reached (1/1). Upgrade to Growth Pro (R20/mo) for unlimited counter-book batch scanning."
                          );
                          return;
                        }
                        fileInputRef.current?.click();
                      }}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>📁 Upload Image</span>
                    </button>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <p className="text-[11px] text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {errorMessage}
                </p>
              )}

              {/* Sample Counter-Books */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Sample Counter-Books:
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {SAMPLE_RECEIPTS.map((sample) => (
                    <button
                      key={sample.title}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50/70 hover:border-[#0072CE] transition cursor-pointer text-left flex items-center justify-between group"
                    >
                      <div>
                        <span className="text-xs font-black text-[#152449] group-hover:text-[#0072CE] block">
                          {sample.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                          "{sample.preview.replace(/\n/g, ", ")}"
                        </span>
                      </div>
                      <span className="text-xs font-black text-[#0072CE] shrink-0 ml-2">
                        Scan →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: LIVE STREAM VIEWFINDER */}
          {/* ========================================================================= */}
          {step === "viewfinder" && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-xs font-black text-[#152449]">
                  Live Camera Scanner Viewfinder
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0072CE] border border-sky-200">
                  Rear Camera Active
                </span>
              </div>

              {/* Live Video Window with Reticle & Animated Laser Scanner */}
              <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-300 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {viewfinderLoading && (
                  <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-white space-y-2">
                    <div className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-bold">Accessing camera stream...</span>
                  </div>
                )}

                {/* Animated Laser Scanning Beam */}
                {!viewfinderLoading && !viewfinderError && (
                  <motion.div
                    animate={{ y: [-110, 110, -110] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#0091CD] to-transparent shadow-[0_0_14px_#0091CD]"
                  />
                )}

                {/* Framing Reticle Corner Brackets */}
                <div className="absolute inset-4 pointer-events-none border border-white/20 rounded-xl">
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-sky-400"></div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-sky-400"></div>
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-sky-400"></div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-sky-400"></div>
                </div>

                <span className="absolute bottom-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white shadow-xs">
                  Align notebook page or till slip inside frame
                </span>
              </div>

              {viewfinderError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium space-y-2">
                  <p>{viewfinderError}</p>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full py-2 rounded-lg bg-rose-600 text-white font-bold text-xs cursor-pointer"
                  >
                    Open Native Camera App Instead
                  </button>
                </div>
              )}

              {/* Viewfinder Controls */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    stopLiveViewfinder();
                    setStep("capture");
                  }}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCaptureFromViewfinder}
                  disabled={viewfinderLoading || Boolean(viewfinderError)}
                  className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                    !viewfinderLoading && !viewfinderError
                      ? "bg-[#0072CE] hover:bg-[#0284c7] text-white active:scale-98"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <span>📸</span>
                  <span>Capture & Extract</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: ANIMATED SCANNING & OCR PROGRESS */}
          {/* ========================================================================= */}
          {step === "scanning" && (
            <div className="py-4 space-y-4 text-center">
              {/* Image Preview with Animated Scanning Beam */}
              {previewImage && (
                <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                  <img
                    src={previewImage}
                    alt="Receipt Scanning Preview"
                    className="w-full h-full object-cover filter contrast-110"
                  />
                  {/* Moving Green/Blue Laser Scanner Beam */}
                  <motion.div
                    animate={{ y: [0, 160, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0072CE] to-transparent shadow-[0_0_12px_#0072CE]"
                  />
                </div>
              )}

              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#152449]">
                  Extracting Transactions with Tesseract.js
                </h4>
                <p className="text-[11px] text-slate-500">{progressStatus}</p>
              </div>

              {/* Progress Bar with Percentage Readout */}
              <div className="space-y-1.5 max-w-xs mx-auto">
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#0072CE] to-emerald-500"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span>OCR Pipeline</span>
                  <span className="font-mono font-black text-[#0072CE]">{progress}%</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: PRE-COMMIT ITEMIZED REVIEW SCREEN */}
          {/* ========================================================================= */}
          {step === "review" && (
            <div className="space-y-3.5">
              {/* Header: "Scanned [X] Transactions from Counter-Book" */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0072CE] block">
                    Counter-Book OCR Parser
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-[#152449]">
                    Scanned {extractedRows.length} Transactions from Counter-Book
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleAddEmptyRow}
                  className="px-2.5 py-1.5 rounded-xl bg-sky-50 text-[#0072CE] border border-sky-200 text-xs font-bold hover:bg-sky-100 transition cursor-pointer shrink-0"
                >
                  + Add Line
                </button>
              </div>

              {/* Editable Table Rows */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {extractedRows.map((row, index) => {
                  const isSale = row.type === "sale";

                  return (
                    <div
                      key={row.id || index}
                      className="p-3 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2"
                    >
                      {/* Top Row: Type selector toggle + Quick delete trash icon */}
                      <div className="flex items-center justify-between gap-2">
                        {/* Type selector toggle: [Sale] / [Expense] */}
                        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleUpdateRow(index, "type", "sale")}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSale
                                ? "bg-[#152449] text-white shadow-2xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isSale ? "bg-emerald-400" : "bg-slate-400"}`} />
                            <span>Sale</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateRow(index, "type", "expense")}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              !isSale
                                ? "bg-[#152449] text-white shadow-2xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${!isSale ? "bg-rose-400" : "bg-slate-400"}`} />
                            <span>Expense</span>
                          </button>
                        </div>

                        {/* Quick delete trash icon */}
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          className="w-7 h-7 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                          title="Delete line"
                          aria-label="Delete line"
                        >
                          <svg className="w-3.5 h-3.5 stroke-[1.75]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Line Item Inputs: Description + Amount */}
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-7 space-y-0.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                            Description
                          </label>
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => handleUpdateRow(index, "name", e.target.value)}
                            placeholder="e.g. 3x Bread"
                            className="w-full py-1.5 px-2.5 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-[#152449] outline-none focus:bg-white focus:border-[#0072CE] focus:ring-1 focus:ring-[#0072CE]"
                          />
                        </div>

                        <div className="col-span-5 space-y-0.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                            Amount (ZAR)
                          </label>
                          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 focus-within:bg-white focus-within:border-[#0072CE] focus-within:ring-1 focus-within:ring-[#0072CE]">
                            <span className="text-xs font-bold text-[#0072CE] mr-1 select-none font-mono">R</span>
                            <input
                              type="number"
                              step="any"
                              value={row.amount}
                              onChange={(e) => handleUpdateRow(index, "amount", parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              className="w-full text-right text-xs font-black font-mono text-[#152449] outline-none bg-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Summary: Display "Total Inflow: +R[X] | Total Outflow: -R[Y]" */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-emerald-50 border border-sky-200 text-center">
                <p className="text-xs font-extrabold text-[#152449]">
                  <span>Total Inflow: </span>
                  <span className="text-emerald-700 font-mono font-black">+R{totalSales.toFixed(2)}</span>
                  <span className="text-slate-400 mx-2 font-normal">|</span>
                  <span>Total Outflow: </span>
                  <span className="text-rose-600 font-mono font-black">-R{totalExpenses.toFixed(2)}</span>
                </p>
              </div>

              {/* 1-Tap Batch Commit Button */}
              <button
                type="button"
                onClick={handleCommitAllScanned}
                disabled={extractedRows.length === 0}
                className="w-full py-3 px-4 bg-[#152449] hover:bg-[#0072CE] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Commit All Scanned Entries</span>
              </button>

              {/* Secondary Option: Rescan */}
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => setStep("capture")}
                  className="text-xs font-semibold text-slate-500 hover:text-[#0072CE] transition-colors cursor-pointer"
                >
                  Rescan Photo or Select Different Notebook
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
