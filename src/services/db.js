/**
 * Cash2Cred Adaptive LocalStorage Database Engine
 * Designed for ANY informal merchant / township micro-enterprise in South Africa
 * Zero hardcoded sectors, zero fixed prices - 100% trader configured.
 */

export const STORAGE_KEYS = {
  PROFILE: "c2c_profile",
  CATALOG: "c2c_catalog",
  INVENTORY: "c2c_catalog", // Backward-compatible alias
  TRANSACTIONS: "c2c_transactions",
  CONSENT: "c2c_consent",
  OCR_SCANS: "c2c_ocr_scans",
};

/**
 * 1. Default Universal Profile
 * Clean, sector-agnostic template
 */
export const DEFAULT_PROFILE = {
  businessName: "My Enterprise",
  name: "My Enterprise",
  ownerName: "Trader",
  owner: "Trader",
  category: "General Trade", // e.g., Street Food, Salon, Spaza, Fruit Vendor, Repair, Craft
  businessType: "General Trade",
  phone: "",
  openingFloat: 0.0,
  currency: "ZAR",
  isConfigured: false,
  subscriptionTier: "Growth Pro (R20/mo)",
  isPremium: true,
  passportCode: "C2C-ZA-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
  createdAt: new Date().toISOString(),
};

/**
 * 2. Default Starter Catalog Templates
 * Empty prices - trader defines their own products, services & pricing
 */
export const DEFAULT_CATALOG = [
  {
    id: "item-1",
    name: "Standard Service / Product",
    sellingPrice: 0,
    price: 0,
    costPrice: 0,
    cost: 0,
    stockQty: 0,
    stock: 0,
    minStock: 0,
    trackStock: false,
    category: "General",
  },
  {
    id: "item-2",
    name: "Custom Order / Daily Item",
    sellingPrice: 0,
    price: 0,
    costPrice: 0,
    cost: 0,
    stockQty: 0,
    stock: 0,
    minStock: 0,
    trackStock: false,
    category: "General",
  },
];

/**
 * 3. Default POPIA Consent Preferences
 */
export const DEFAULT_CONSENT = {
  shareWithLenders: true,
  shareWithWholesalers: true,
  shareWithInsurers: false,
  shareTurnoverAggregate: true,
  shareStockFrequency: true,
  grantDirectAccess: false,
  updatedAt: new Date().toISOString(),
};

/**
 * Safe JSON parser with fallback
 */
function safeParse(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (err) {
    console.warn("Cash2Cred DB Parse Warning:", err);
    return fallback;
  }
}

/**
 * Automatic Default Naming by Category
 */
export function getDefaultBusinessNameForCategory(category) {
  if (!category) return "My Enterprise";
  const cat = String(category).toLowerCase().trim();
  if (cat.includes("salon") || cat.includes("hair") || cat.includes("beauty")) {
    return "My Salon Studio";
  }
  if (cat.includes("street") || cat.includes("food") || cat.includes("grill") || cat.includes("kota") || cat.includes("kitchen")) {
    return "My Corner Kitchen";
  }
  if (cat.includes("spaza") || cat.includes("tuckshop") || cat.includes("grocery")) {
    return "My Spaza Shop";
  }
  return "My Enterprise";
}

export const DEFAULT_BUSINESS_NAMES = [
  "My Enterprise",
  "My Salon Studio",
  "My Corner Kitchen",
  "My Spaza Shop",
  "Set Business Name",
  "",
];

