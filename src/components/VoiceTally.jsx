import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

// Dictionary of English number words to numeric values
const NUMBER_WORDS = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
  thousand: 1000,
};

/**
 * Converts a sequence of spoken number words into a numeric integer/float.
 * e.g. "forty" -> 40, "three hundred" -> 300, "fifty five" -> 55, "one hundred and fifty" -> 150
 */
function convertNumberWordsToNumber(phrase) {
  if (!phrase) return 0;
  const clean = phrase
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\band\b/g, "")
    .trim();
  const tokens = clean.split(/\s+/).filter(Boolean);
  let total = 0;
  let current = 0;

  for (const token of tokens) {
    if (!isNaN(token)) {
      current += parseFloat(token);
    } else if (token === "hundred") {
      current = (current === 0 ? 1 : current) * 100;
    } else if (token === "thousand") {
      total += (current === 0 ? 1 : current) * 1000;
      current = 0;
    } else if (NUMBER_WORDS[token] !== undefined) {
      current += NUMBER_WORDS[token];
    }
  }
  return total + current;
}

/**
 * Universal Intent Parser:
 * Extracts item description, amount, and transaction type from informal South African spoken phrases.
 * Supports:
 * - "Sold 2 vetkoek for 30 rand" -> { item: "2 vetkoek", amount: 30, txType: "sale" }
 * - "Cold drink 25" -> { item: "Cold drink", amount: 25, txType: "sale" }
 * - "Braids four hundred rand" -> { item: "Braids", amount: 400, txType: "sale" }
 * - "Hair wash 60" -> { item: "Hair wash", amount: 60, txType: "sale" }
 * - "R50 electricity" -> { item: "Electricity", amount: 50, txType: "sale" }
 * - "Bought paraffin 45 rand" -> { item: "Paraffin", amount: 45, txType: "expense" }
 */
function parseVoiceIntent(rawTranscript) {
  if (!rawTranscript || typeof rawTranscript !== "string") {
    return { item: "", amount: 0, txType: "sale", raw: "" };
  }

  const text = rawTranscript.trim();
  let amount = 0;
  let matchText = "";
  let txType = "sale";

  // Check if speech indicates an outflow / expense
  if (/\b(?:expense|bought|paid|cost|spent|purchased|supplier|outflow)\b/i.test(text)) {
    txType = "expense";
  }

  const wordTokens =
    "(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)";

  // 1. Leading currency pattern: e.g. "R50 electricity", "ZAR 120"
  const rLeading = text.match(/\b(?:R|ZAR)\s*(\d+(?:\.\d{1,2})?)\b/i);

  // 2. Trailing currency pattern: e.g. "for 30 rand", "50 rands", "100 zar"
  const rTrailing = text.match(/\b(\d+(?:\.\d{1,2})?)\s*(?:rand|rands|zar)\b/i);

  // 3. Preposition number pattern: e.g. "for 30", "at 45"
  // 4. Spoken number words with or without "rand": e.g. "four hundred rand", "thirty rand", "for fifty"
  const wordWithRand = new RegExp(
    `(?:\\b(?:for|at)\\s+)?((?:${wordTokens}(?:[\\s-]+and[\\s-]+|[\\s-]+)?)+)\\s*(?:rand|rands|zar)\\b`,
    "i"
  );
  const wordAfterFor = new RegExp(
    `\\b(?:for|at)\\s+((?:${wordTokens}(?:[\\s-]+and[\\s-]+|[\\s-]+)?)+)\\b`,
    "i"
  );

  // 5. Ending number: e.g. "Cold drink 25", "Hair wash 60"
  const endingDigit = text.match(/\b(\d+(?:\.\d{1,2})?)\s*$/);

  // 6. Fallback any standalone number
  const anyDigit = text.match(/\b(\d+(?:\.\d{1,2})?)\b/);

  if (rLeading) {
    amount = parseFloat(rLeading[1]) || 0;
    matchText = rLeading[0];
  } else if (rTrailing) {
    amount = parseFloat(rTrailing[1]) || 0;
    matchText = rTrailing[0];
  } else if (forAtDigit) {
    amount = parseFloat(forAtDigit[1]) || 0;
    matchText = forAtDigit[0];
  } else {
    const wwrMatch = text.match(wordWithRand);
    const wafMatch = text.match(wordAfterFor);
    if (wwrMatch) {
      amount = convertNumberWordsToNumber(wwrMatch[1]);
      matchText = wwrMatch[0];
    } else if (wafMatch) {
      amount = convertNumberWordsToNumber(wafMatch[1]);
      matchText = wafMatch[0];
    } else if (endingDigit) {
      amount = parseFloat(endingDigit[1]) || 0;
      matchText = endingDigit[0];
    } else if (anyDigit) {
      amount = parseFloat(anyDigit[1]) || 0;
      matchText = anyDigit[0];
    }
  }

  // Remove the matched price portion to isolate item description
  let cleaned = text;
  if (matchText) {
    cleaned = cleaned.replace(matchText, " ");
  }

  // Clean trigger phrases & boilerplate
  cleaned = cleaned.replace(/^\b(?:sold|record|log|sale of|add|cash sale|i sold|bought|paid for|spent|purchase)\b\s*/i, "");
  cleaned = cleaned.replace(/\b(?:for|at|rand|rands|zar)\b/gi, " ");
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  let item = "";
  if (cleaned.length > 0) {
    item = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  } else {
    item = txType === "expense" ? "Operational Expense" : "Cash Sale";
  }

  return {
    item,
    amount: Math.round(amount * 100) / 100,
    txType,
    raw: text,
  };
}

