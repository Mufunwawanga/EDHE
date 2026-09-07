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

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Persistence mirroring Room DB & DataStore
  const [language, setLanguage] = useState(() => localStorage.getItem("cash2cred_lang") || null);
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("cash2cred:profile") || localStorage.getItem("cash2cred_profile");
    return saved ? JSON.parse(saved) : null;
  });
  const [wallet, setWallet] = useState(() => {
    const saved = localStorage.getItem("cash2cred_wallet");
    return saved !== null ? parseFloat(saved) : INITIAL_WALLET;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currency, setCurrency] = useState(() => localStorage.getItem("cash2cred_currency") || "ZAR");

  // Monetization & Subscription
  const [isPremium, setIsPremium] = useState(() => {
    const saved = localStorage.getItem("cash2cred_premium");
    return saved !== null ? saved === "true" : true;
  });
  const [subscriptionModal, setSubscriptionModal] = useState(false);

  // Voice Tally Modal
  const [voiceTallyModal, setVoiceTallyModal] = useState(false);

  // Load-Shedding & Data Shield (Low-Connectivity Offline Queue)
  const [isOffline, setIsOffline] = useState(() => localStorage.getItem("cash2cred_offline") === "true");
  const [offlineQueueCount, setOfflineQueueCount] = useState(() => {
    const saved = localStorage.getItem("cash2cred_offline_queue");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [syncNotification, setSyncNotification] = useState("");

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("cash2cred:products") || localStorage.getItem("cash2cred_products");
    if (saved) return JSON.parse(saved);
    const savedProfile = localStorage.getItem("cash2cred:profile") || localStorage.getItem("cash2cred_profile");
    const businessType = savedProfile ? JSON.parse(savedProfile).businessType : "";
    return generateBusinessPresets(businessType).items;
  });

  const [expenseCategories, setExpenseCategories] = useState(() => {
    const savedProfile = localStorage.getItem("cash2cred:profile") || localStorage.getItem("cash2cred_profile");
    const businessType = savedProfile ? JSON.parse(savedProfile).businessType : "";
    return generateBusinessPresets(businessType).expenseCategories;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("cash2cred:transactions") || localStorage.getItem("cash2cred_txs");
    if (saved) return JSON.parse(saved);
    const savedProfile = localStorage.getItem("cash2cred:profile") || localStorage.getItem("cash2cred_profile");
    const businessType = savedProfile ? JSON.parse(savedProfile).businessType : "";
    return generateBusinessPresets(businessType).starterTransactions;
  });

  const [partnersAccess, setPartnersAccess] = useState(() => {
    const saved = localStorage.getItem("cash2cred_access");
    return saved ? JSON.parse(saved) : { a1: true };
  });

  // Navigation
  const [screen, setScreen] = useState("home"); // home, pos, inventory, reviews, access
  const [reviewPeriod, setReviewPeriod] = useState("week"); // day, week, month

  // Modals
  const [saleModal, setSaleModal] = useState(null);
  const [customSaleModal, setCustomSaleModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const [restockModal, setRestockModal] = useState(null);
  const [topUpModal, setTopUpModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [snapLogModal, setSnapLogModal] = useState(false);

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

  useEffect(() => {
    if (language) localStorage.setItem("cash2cred_lang", language);
    if (profile) {
      localStorage.setItem("cash2cred:profile", JSON.stringify(profile));
      localStorage.setItem("cash2cred_profile", JSON.stringify(profile));
    }
    localStorage.setItem("cash2cred_wallet", wallet.toString());
    localStorage.setItem("cash2cred:products", JSON.stringify(products));
    localStorage.setItem("cash2cred_products", JSON.stringify(products));
    localStorage.setItem("cash2cred:transactions", JSON.stringify(transactions));
    localStorage.setItem("cash2cred_txs", JSON.stringify(transactions));
    localStorage.setItem("cash2cred_access", JSON.stringify(partnersAccess));
    localStorage.setItem("cash2cred_currency", currency);
    localStorage.setItem("cash2cred_premium", isPremium.toString());
    localStorage.setItem("cash2cred_offline", isOffline.toString());
    localStorage.setItem("cash2cred_offline_queue", offlineQueueCount.toString());
  }, [language, profile, wallet, products, transactions, partnersAccess, currency, isPremium, isOffline, offlineQueueCount]);

  // Translation helper
  function t(key, params = {}) {
    const lang = language || "en";
    const text = TRANSLATIONS[lang]?.[key] || TRANSLATIONS["en"][key] || key;
    return Object.entries(params).reduce((str, [k, v]) => str.replace(`{${k}}`, v), text);
  }

  // Format currency helper
  function fmt(n) {
    return fmtMoney(n, currency);
  }

  function handleCreateAccount(nameInput, storeInput, businessTypeInput, phoneInput) {
    if (!nameInput.trim()) return;
    const businessType = businessTypeInput.trim() || "General Trade";
    const presets = generateBusinessPresets(businessType);
    const newProfile = {
      ownerName: nameInput.trim(),
      storeName: storeInput.trim() || `${nameInput.trim()}'s ${businessType}`,
      businessType,
      phone: phoneInput.trim() || "072 000 0000",
      accessCode: "C2C-ZA-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
      walletBalance: INITIAL_WALLET,
    };
    setProfile(newProfile);
    setProducts(presets.items);
    setExpenseCategories(presets.expenseCategories);
    setTransactions(presets.starterTransactions);
    setIsLoggedIn(true);
  }

  function resetToFirstPage() {
    setLanguage(null);
    setProfile(null);
    setIsLoggedIn(false);
    setScreen("home");
    localStorage.removeItem("cash2cred_lang");
    localStorage.removeItem("cash2cred_profile");
    localStorage.removeItem("cash2cred:profile");
  }

  function goBackToLanguage() {
    setLanguage(null);
  }

  function goBackToRegistration() {
    setIsLoggedIn(false);
    setProfile(null);
  }

  function handleTopUp(amount) {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    setWallet((w) => w + val);
    setTopUpModal(false);
    setTopUpCustom("");
  }

  function logSaleItem(itemName, amountValue, qtyValue = 1) {
    const amt = parseFloat(amountValue);
    const trimmedName = (itemName || "").trim();
    if (!amt || !trimmedName) return;
    const qty = parseInt(qtyValue) || 1;
    const total = amt * qty;
    const newTx = {
      id: "tx-" + Date.now() + Math.random(),
      type: "sale",
      name: trimmedName,
      qty,
      amount: total,
      paymentMethod: "cash",
      ts: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    if (isOffline) {
      setOfflineQueueCount((prev) => {
        const next = prev + 1;
        localStorage.setItem("cash2cred_offline_queue", next.toString());
        return next;
      });
    }

    // Automatically append custom item to product catalog if not present
    setProducts((prevProducts) => {
      const exists = (prevProducts || []).some(
        (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (!exists) {
        const newProduct = {
          id: "i-" + Date.now() + Math.random(),
          name: trimmedName,
        };
        return [...prevProducts, newProduct];
      }
      return prevProducts;
    });
  }

  function logExpenseItem(categoryName, amountValue, notes = "") {
    const amt = parseFloat(amountValue);
    const trimmedCategory = (categoryName || "").trim();
    if (!amt || !trimmedCategory) return;
    const displayName = notes.trim() ? `${trimmedCategory} (${notes.trim()})` : trimmedCategory;
    const newTx = {
      id: "exp-" + Date.now() + Math.random(),
      type: "expense",
      name: displayName,
      qty: 1,
      amount: amt,
      ts: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    if (isOffline) {
      setOfflineQueueCount((prev) => {
        const next = prev + 1;
        localStorage.setItem("cash2cred_offline_queue", next.toString());
        return next;
      });
    }

    // Automatically append custom expense category if not present
    setExpenseCategories((prevCategories) => {
      const exists = (prevCategories || []).some(
        (c) => c.toLowerCase() === trimmedCategory.toLowerCase()
      );
      if (!exists) {
        return [...(prevCategories || []), trimmedCategory];
      }
      return prevCategories;
    });

    setExpenseModal(false);
    setExpenseTitle("");
    setExpenseAmount("");
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
    const amt = parseFloat(item.amount) || 54;
    const qty = parseInt(item.qty, 10) || 3;
    const name = (item.name || "Albany Superior Bread").trim();
    const newTx = {
      id: "tx-voice-" + Date.now(),
      type: "sale",
      name,
      qty,
      amount: amt,
      source: "voice",
      paymentMethod: "cash",
      ts: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    if (isOffline) {
      setOfflineQueueCount((prev) => {
        const next = prev + 1;
        localStorage.setItem("cash2cred_offline_queue", next.toString());
        return next;
      });
    }

    setVoiceTallyModal(false);
  }

  function logSale(prod, qty, customPrice) {
    const unitPrice = customPrice !== undefined ? parseFloat(customPrice) : (prod.price || 0);
    logSaleItem(prod.name, unitPrice, qty);
    setSaleModal(null);
  }

  function quickLogSale(prod, amountValue) {
    logSaleItem(prod.name, amountValue || 50);
  }

  function logCustomSale() {
    const amt = parseFloat(customSaleAmount);
    if (!amt || !customSaleName.trim()) return;
    logSaleItem(customSaleName.trim(), amt, 1);
    setCustomSaleModal(false);
    setCustomSaleName("");
    setCustomSaleAmount("");
  }

  function logExpense() {
    const amt = parseFloat(expenseAmount);
    if (!amt || !expenseTitle.trim()) return;
    logExpenseItem(expenseTitle.trim(), amt);
  }

  function confirmRestock() {
    if (!restockModal) return;
    setProducts(products.map((p) => (p.id === restockModal.id ? { ...p, stock: (p.stock || 0) + restockQty } : p)));
    setRestockModal(null);
  }

  // Snap-Log Functions
  function handleSnapLogFileSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setSnapLogImage(evt.target.result);
        handleSnapLogUpload();
      };
      reader.readAsDataURL(file);
    } else {
      handleSnapLogUpload();
    }
  }

  function handleSnapLogUpload() {
    setSnapLogStep("parsing");
    setSnapLogProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setSnapLogProgress(Math.min(100, progress));
      if (progress >= 100) {
        clearInterval(interval);
        simulateExtraction();
      }
    }, 150);
  }

  function simulateExtraction() {
    setTimeout(() => {
      const presets = generateBusinessPresets(profile?.businessType);
      setExtractedTransactions(presets.simulatedOcr);
      setSnapLogStep("review");
    }, 400);
  }

  function addSnapLogLineItem() {
    setExtractedTransactions((prev) => [
      ...prev,
      {
        id: "ext-" + Date.now() + Math.random(),
        type: "sale",
        name: "Custom Service Item",
        qty: 1,
        amount: 100.0,
        editable: true,
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
    const newTransactions = extractedTransactions.map((tx) => ({
      id: "tx-" + Date.now() + Math.random(),
      type: tx.type,
      name: tx.name,
      qty: parseFloat(tx.qty) || 1,
      amount: parseFloat(tx.amount) || 0,
      ts: Date.now(),
    }));

    setTransactions((prev) => [...newTransactions, ...prev]);
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
Store Name:     ${profile?.storeName || "N/A"}
Owner Name:     ${profile?.ownerName || "N/A"}
Mobile Number:  ${profile?.phone || "N/A"}
Business Type:  ${(profile?.businessType || "").toUpperCase()}
Access Code:    ${profile?.accessCode || "N/A"}
Statement Date: ${new Date().toLocaleDateString()}
--------------------------------------
FINANCIAL PERFORMANCE SUMMARY (${currency}):
Total Turnover:          ${fmt(totalRevenue)}
Total Operating Expense:  ${fmt(totalExpenses)}
Net Retained Profit:     ${fmt(netProfit)}
Net Profit Margin:       ${margin}%
--------------------------------------
GROWTH READINESS AUDIT:
Overall Readiness Score: ${growthScore}/100
Active Days Recorded:    ${activeDays} Days
Active Recording Streak:  ${activeStreak} Days
Total Ledger Entries:    ${transactions.length} Records
--------------------------------------
PRE-APPROVED CREDIT PARTNERS SHARED:
${sharedPartners || "None (Access restricted by merchant)"}
======================================
Verify authenticity at cash2cred.co.za/verify/${profile?.accessCode || ""}`;
  }

  // Financial computations
  const totalRevenue = transactions.filter((t) => t.type === "sale").reduce((acc, c) => acc + (c.amount || 0), 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((acc, c) => acc + (c.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const margin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;
  const activeDays = new Set(transactions.map((t) => new Date(t.ts).toDateString())).size;
  const activeStreak = computeActiveStreak(transactions);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartTs = todayStart.getTime();
  const todayRevenue = transactions.filter((t) => t.type === "sale" && t.ts >= todayStartTs).reduce((acc, c) => acc + (c.amount || 0), 0);
  const todayExpenses = transactions.filter((t) => t.type === "expense" && t.ts >= todayStartTs).reduce((acc, c) => acc + (c.amount || 0), 0);
  const todayNetProfit = todayRevenue - todayExpenses;

  const growthFactors = [
    { name: t("recordConsistencyScore"), value: Math.min(30, activeStreak * 10), max: 30 },
    { name: t("businessStability"), value: Math.min(25, transactions.length * 2), max: 25 },
    { name: t("revenueProfitTrends"), value: margin > 15 ? 25 : Math.min(25, Math.max(0, margin)), max: 25 },
    { name: t("recordCompleteness"), value: Math.min(20, transactions.length * 3), max: 20 },
  ];
  const growthScore = growthFactors.reduce((sum, f) => sum + f.value, 0);
  const activeJourneyStep = Math.min(JOURNEY_STEPS.length - 1, Math.max(0, Math.floor(growthScore / 17)));

  const value = {
    language,
    setLanguage,
    profile,
    setProfile,
    wallet,
    setWallet,
    isLoggedIn,
    setIsLoggedIn,
    currency,
    setCurrency,
    products,
    setProducts,
    expenseCategories,
    setExpenseCategories,
    transactions,
    setTransactions,
    partnersAccess,
    setPartnersAccess,
    screen,
    setScreen,
    reviewPeriod,
    setReviewPeriod,

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

    snapLogStep,
    setSnapLogStep,
    snapLogProgress,
    setSnapLogProgress,
    snapLogImage,
    setSnapLogImage,
    extractedTransactions,
    setExtractedTransactions,

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

    isPremium,
    setIsPremium,
    subscriptionModal,
    setSubscriptionModal,

    voiceTallyModal,
    setVoiceTallyModal,
    confirmVoiceTally,

    isOffline,
    setIsOffline,
    toggleOffline,
    offlineQueueCount,
    syncNotification,
    setSyncNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