export const db = {
  /**
   * ==========================================
   * 1. PROFILE MANAGEMENT (c2c_profile)
   * ==========================================
   */
  getProfile() {
    if (typeof window === "undefined") return DEFAULT_PROFILE;
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    const parsed = safeParse(stored, DEFAULT_PROFILE);
    const category = parsed?.category || parsed?.businessType || DEFAULT_PROFILE.category;
    let bName = parsed?.businessName || parsed?.storeName || parsed?.name;
    if (!bName || bName.trim() === "" || bName === "Set Business Name") {
      bName = getDefaultBusinessNameForCategory(category);
    }
    const subTier = parsed?.subscriptionTier === "free" ? "free" : (parsed?.subscriptionTier || "growth_pro");
    const isPrem = subTier === "growth_pro" || subTier === "Growth Pro (R20/mo)";
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      businessName: bName,
      storeName: bName,
      name: bName,
      category,
      businessType: category,
      subscriptionTier: subTier,
      isPremium: isPrem,
    };
  },

  saveProfile(profile) {
    if (typeof window === "undefined") return profile;
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const current = safeParse(stored, DEFAULT_PROFILE);

    const category = profile?.category || profile?.businessType || current?.category || DEFAULT_PROFILE.category;
    let bName = profile?.businessName !== undefined ? profile.businessName : (profile?.name || current?.businessName);

    const isCustom = profile?.isCustomName !== undefined
      ? Boolean(profile.isCustomName)
      : Boolean(bName && !DEFAULT_BUSINESS_NAMES.includes(bName.trim()));

    // Automatic Default Naming if not custom or blank
    if (!isCustom || !bName || bName.trim() === "" || bName === "Set Business Name") {
      bName = getDefaultBusinessNameForCategory(category);
    }

    const subTier = profile?.subscriptionTier !== undefined
      ? (profile.subscriptionTier === "free" ? "free" : "growth_pro")
      : (current?.subscriptionTier || "growth_pro");
    const isPrem = profile?.isPremium !== undefined ? Boolean(profile.isPremium) : (subTier === "growth_pro");

    const updated = {
      ...DEFAULT_PROFILE,
      ...current,
      ...profile,
      category,
      businessType: category,
      businessName: bName,
      storeName: bName,
      name: bName,
      ownerName: profile?.ownerName || profile?.owner || current?.ownerName || DEFAULT_PROFILE.ownerName,
      owner: profile?.ownerName || profile?.owner || current?.ownerName || DEFAULT_PROFILE.ownerName,
      isCustomName: isCustom,
      subscriptionTier: subTier,
      isPremium: isPrem,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  },

  upgradeSubscription(tier = "growth_pro") {
    const isPro = tier === "growth_pro" || tier === "Growth Pro (R20/mo)";
    const normalizedTier = isPro ? "growth_pro" : "free";
    const current = this.getProfile();
    const updated = this.saveProfile({
      ...current,
      subscriptionTier: normalizedTier,
      isPremium: isPro,
    });
    return updated;
  },

  /**
   * ==========================================
   * 2. CATALOG & INVENTORY (c2c_catalog)
   * ==========================================
   */
  getCatalog() {
    if (typeof window === "undefined") return DEFAULT_CATALOG;
    const stored =
      localStorage.getItem(STORAGE_KEYS.CATALOG) ||
      localStorage.getItem("c2c_inventory");
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(DEFAULT_CATALOG));
      return DEFAULT_CATALOG;
    }
    const parsed = safeParse(stored, DEFAULT_CATALOG);
    return Array.isArray(parsed) ? parsed : DEFAULT_CATALOG;
  },

  getInventory() {
    return this.getCatalog();
  },

  saveCatalog(items) {
    if (typeof window === "undefined") return items;
    const safeItems = Array.isArray(items) ? items : DEFAULT_CATALOG;
    // Normalize properties for dual compatibility
    const normalized = safeItems.map((item) => ({
      ...item,
      price: item.sellingPrice !== undefined ? item.sellingPrice : item.price || 0,
      sellingPrice: item.sellingPrice !== undefined ? item.sellingPrice : item.price || 0,
      cost: item.costPrice !== undefined ? item.costPrice : item.cost || 0,
      costPrice: item.costPrice !== undefined ? item.costPrice : item.cost || 0,
      stock: item.stockQty !== undefined ? item.stockQty : item.stock || 0,
      stockQty: item.stockQty !== undefined ? item.stockQty : item.stock || 0,
    }));
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(normalized));
    localStorage.setItem("c2c_inventory", JSON.stringify(normalized));
    return normalized;
  },

  saveInventory(items) {
    return this.saveCatalog(items);
  },

  addCatalogItem(item) {
    const current = this.getCatalog();
    const sellingPrice = parseFloat(item.sellingPrice || item.price) || 0;
    const costPrice = parseFloat(item.costPrice || item.cost) || 0;
    const isProduct = item.itemType ? item.itemType === "product" : (item.trackStock !== undefined ? Boolean(item.trackStock) : true);
    const stockQty = isProduct ? (parseInt(item.stockQty || item.stock, 10) || 0) : 0;
    const threshold = parseInt(item.lowStockThreshold || item.minStock || 5, 10);

    const newItem = {
      id: item.id || "item-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      name: (item.name || "New Item").trim(),
      itemType: isProduct ? "product" : "service",
      sellingPrice,
      price: sellingPrice,
      costPrice,
      cost: costPrice,
      stockQty,
      stock: stockQty,
      lowStockThreshold: threshold,
      minStock: threshold,
      trackStock: isProduct,
      category: item.category || "General",
    };

    const updated = [...current, newItem];
    this.saveCatalog(updated);
    return newItem;
  },

  updateCatalogItem(id, updates) {
    const current = this.getCatalog();
    const updated = current.map((it) => (it.id === id ? { ...it, ...updates } : it));
    this.saveCatalog(updated);
    return updated.find((it) => it.id === id);
  },

  deleteCatalogItem(id) {
    const current = this.getCatalog();
    const filtered = current.filter((it) => it.id !== id);
    this.saveCatalog(filtered);
    return filtered;
  },

  /**
   * ==========================================
   * 3. TRANSACTIONS LEDGER (c2c_transactions)
   * ==========================================
   */
  getTransactions() {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!stored) {
      return [];
    }
    const parsed = safeParse(stored, []);
    return Array.isArray(parsed) ? parsed : [];
  },

  saveTransactions(txs) {
    if (typeof window === "undefined") return txs;
    const safeTxs = Array.isArray(txs) ? txs : [];
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(safeTxs));
    return safeTxs;
  },

  /**
   * Log Sale:
   * Record dynamic sales with margin calculation: margin = (amount - cost)
   */
  logSale(param1, param2, param3) {
    let description = "Cash Sale";
    let amount = 0;
    let cost = 0;
    let qty = 1;
    let paymentMethod = "cash";

    if (typeof param1 === "object" && param1 !== null) {
      description = param1.description || param1.name || "Cash Sale";
      amount = parseFloat(param1.amount || param1.sellingPrice || param1.price) || 0;
      cost = parseFloat(param1.cost || param1.costPrice) || 0;
      qty = parseInt(param1.qty, 10) || 1;
      paymentMethod = param1.paymentMethod || "cash";
    } else {
      description = String(param1 || "Cash Sale").trim();
      amount = parseFloat(param2) || 0;
      cost = parseFloat(param3) || 0;
    }

    const margin = amount - cost;
    const nowISO = new Date().toISOString();
    const nowTs = Date.now();

    const newTx = {
      id: "sale-" + nowTs + "-" + Math.random().toString(36).substring(2, 6),
      type: "sale",
      amount,
      cost,
      margin,
      description,
      name: description, // backward compatibility
      qty,
      paymentMethod,
      date: nowISO,
      ts: nowTs, // backward compatibility
      source: "pos",
    };

    const currentTxs = this.getTransactions();
    const updated = [newTx, ...currentTxs];
    this.saveTransactions(updated);
    return newTx;
  },

  /**
   * Log Expense:
   * Record operational costs: margin = -amount
   */
  logExpense(param1, param2, param3) {
    let description = "Operating Expense";
    let amount = 0;
    let category = "General";
    let paymentMethod = "cash";

    if (typeof param1 === "object" && param1 !== null) {
      description = param1.description || param1.name || "Operating Expense";
      amount = parseFloat(param1.amount) || 0;
      category = param1.category || "General";
      paymentMethod = param1.paymentMethod || "cash";
    } else {
      description = String(param1 || "Operating Expense").trim();
      amount = parseFloat(param2) || 0;
      category = String(param3 || "General").trim();
    }

    const nowISO = (typeof param1 === "object" && param1?.date) ? param1.date : new Date().toISOString();
    const nowTs = new Date(nowISO).getTime() || Date.now();

    const newTx = {
      id: "exp-" + nowTs + "-" + Math.random().toString(36).substring(2, 6),
      type: "expense",
      amount,
      cost: amount,
      margin: -amount,
      description,
      name: description, // backward compatibility
      category,
      qty: 1,
      paymentMethod,
      date: nowISO,
      ts: nowTs, // backward compatibility
      source: "manual",
    };

    const currentTxs = this.getTransactions();
    const updated = [newTx, ...currentTxs];
    this.saveTransactions(updated);
    return newTx;
  },

  /**
   * Log Batch Transactions:
   * Efficiently writes multiple sales and expenses into the ledger in a single atomic update.
   */
  logTransactionBatch(items) {
    if (!Array.isArray(items) || items.length === 0) return [];
    const nowTs = Date.now();
    const currentTxs = this.getTransactions();
    const newTxs = [];

    items.forEach((item, idx) => {
      const isExpense = item.type === "expense";
      const amount = parseFloat(item.amount) || 0;
      if (amount <= 0) return;
      const desc = (item.description || item.name || (isExpense ? "Scanned Expense" : "Scanned Sale")).trim();
      const qty = parseInt(item.qty, 10) || 1;
      const cost = isExpense ? amount : (parseFloat(item.cost) || 0);
      const margin = isExpense ? -amount : (amount - cost);
      const date = item.date || new Date(nowTs - idx * 1000).toISOString();

      newTxs.push({
        id: (isExpense ? "exp-" : "sale-") + (nowTs + idx) + "-" + Math.random().toString(36).substring(2, 6),
        type: isExpense ? "expense" : "sale",
        amount,
        cost,
        margin,
        description: desc,
        name: desc,
        category: item.category || (isExpense ? "Counter Slip OCR" : "General"),
        qty,
        paymentMethod: item.paymentMethod || "cash",
        date,
        ts: new Date(date).getTime() || (nowTs + idx),
        source: "snap_log_ocr",
      });
    });

    if (newTxs.length > 0) {
      const updated = [...newTxs, ...currentTxs];
      this.saveTransactions(updated);
    }
    return newTxs;
  },

  /**
   * ==========================================
   * 4. UNDERWRITING & CASH TELEMETRY
   * ==========================================
   */
  calculateMetrics() {
    const txs = this.getTransactions();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    let todayMoneyIn = 0;
    let todayMoneyOut = 0;
    let thirtyDayTurnover = 0;
    let totalSalesEver = 0;

    txs.forEach((tx) => {
      const amt = parseFloat(tx.amount) || 0;
      const txTime = tx.ts || (tx.date ? new Date(tx.date).getTime() : 0);
      const isToday = txTime >= startOfToday;
      const isLast30Days = txTime >= thirtyDaysAgo;

      if (tx.type === "sale") {
        totalSalesEver += amt;
        if (isToday) todayMoneyIn += amt;
        if (isLast30Days) thirtyDayTurnover += amt;
      } else if (tx.type === "expense") {
        if (isToday) todayMoneyOut += amt;
      }
    });

    const netRetained = todayMoneyIn - todayMoneyOut;
    const grossMarginPercent =
      todayMoneyIn > 0 ? Math.round((netRetained / todayMoneyIn) * 100) : 0;

    // Calculate unique active trading days for streak
    const activeDates = new Set(
      txs.map((tx) => {
        const txTime = tx.ts || (tx.date ? new Date(tx.date).getTime() : Date.now());
        const d = new Date(txTime);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      })
    );
    const activeStreak = Math.max(activeDates.size, txs.length > 0 ? 1 : 0);

    /**
     * Growth Readiness Score (0 - 100):
     * - Baseline: 40/100 for newly registered accounts
     * - +2 points per recorded transaction
     * - +10 points for a positive profit margin (or profitable trading history)
     * - +5 points per active daily streak day
     * - Capped at 100
     */
    let score = 40;
    score += txs.length * 2;
    if (netRetained > 0 || grossMarginPercent > 0) {
      score += 10;
    }
    score += activeStreak * 5;
    const growthReadinessScore = Math.min(100, Math.max(0, score));

    // Status bands:
    // <60: "Building Profile", 60-74: "Emerging Trader", 75+: "Bankable / Pre-Approved"
    let statusBand = "Building Profile";
    if (growthReadinessScore >= 75) {
      statusBand = "Bankable / Pre-Approved";
    } else if (growthReadinessScore >= 60) {
      statusBand = "Emerging Trader";
    }

    return {
      todayMoneyIn,
      todayMoneyOut,
      netRetained,
      todayNetRetained: netRetained,
      grossMarginPercent,
      todayMargin: grossMarginPercent,
      netMarginPercent: grossMarginPercent, // backward-compatibility
      thirtyDayTurnover,
      totalSalesEver,
      growthReadinessScore,
      growthScore: growthReadinessScore, // backward-compatibility
      statusBand,
      isBankable: growthReadinessScore >= 60,
      activeStreak,
      totalTransactions: txs.length,

      // Pre-formatted ZAR display strings
      formattedMoneyIn: `+R${todayMoneyIn.toFixed(2).replace(".", ",")}`,
      formattedMoneyOut: `-R${todayMoneyOut.toFixed(2).replace(".", ",")}`,
      formattedNetRetained: `${netRetained >= 0 ? "+" : "-"}R${Math.abs(netRetained).toFixed(2).replace(".", ",")}`,
      formattedTurnover: `R${thirtyDayTurnover.toFixed(2).replace(".", ",")}`,
    };
  },

  // Alias for backward compatibility
  calculateUnderwritingMetrics() {
    return this.calculateMetrics();
  },

  /**
   * ==========================================
   * 5. POPIA CONSENT PREFERENCES (c2c_consent)
   * ==========================================
   */
  getConsent() {
    if (typeof window === "undefined") return DEFAULT_CONSENT;
    const stored = localStorage.getItem(STORAGE_KEYS.CONSENT);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(DEFAULT_CONSENT));
      return DEFAULT_CONSENT;
    }
    const parsed = safeParse(stored, DEFAULT_CONSENT);
    return { ...DEFAULT_CONSENT, ...parsed };
  },

  saveConsent(consent) {
    if (typeof window === "undefined") return consent;
    const stored = localStorage.getItem(STORAGE_KEYS.CONSENT);
    const current = safeParse(stored, DEFAULT_CONSENT);
    const updated = {
      ...DEFAULT_CONSENT,
      ...current,
      ...consent,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(updated));
    return updated;
  },

  /**
   * ==========================================
   * 6. DAILY OCR SCANS QUOTA (c2c_ocr_scans)
   * ==========================================
   */
  getDailyOcrScansCount() {
    if (typeof window === "undefined") return 0;
    const todayStr = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem(STORAGE_KEYS.OCR_SCANS);
    if (!stored) return 0;
    const parsed = safeParse(stored, null);
    if (parsed && parsed.date === todayStr) {
      return parseInt(parsed.count, 10) || 0;
    }
    return 0;
  },

  incrementOcrScansCount() {
    if (typeof window === "undefined") return 1;
    const todayStr = new Date().toISOString().split("T")[0];
    const current = this.getDailyOcrScansCount();
    const next = current + 1;
    localStorage.setItem(
      STORAGE_KEYS.OCR_SCANS,
      JSON.stringify({ date: todayStr, count: next })
    );
    return next;
  },

  /**
   * Reset database back to clean empty-state template
   */
  resetDatabase() {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(DEFAULT_CATALOG));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(DEFAULT_CONSENT));
    localStorage.removeItem(STORAGE_KEYS.OCR_SCANS);
    return {
      profile: DEFAULT_PROFILE,
      catalog: DEFAULT_CATALOG,
      transactions: [],
      consent: DEFAULT_CONSENT,
    };
  },
};

export default db;
