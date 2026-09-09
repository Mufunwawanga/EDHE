import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_WALLET,
  generateBusinessPresets,
  computeActiveStreak,
  JOURNEY_STEPS,
  PARTNERS,
  fmtMoney,
} from "../constants/data";
import { TRANSLATIONS } from "../constants/translations";
import { db } from "../services/db";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // 1. Core Universal State initialized from src/services/db.js
  const [profile, setProfile] = useState(() => db.getProfile());
  const [catalog, setCatalog] = useState(() => db.getCatalog());
  const [transactions, setTransactions] = useState(() => db.getTransactions());
  const [consent, setConsent] = useState(() => db.getConsent());
  const [metrics, setMetrics] = useState(() => db.calculateMetrics());

  // Localization & App Preferences
  const LANG_MAP = {
    isizulu: "zu",
    zulu: "zu",
    zu: "zu",
    sesotho: "st",
    sotho: "st",
    st: "st",
    tshivenda: "ve",
    venda: "ve",
    ve: "ve",
    sepedi: "nso",
    pedi: "nso",
    nso: "nso",
    ns: "nso",
    isixhosa: "xh",
    xhosa: "xh",
    xh: "xh",
    afrikaans: "af",
    af: "af",
    english: "en",
    en: "en",
  };

  const [language, setLanguageState] = useState(() => {
    if (typeof window === "undefined") return "en";
    const saved =
      localStorage.getItem("preferred_language") ||
      localStorage.getItem("cash2cred_lang");
    if (saved) return saved;
    const initialProfile = db.getProfile();
    if (initialProfile?.isConfigured) return "en";
    return null;
  });

  const currentLanguage = (() => {
    const raw = String(language || "EN").toUpperCase().trim();
    if (raw === "NSO") return "NS";
    if (["EN", "ZU", "ST", "VE", "NS", "XH", "AF"].includes(raw)) return raw;
    const inv = { zu: "ZU", st: "ST", ve: "VE", nso: "NS", ns: "NS", xh: "XH", af: "AF", en: "EN" };
    return inv[raw.toLowerCase()] || "EN";
  })();

  const setLanguage = (code) => {
    if (!code) {
      setLanguageState(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("preferred_language");
          localStorage.removeItem("cash2cred_lang");
        } catch (e) {
          console.warn("Could not remove preferred_language:", e);
        }
      }
      return;
    }

    const normalized = LANG_MAP[String(code).toLowerCase().trim()] || String(code).toLowerCase().trim();

    setLanguageState(normalized);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("preferred_language", code);
        localStorage.setItem("cash2cred_lang", normalized);
      } catch (e) {
        console.warn("Could not save preferred_language to localStorage:", e);
      }
    }
  };
  const [currency, setCurrency] = useState(() => localStorage.getItem("cash2cred_currency") || "ZAR");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem("cash2cred_logged_in");
    if (saved !== null) return saved === "true";
    const initialProfile = db.getProfile();
    return Boolean(initialProfile?.isConfigured);
  });
  const [wallet, setWallet] = useState(() => {
    const saved = localStorage.getItem("cash2cred_wallet");
    return saved !== null ? parseFloat(saved) : INITIAL_WALLET;
  });

  // Monetization & Subscription
  const [isPremium, setIsPremium] = useState(() => {
    const saved = localStorage.getItem("cash2cred_premium");
    return saved !== null ? saved === "true" : true;
  });
  const [subscriptionModal, setSubscriptionModal] = useState(false);

  // Navigation
  const [screen, setScreenState] = useState("home"); // home, pos, inventory, reviews, access, creditId
  const [screenHistory, setScreenHistory] = useState(["home"]);

  const setScreen = (newScreen) => {
    setScreenState((prev) => {
      if (prev !== newScreen) {
        setScreenHistory((history) => {
          if (history[history.length - 1] === newScreen) return history;
          return [...history, newScreen];
        });
      }
      return newScreen;
    });
  };

  const goBack = () => {
    // 1. Close any open contextual modals first
    if (snapLogModal) { setSnapLogModal(false); return true; }
    if (voiceTallyModal) { setVoiceTallyModal(false); return true; }
    if (customSaleModal) { setCustomSaleModal(false); return true; }
    if (expenseModal) { setExpenseModal(false); return true; }
    if (saleModal) { setSaleModal(null); return true; }
    if (restockModal) { setRestockModal(null); return true; }
    if (topUpModal) { setTopUpModal(false); return true; }
    if (showStatementModal) { setShowStatementModal(false); return true; }
    if (subscriptionModal) { setSubscriptionModal(false); return true; }
    if (slipReceiptModal) { setSlipReceiptModal(false); return true; }

    // 2. Step back in screen history or fallback to home
    let navigated = false;
    setScreenHistory((history) => {
      if (history.length > 1) {
        const nextHistory = history.slice(0, -1);
        const prevScreen = nextHistory[nextHistory.length - 1] || "home";
        setScreenState(prevScreen);
        navigated = true;
        return nextHistory;
      } else {
        setScreenState("home");
        navigated = true;
        return ["home"];
      }
    });
    return navigated;
  };

  const [reviewPeriod, setReviewPeriod] = useState("week"); // day, week, month

  // Load-Shedding & Data Shield (Low-Connectivity Offline Queue)
  const [isOffline, setIsOffline] = useState(() => localStorage.getItem("cash2cred_offline") === "true");
  const [offlineQueueCount, setOfflineQueueCount] = useState(() => {
    const saved = localStorage.getItem("cash2cred_offline_queue");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [syncNotification, setSyncNotification] = useState("");

  // Modals
  const [saleModal, setSaleModal] = useState(null);
  const [customSaleModal, setCustomSaleModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const [restockModal, setRestockModal] = useState(null);
  const [topUpModal, setTopUpModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [snapLogModal, setSnapLogModal] = useState(false);
  const [voiceTallyModal, setVoiceTallyModal] = useState(false);
  const [slipReceiptModal, setSlipReceiptModal] = useState(false);

  // Daily OCR Scans Quota Tracking
  const [todayOcrScansCount, setTodayOcrScansCount] = useState(() => db.getDailyOcrScansCount());

  function incrementOcrScansCount() {
    const next = db.incrementOcrScansCount();
    setTodayOcrScansCount(next);
    return next;
  }

  // Form Inputs
  const [customSaleName, setCustomSaleName] = useState("");
  const [customSaleAmount, setCustomSaleAmount] = useState("");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [restockQty, setRestockQty] = useState(5);
  const [topUpCustom, setTopUpCustom] = useState("");
  const [shareFeedback, setShareFeedback] = useState(false);

  // Snap-Log OCR state
  const [snapLogStep, setSnapLogStep] = useState("photo"); // photo, parsing, review
  const [snapLogProgress, setSnapLogProgress] = useState(0);
  const [snapLogImage, setSnapLogImage] = useState(null);
  const [extractedTransactions, setExtractedTransactions] = useState([]);

  // Expense Categories (Adaptive)
  const [expenseCategories, setExpenseCategories] = useState(() => [
    "Raw Materials & Stock",
    "Transport & Fuel",
    "Electricity / Airtime",
    "Rent & Space Fee",
    "Packaging & Supplies",
  ]);

  // Partners Consent Map
  const [partnersAccess, setPartnersAccess] = useState(() => {
    const saved = localStorage.getItem("cash2cred_access");
    return saved ? JSON.parse(saved) : { a1: true };
  });

  // Re-calculate metrics whenever transactions array updates
  useEffect(() => {
    setMetrics(db.calculateMetrics());
  }, [transactions]);

  // Sync state to localStorage
  useEffect(() => {
    if (language) localStorage.setItem("cash2cred_lang", language);
    if (profile) {
      db.saveProfile(profile);
      localStorage.setItem("cash2cred:profile", JSON.stringify(profile));
      localStorage.setItem("cash2cred_profile", JSON.stringify(profile));
    }
    localStorage.setItem("cash2cred_wallet", wallet.toString());
    if (catalog) {
      db.saveCatalog(catalog);
      localStorage.setItem("cash2cred:products", JSON.stringify(catalog));
      localStorage.setItem("cash2cred_products", JSON.stringify(catalog));
    }
    if (transactions) {
      db.saveTransactions(transactions);
      localStorage.setItem("cash2cred:transactions", JSON.stringify(transactions));
      localStorage.setItem("cash2cred_txs", JSON.stringify(transactions));
    }
    localStorage.setItem("cash2cred_access", JSON.stringify(partnersAccess));
    localStorage.setItem("cash2cred_currency", currency);
    localStorage.setItem("cash2cred_premium", isPremium.toString());
    localStorage.setItem("cash2cred_offline", isOffline.toString());
    localStorage.setItem("cash2cred_offline_queue", offlineQueueCount.toString());
  }, [language, profile, wallet, catalog, transactions, partnersAccess, currency, isPremium, isOffline, offlineQueueCount]);

  /**
   * =========================================================================
   * CORE ACTIONS REQUIRED
   * =========================================================================
   */

  // 1. updateProfile(newProfile)
  // Saves business name, chosen business type, and opening float
  function updateProfile(newProfile) {
    const current = db.getProfile();
    const updated = db.saveProfile({
      ...current,
      ...newProfile,
      businessName: newProfile?.businessName || newProfile?.name || current.businessName,
      name: newProfile?.businessName || newProfile?.name || current.name,
      category: newProfile?.category || newProfile?.businessType || current.category,
      businessType: newProfile?.category || newProfile?.businessType || current.businessType,
      openingFloat: parseFloat(newProfile?.openingFloat) || 0,
      isConfigured: true,
    });
    setProfile(updated);
    return updated;
  }

  // 1b. upgradeSubscription(tier)
  // Toggles between 'free' and 'growth_pro'
  function upgradeSubscription(tier = "growth_pro") {
    const updated = db.upgradeSubscription(tier);
    setProfile(updated);
    setIsPremium(tier === "growth_pro" || tier === "Growth Pro (R20/mo)");
    return updated;
  }

  // 2. addCatalogItem({ name, itemType, sellingPrice, costPrice, stockQty, lowStockThreshold, trackStock })
  // Adds a trader's custom product/service
  function addCatalogItem(item) {
    const newItem = db.addCatalogItem(item);
    const updatedCatalog = db.getCatalog();
    setCatalog(updatedCatalog);
    return newItem;
  }

  // 3. updateCatalogItem(id, updatedFields)
  // Modifies existing prices or stock levels
  function updateCatalogItem(id, updatedFields) {
    const updated = db.updateCatalogItem(id, updatedFields);
    setCatalog(db.getCatalog());
    return updated;
  }

  // 4. deleteCatalogItem(id)
  // Removes an item from the catalog
  function deleteCatalogItem(id) {
    const updated = db.deleteCatalogItem(id);
    setCatalog(updated);
    return updated;
  }

  // 5. recordSale({ description, amount, cost, qty, paymentMethod })
  // Saves a cash sale, recalculates today's money in/retained, and bumps the Growth Readiness score
  function recordSale(params) {
    const isObj = typeof params === "object" && params !== null;
    const desc = isObj ? params.description || params.name || "Cash Sale" : String(params || "Cash Sale");
    const amount = isObj ? parseFloat(params.amount || params.sellingPrice || params.price) || 0 : 0;
    const cost = isObj ? parseFloat(params.cost || params.costPrice) || 0 : 0;
    const qty = isObj ? parseInt(params.qty, 10) || 1 : 1;
    const paymentMethod = (isObj && params.paymentMethod) || "cash";

    const newTx = db.logSale({
      description: desc,
      amount,
      cost,
      qty,
      paymentMethod,
    });

    const updatedTxs = db.getTransactions();
    setTransactions(updatedTxs);
    const newMetrics = db.calculateMetrics();
    setMetrics(newMetrics);

    if (isOffline) {
      setOfflineQueueCount((prev) => {
        const next = prev + 1;
        localStorage.setItem("cash2cred_offline_queue", next.toString());
        return next;
      });
    }

    return newTx;
  }

  // 6. recordExpense({ description, amount, category, paymentMethod })
  // Saves a cash outflow, updates today's money out, and updates net profit
  function recordExpense(params) {
    const isObj = typeof params === "object" && params !== null;
    const desc = isObj ? params.description || params.name || "Operating Expense" : String(params || "Operating Expense");
    const amount = isObj ? parseFloat(params.amount) || 0 : 0;
    const category = (isObj && params.category) || "General";
    const paymentMethod = (isObj && params.paymentMethod) || "cash";
    const date = (isObj && params.date) || new Date().toISOString();

    const newTx = db.logExpense({
      description: desc,
      amount,
      category,
      paymentMethod,
      date,
    });

    const updatedTxs = db.getTransactions();
    setTransactions(updatedTxs);
    const newMetrics = db.calculateMetrics();
    setMetrics(newMetrics);

    if (isOffline) {
      setOfflineQueueCount((prev) => {
        const next = prev + 1;
        localStorage.setItem("cash2cred_offline_queue", next.toString());
        return next;
      });
    }

    return newTx;
  }

  // 6b. recordTransactionBatch(items)
  // Batch-writes multiple sales & expenses into the ledger and updates telemetry
  function recordTransactionBatch(items) {
    const logged = db.logTransactionBatch(items);
    const updatedTxs = db.getTransactions();
    setTransactions(updatedTxs);
    const newMetrics = db.calculateMetrics();
    setMetrics(newMetrics);
    return logged;
  }

  // 7. toggleConsent(funderKey)
  // Updates POPIA data-sharing preferences
  function toggleConsent(funderKey) {
    const currentVal = consent[funderKey] !== undefined ? !consent[funderKey] : true;
    const updated = db.saveConsent({
      [funderKey]: currentVal,
    });
    setConsent(updated);
    setPartnersAccess((prev) => ({ ...prev, [funderKey]: currentVal }));
    return updated;
  }

  // 8. resetAppToNewTrader()
  // Clears data to demonstrate a blank Day 1 first-time user experience
  function resetAppToNewTrader() {
    db.resetDatabase();
    setProfile(db.getProfile());
    setCatalog(db.getCatalog());
    setTransactions([]);
    setConsent(db.getConsent());
    setMetrics(db.calculateMetrics());
    setIsLoggedIn(false);
    setScreen("home");
    setLanguage(null);
    localStorage.removeItem("preferred_language");
    localStorage.removeItem("cash2cred_lang");
    localStorage.removeItem("cash2cred_logged_in");
    localStorage.removeItem("cash2cred_profile");
    localStorage.removeItem("cash2cred:profile");
    localStorage.removeItem("c2c_profile");
    localStorage.removeItem("c2c_passport_code");
    localStorage.removeItem("cash2cred:products");
    localStorage.removeItem("c2c_catalog");
    localStorage.removeItem("c2c_transactions");
    localStorage.removeItem("cash2cred:transactions");
    localStorage.removeItem("c2c_consent");
    localStorage.removeItem("cash2cred_wallet");
    localStorage.removeItem("cash2cred_offline_queue");
    localStorage.removeItem("c2c_ocr_scans");
    setTodayOcrScansCount(0);
  }

  /**
   * =========================================================================
   * COMPATIBILITY ACTIONS & HELPERS
   * =========================================================================
   */
  const langKey = (() => {
    const code = String(language || "en").toLowerCase().trim();
    return LANG_MAP[code] || code;
  })();

  const baseDict = TRANSLATIONS[langKey] || TRANSLATIONS["en"] || {};
  const enDict = TRANSLATIONS["en"] || {};

  function tHelper(key, params = {}) {
    if (!key || typeof key !== "string") return "";
    const text = baseDict[key] ?? enDict[key] ?? key;
    if (params && typeof params === "object") {
      return Object.entries(params).reduce((str, [k, v]) => str.replace(`{${k}}`, v), text);
    }
    return text;
  }

  const t = new Proxy(tHelper, {
    get(target, prop) {
      if (typeof prop === "string") {
        if (prop in target) return target[prop];
        return baseDict[prop] ?? enDict[prop] ?? prop;
      }
      return target[prop];
    },
  });

  function fmt(n) {
    return fmtMoney(n, currency);
  }

  function handleCreateAccount(nameInput, storeInput, businessTypeInput, phoneInput, openingFloat = 0) {
    if (!nameInput.trim()) return;
    const businessType = businessTypeInput.trim() || "General Trade";
    updateProfile({
      ownerName: nameInput.trim(),
      businessName: storeInput.trim() || `${nameInput.trim()}'s Enterprise`,
      storeName: storeInput.trim() || `${nameInput.trim()}'s Enterprise`,
      category: businessType,
      businessType,
      phone: phoneInput.trim() || "072 000 0000",
      openingFloat: parseFloat(openingFloat) || 0,
      isConfigured: true,
    });
    setIsLoggedIn(true);
  }

  function resetToFirstPage() {
    resetAppToNewTrader();
  }

  function goBackToLanguage() {
    setLanguage(null);
  }

  function goBackToRegistration() {
    setIsLoggedIn(false);
  }

  function handleTopUp(amount) {
    const amt = parseFloat(amount);
    if (!amt || isNaN(amt)) return;
    setWallet((prev) => prev + amt);
    setTopUpModal(false);
    setTopUpCustom("");
  }

  function logSaleItem(itemName, amountValue, qtyValue = 1, costValue = 0) {
    recordSale({
      description: itemName,
      amount: parseFloat(amountValue) || 0,
      cost: parseFloat(costValue) || 0,
      qty: parseInt(qtyValue, 10) || 1,
    });
  }

  function logExpenseItem(categoryName, amountValue, notes = "") {
    const amt = parseFloat(amountValue);
    const trimmedCategory = (categoryName || "").trim();
    if (!amt || !trimmedCategory) return;
    const displayName = notes.trim() ? `${trimmedCategory} (${notes.trim()})` : trimmedCategory;
    recordExpense({
      description: displayName,
      amount: amt,
      category: trimmedCategory,
    });
    setExpenseModal(false);
    setExpenseTitle("");
    setExpenseAmount("");
  }

  function logSale(prod, qty, customPrice) {
    const unitPrice = customPrice !== undefined ? parseFloat(customPrice) : (prod.sellingPrice || prod.price || 0);
    const unitCost = prod.costPrice || prod.cost || 0;
    recordSale({
      description: prod.name,
      amount: unitPrice,
      cost: unitCost,
      qty: qty || 1,
    });
    setSaleModal(null);
  }

  function quickLogSale(prod, amountValue) {
    recordSale({
      description: prod.name || "Quick Sale",
      amount: parseFloat(amountValue) || prod.sellingPrice || prod.price || 50,
      cost: prod.costPrice || prod.cost || 0,
      qty: 1,
    });
  }

  function logCustomSale() {
    const amt = parseFloat(customSaleAmount);
    if (!amt || !customSaleName.trim()) return;
    recordSale({
      description: customSaleName.trim(),
      amount: amt,
      qty: 1,
    });
    setCustomSaleModal(false);
    setCustomSaleName("");
    setCustomSaleAmount("");
  }

  function logExpense() {
    const amt = parseFloat(expenseAmount);
    if (!amt || !expenseTitle.trim()) return;
    recordExpense({
      description: expenseTitle.trim(),
      amount: amt,
      category: "Operating Expense",
    });
  }

  function confirmRestock() {
    if (!restockModal) return;
    const updated = catalog.map((p) =>
      p.id === restockModal.id
        ? {
            ...p,
            stock: (p.stock || p.stockQty || 0) + restockQty,
            stockQty: (p.stockQty || p.stock || 0) + restockQty,
          }
        : p
    );
    db.saveCatalog(updated);
    setCatalog(updated);
    setRestockModal(null);
  }

  function toggleOffline() {
    if (isOffline) {
      setIsOffline(false);
      localStorage.setItem("cash2cred_offline", "false");
      if (offlineQueueCount > 0) {
        setSyncNotification(`Reconnected · ${offlineQueueCount} queued records reconciled with verified vault`);
        setOfflineQueueCount(0);
        localStorage.setItem("cash2cred_offline_queue", "0");
        setTimeout(() => setSyncNotification(""), 4500);
      } else {
        setSyncNotification("Reconnected · Verified vault in sync");
        setTimeout(() => setSyncNotification(""), 3000);
      }
    } else {
      setIsOffline(true);
      localStorage.setItem("cash2cred_offline", "true");
    }
  }

  function confirmVoiceTally(item) {
    const amt = parseFloat(item.amount || item.total) || 54;
    const qty = parseInt(item.qty, 10) || 1;
    const name = (item.name || item.item || "Voice Order").trim();
    recordSale({
      description: name,
      amount: amt,
      qty,
      paymentMethod: "cash",
    });
    setVoiceTallyModal(false);
  }

  function handleSnapLogFileSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSnapLogImage(uploadEvent.target.result);
        handleSnapLogUpload(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSnapLogUpload(imgSrc) {
    setSnapLogStep("parsing");
    setSnapLogProgress(15);
    setTimeout(() => setSnapLogProgress(45), 350);
    setTimeout(() => setSnapLogProgress(80), 750);
    setTimeout(() => {
      setSnapLogProgress(100);
      const simulatedItems = [
        { id: "ocr-1", type: "sale", name: "Daily Service Order", qty: 1, amount: 250.0 },
        { id: "ocr-2", type: "expense", name: "Operating Supplies", qty: 1, amount: 65.0 },
      ];
      setExtractedTransactions(simulatedItems);
      setSnapLogStep("review");
    }, 1100);
  }

  function addSnapLogLineItem() {
    setExtractedTransactions((prev) => [
      ...prev,
      {
        id: "ocr-" + Date.now(),
        type: "sale",
        name: "New Entry",
        qty: 1,
        amount: 50.0,
      },
    ]);
  }

  function updateSnapLogLineItem(index, field, value) {
    setExtractedTransactions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function toggleSnapLogTxType(index) {
    setExtractedTransactions((prev) => {
      const updated = [...prev];
      updated[index].type = updated[index].type === "sale" ? "expense" : "sale";
      return updated;
    });
  }

  function confirmSnapLogImport() {
    const newTransactions = extractedTransactions.map((tx) => {
      const amt = parseFloat(tx.amount) || 0;
      const cost = parseFloat(tx.cost) || (tx.type === "expense" ? amt : 0);
      const margin = tx.type === "sale" ? amt - cost : -amt;
      return {
        id: "tx-ocr-" + Date.now() + Math.random().toString(36).substring(2, 6),
        type: tx.type,
        amount: amt,
        cost,
        margin,
        description: tx.name || "Scanned Ledger Entry",
        name: tx.name || "Scanned Ledger Entry",
        qty: parseFloat(tx.qty) || 1,
        paymentMethod: "cash",
        date: new Date().toISOString(),
        ts: Date.now(),
        source: "ocr",
      };
    });

    const updated = [...newTransactions, ...transactions];
    db.saveTransactions(updated);
    setTransactions(updated);
    setMetrics(db.calculateMetrics());
    setSnapLogModal(false);
    setSnapLogStep("photo");
    setExtractedTransactions([]);
    setSnapLogImage(null);
  }

  function getStatementText() {
    const sharedPartners = Object.entries(partnersAccess)
      .filter(([, shared]) => shared)
      .map(([id]) => PARTNERS.find((p) => p.id === id)?.name)
      .join(", ");

    return `======================================
CASH2CRED VERIFIED BUSINESS STATEMENT
======================================
Store Name:     ${profile?.businessName || profile?.storeName || "My Enterprise"}
Owner Name:     ${profile?.ownerName || "Trader"}
Mobile Number:  ${profile?.phone || "N/A"}
Business Type:  ${(profile?.category || profile?.businessType || "General Trade").toUpperCase()}
Access Code:    ${profile?.passportCode || profile?.accessCode || "N/A"}
Statement Date: ${new Date().toLocaleDateString()}
--------------------------------------
FINANCIAL PERFORMANCE SUMMARY (${currency}):
Total Turnover:          ${fmt(totalRevenue)}
Total Operating Expense:  ${fmt(totalExpenses)}
Net Retained Profit:     ${fmt(netProfit)}
Gross Profit Margin:     ${margin}%
--------------------------------------
GROWTH READINESS AUDIT:
Overall Readiness Score: ${growthScore}/100 (${metrics.statusBand})
Active Days Recorded:    ${activeDays} Days
Active Recording Streak:  ${activeStreak} Days
Total Ledger Entries:    ${transactions.length} Records
--------------------------------------
PRE-APPROVED CREDIT PARTNERS SHARED:
${sharedPartners || "None (Access restricted by merchant)"}
======================================
Verify authenticity at cash2cred.co.za/verify/${profile?.passportCode || profile?.accessCode || ""}`;
  }

  // Dynamic telemetry calculations
  const totalRevenue = transactions.filter((t) => t.type === "sale").reduce((acc, c) => acc + (c.amount || 0), 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((acc, c) => acc + (c.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const margin = metrics.grossMarginPercent !== undefined ? metrics.grossMarginPercent : (totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0);
  const activeDays = new Set(transactions.map((t) => new Date(t.ts || t.date).toDateString())).size;
  const activeStreak = metrics.activeStreak !== undefined ? metrics.activeStreak : computeActiveStreak(transactions);
  const todayRevenue = metrics.todayMoneyIn !== undefined ? metrics.todayMoneyIn : 0;
  const todayExpenses = metrics.todayMoneyOut !== undefined ? metrics.todayMoneyOut : 0;
  const todayNetProfit = metrics.netRetained !== undefined ? metrics.netRetained : 0;
  const growthScore = metrics.growthReadinessScore !== undefined ? metrics.growthReadinessScore : 40;
  const activeJourneyStep = Math.min(JOURNEY_STEPS.length - 1, Math.max(0, Math.floor(growthScore / 17)));

  const growthFactors = [
    { name: t("recordConsistencyScore"), value: Math.min(30, activeStreak * 10), max: 30 },
    { name: t("businessStability"), value: Math.min(25, transactions.length * 2), max: 25 },
    { name: t("revenueProfitTrends"), value: margin > 15 ? 25 : Math.min(25, Math.max(0, margin)), max: 25 },
    { name: t("recordCompleteness"), value: Math.min(20, transactions.length * 3), max: 20 },
  ];

  const value = {
    // 1. Initial State & Collections
    profile,
    setProfile,
    catalog,
    setCatalog,
    products: catalog, // Backward-compatible alias
    setProducts: setCatalog, // Backward-compatible alias
    transactions,
    setTransactions,
    metrics,
    setMetrics,
    consent,
    setConsent,

    // 2. Core Actions
    updateProfile,
    addCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
    recordSale,
    recordExpense,
    recordTransactionBatch,
    toggleConsent,
    resetAppToNewTrader,

    // App Preferences & Identity
    currentLanguage,
    language,
    setLanguage,
    wallet,
    setWallet,
    isLoggedIn,
    setIsLoggedIn,
    currency,
    setCurrency,
    expenseCategories,
    setExpenseCategories,
    partnersAccess,
    setPartnersAccess,
    screen,
    setScreen,
    goBack,
    reviewPeriod,
    setReviewPeriod,

    // Modals
    saleModal,
    setSaleModal,
    customSaleModal,
    setCustomSaleModal,
    expenseModal,
    setExpenseModal,
    restockModal,
    setRestockModal,
    topUpModal,
    setTopUpModal,
    showStatementModal,
    setShowStatementModal,
    snapLogModal,
    setSnapLogModal,
    voiceTallyModal,
    setVoiceTallyModal,
    slipReceiptModal,
    setSlipReceiptModal,
    todayOcrScansCount,
    incrementOcrScansCount,

    // Form inputs
    customSaleName,
    setCustomSaleName,
    customSaleAmount,
    setCustomSaleAmount,
    expenseTitle,
    setExpenseTitle,
    expenseAmount,
    setExpenseAmount,
    restockQty,
    setRestockQty,
    topUpCustom,
    setTopUpCustom,
    shareFeedback,
    setShareFeedback,

    // Snap-Log
    snapLogStep,
    setSnapLogStep,
    snapLogProgress,
    setSnapLogProgress,
    snapLogImage,
    setSnapLogImage,
    extractedTransactions,
    setExtractedTransactions,

    // Helpers
    t,
    fmt,
    handleCreateAccount,
    resetToFirstPage,
    goBackToLanguage,
    goBackToRegistration,
    handleTopUp,
    logSaleItem,
    logExpenseItem,
    logSale,
    quickLogSale,
    logCustomSale,
    logExpense,
    confirmRestock,
    handleSnapLogFileSelect,
    handleSnapLogUpload,
    addSnapLogLineItem,
    updateSnapLogLineItem,
    toggleSnapLogTxType,
    confirmSnapLogImport,
    getStatementText,
    confirmVoiceTally,
    toggleOffline,

    // Underwriting Telemetry
    totalRevenue,
    totalExpenses,
    netProfit,
    margin,
    activeDays,
    activeStreak,
    todayRevenue,
    todayExpenses,
    todayNetProfit,
    growthFactors,
    growthScore,
    activeJourneyStep,

    // Monetization & Offline
    isPremium,
    setIsPremium,
    subscriptionModal,
    setSubscriptionModal,
    upgradeSubscription,
    isOffline,
    setIsOffline,
    offlineQueueCount,
    syncNotification,
    setSyncNotification,

    // db instance
    db,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