// Demo phrases matching real South African informal trade
const DEMO_PHRASES = [
  { label: "Bakery / Snack", phrase: "Sold 2 vetkoek for 30 rand" },
  { label: "Spaza Drink", phrase: "Cold drink 25" },
  { label: "Salon Braids", phrase: "Braids four hundred rand" },
  { label: "Hair Wash", phrase: "Hair wash 60" },
  { label: "Electricity", phrase: "R50 electricity" },
  { label: "Fuel Outflow", phrase: "Bought paraffin 45 rand" },
];

export default function VoiceTally() {
  const {
    voiceTallyModal,
    setVoiceTallyModal,
    recordSale,
    recordExpense,
    setSyncNotification,
  } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [parsedItem, setParsedItem] = useState("");
  const [parsedAmount, setParsedAmount] = useState("");
  const [txType, setTxType] = useState("sale"); // "sale" | "expense"
  const [speechError, setSpeechError] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-ZA"; // South African English acoustic model
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setSpeechError("");
      };

      recognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        const parsed = parseVoiceIntent(currentTranscript);
        if (parsed.item) setParsedItem(parsed.item);
        if (parsed.amount > 0) {
          setParsedAmount(parsed.amount.toFixed(2));
        } else {
          setParsedAmount("");
        }
        if (parsed.txType) setTxType(parsed.txType);
      };

      recognition.onerror = (event) => {
        console.warn("Voice Recognition Error:", event.error);
        if (event.error === "not-allowed") {
          setSpeechError("Microphone access blocked. Enable permissions or use sample phrases.");
        } else if (event.error !== "no-speech") {
          setSpeechError(`Speech error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn("Speech recognition initialization failed:", err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  // Start or Stop Recording
  function toggleRecording() {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsRecording(false);
    } else {
      setTranscript("");
      setParsedItem("");
      setParsedAmount("");
      setSpeechError("");
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.warn("Start error:", err);
          setIsRecording(false);
        }
      } else {
        setSpeechError("Speech recognition not supported in this browser. Use sample phrases below.");
      }
    }
  }

  // Handle Demo Phrase Click
  function handleSelectDemoPhrase(phrase) {
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsRecording(false);
    }
    setTranscript(phrase);
    setSpeechError("");
    const parsed = parseVoiceIntent(phrase);
    setParsedItem(parsed.item);
    setParsedAmount(parsed.amount > 0 ? parsed.amount.toFixed(2) : "");
    if (parsed.txType) setTxType(parsed.txType);
  }

  // Commit and Log Sale/Expense
  function handleConfirmSale() {
    const finalAmount = parseFloat(parsedAmount) || 0;
    const isExpense = txType === "expense";
    const defaultTitle = isExpense ? "General Expense" : "Spoken Cash Sale";
    const finalItem = parsedItem.trim() || defaultTitle;
    if (finalAmount <= 0) return;

    if (isExpense) {
      recordExpense({
        description: finalItem,
        name: finalItem,
        amount: finalAmount,
        category: "Voice Outflow",
        qty: 1,
        paymentMethod: "cash",
      });
      if (setSyncNotification) {
        setSyncNotification(`Expense Recorded: -R${finalAmount.toFixed(2)}`);
        setTimeout(() => setSyncNotification(""), 3500);
      }
    } else {
      recordSale({
        description: finalItem,
        name: finalItem,
        amount: finalAmount,
        qty: 1,
        paymentMethod: "cash",
      });
      if (setSyncNotification) {
        setSyncNotification(`Sale Recorded: +R${finalAmount.toFixed(2)}`);
        setTimeout(() => setSyncNotification(""), 3500);
      }
    }

    setTranscript("");
    setParsedItem("");
    setParsedAmount("");
    setVoiceTallyModal(false);
  }

  if (!voiceTallyModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-left"
        onClick={() => {
          if (isRecording && recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch (_) {}
          }
          setVoiceTallyModal(false);
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-[360px] max-h-[90%] overflow-y-auto rounded-3xl p-5 bg-white shadow-2xl border border-slate-200 space-y-4 text-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0072CE]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-black text-[#152449]">Voice Tally</h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Speech-to-ledger intent recognition (en-ZA)
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (isRecording && recognitionRef.current) {
                  try {
                    recognitionRef.current.stop();
                  } catch (_) {}
                }
                setVoiceTallyModal(false);
              }}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-[#152449] transition cursor-pointer font-bold text-xs"
            >
              ✕
            </button>
          </div>

          {/* Central Microphone Button with Pulsing Audio Feedback */}
          <div className="py-2 text-center space-y-3">
            <div className="relative inline-flex items-center justify-center">
              {/* Outer Pulsing Wave Rings */}
              {isRecording && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.6, 2], opacity: [0.6, 0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                    className="absolute w-24 h-24 rounded-full bg-[#0072CE]/30"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1.6], opacity: [0.8, 0.4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, ease: "easeOut" }}
                    className="absolute w-24 h-24 rounded-full bg-[#0072CE]/40"
                  />
                </>
              )}

              {/* Central Mic Button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition cursor-pointer shadow-lg relative z-10 border-4 border-white ring-4 ${
                  isRecording
                    ? "bg-rose-600 ring-rose-300 scale-105"
                    : "bg-gradient-to-tr from-[#0072CE] to-[#00A3E0] ring-sky-100 hover:scale-105 active:scale-95"
                }`}
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>

            <div>
              <p className="text-xs font-black text-[#152449]">
                {isRecording ? "Listening to spoken sales..." : "Tap to Speak Sales Intent"}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {isRecording
                  ? "Speak naturally in South African English (en-ZA)"
                  : "Say: 'Sold two coldrinks for forty rand' or 'Braids three hundred'"}
              </p>
            </div>

            {/* Sound Wave Animation when active */}
            {isRecording && (
              <div className="flex justify-center items-center gap-1 pt-1">
                {[0.2, 0.6, 1.0, 0.4, 0.8, 0.5, 0.9, 0.3].map((delay, i) => (
                  <motion.span
                    key={i}
                    animate={{ height: ["6px", "22px", "6px"] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: delay * 0.15 }}
                    className="w-1 bg-[#0072CE] rounded-full inline-block"
                  />
                ))}
              </div>
            )}

            {speechError && (
              <p className="text-[11px] text-rose-600 font-bold bg-rose-50 p-2 rounded-xl border border-rose-200">
                {speechError}
              </p>
            )}
          </div>

          {/* Awaiting speech prompt when empty */}
          {!transcript && !parsedItem && !parsedAmount && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-xs text-slate-500 font-medium">
                Awaiting speech... Tap the microphone above or tap a sample phrase below.
              </p>
            </div>
          )}

          {/* Two-Step Review & Confirmation Card */}
          {(transcript || parsedItem || parsedAmount) && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50/50 to-white shadow-xs space-y-3.5"
            >
              {/* Header Status */}
              <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#152449] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0072CE]" />
                  Review & Confirm Voice Intent
                </span>
                <span className="text-[10px] font-semibold text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded-md">
                  en-ZA
                </span>
              </div>

              {/* Spoken Text Transcript in Quotes */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Spoken Text Transcript:
                </span>
                <p className="text-xs text-[#152449] font-semibold italic">
                  "{transcript || 'Spoken input captured'}"
                </p>
              </div>

              {/* Transaction Type Toggle */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Transaction Type
                </span>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setTxType("sale")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      txType === "sale"
                        ? "bg-[#152449] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${txType === "sale" ? "bg-emerald-400" : "bg-slate-400"}`} />
                    <span>Sale (Money In)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType("expense")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      txType === "expense"
                        ? "bg-[#152449] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${txType === "expense" ? "bg-rose-400" : "bg-slate-400"}`} />
                    <span>Expense (Money Out)</span>
                  </button>
                </div>
              </div>

              {/* Editable Fields: Description & Extracted Amount */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-7 space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Item Description
                  </label>
                  <input
                    type="text"
                    value={parsedItem}
                    onChange={(e) => setParsedItem(e.target.value)}
                    placeholder="e.g. Braids, Vetkoek"
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-[#152449] bg-white border border-slate-200 outline-none focus:border-[#0072CE] focus:ring-1 focus:ring-[#0072CE]"
                  />
                </div>
                <div className="col-span-5 space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Extracted Amount
                  </label>
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:border-[#0072CE] focus-within:ring-1 focus-within:ring-[#0072CE]">
                    <span className="text-sm font-black text-[#0072CE] mr-1 select-none">R</span>
                    <input
                      type="number"
                      step="any"
                      value={parsedAmount}
                      onChange={(e) => setParsedAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full text-right text-sm font-black font-mono text-[#152449] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Confirmation & Instant Commitment Button */}
              <button
                type="button"
                onClick={handleConfirmSale}
                disabled={!parsedAmount || parseFloat(parsedAmount) <= 0}
                className="w-full py-3 px-4 bg-[#152449] hover:bg-[#0072CE] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{txType === "expense" ? "Confirm & Commit Expense" : "Confirm & Commit Sale"}</span>
                {parsedAmount && parseFloat(parsedAmount) > 0 && (
                  <span className="font-mono text-xs opacity-90">
                    ({txType === "expense" ? "-R" : "+R"}{parseFloat(parsedAmount).toFixed(2)})
                  </span>
                )}
              </button>

              {/* Subtle Cancel / Re-record Option */}
              <div className="flex items-center justify-between pt-0.5 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setTranscript("");
                    setParsedItem("");
                    setParsedAmount("");
                    toggleRecording();
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-[#0072CE] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Cancel / Re-record</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTranscript("");
                    setParsedItem("");
                    setParsedAmount("");
                  }}
                  className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          )}

          {/* Sample Phrases */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Sample Phrases:
              </span>
              <span className="text-[9px] text-[#0072CE] font-bold">1-Tap Test</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {DEMO_PHRASES.map((dp) => (
                <button
                  key={dp.phrase}
                  type="button"
                  onClick={() => handleSelectDemoPhrase(dp.phrase)}
                  className="p-2 rounded-xl text-left border border-slate-200 bg-slate-50/70 hover:bg-sky-50/80 hover:border-sky-300 transition cursor-pointer group active:scale-95 min-w-0"
                >
                  <span className="text-[9px] font-extrabold text-[#0072CE] uppercase tracking-wider block truncate">
                    {dp.label}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-800 line-clamp-1 group-hover:text-[#0072CE] break-words">
                    "{dp.phrase}"
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
