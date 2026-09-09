export const COLORS = {
  surface: "#FFFFFF",
  surfaceSubtle: "#F8FAFC",
  slateDeep: "#152449",
  slateSoft: "#5B6B85",
  slateLight: "#94A3B8",
  blueTrust: "#1D4ED8",
  blueAccent: "#2B6CD4",
  blueSoft: "#EFF6FF",
  border: "#E2E8F0",
  borderFocus: "#D9E6F5",
  cardBg: "#FFFFFF",
  // Backward-compatible color mapping strictly mapped to the 3-color scheme
  ink: "#152449",
  inkSoft: "#5B6B85",
  inkFaint: "#94A3B8",
  primary: "#2B6CD4",
  primaryDark: "#1D4ED8",
  primarySoft: "#EFF6FF",
  graniteWhite: "#F8FAFC",
  graniteBorder: "#E2E8F0",
  success: "#1D4ED8",
  successSoft: "#EFF6FF",
  danger: "#152449",
  dangerSoft: "#F1F5F9",
};

export const GRADIENT_BG = "#FFFFFF";
export const GRADIENT_HEADER = "#152449";

export const LOGIN_FEE = 0.00;
export const INITIAL_WALLET = 20.00;

export const BUSINESS_SUGGESTION_CHIPS = [
  "Salon",
  "Spaza",
  "Car Wash",
  "Food Stall",
  "Street Vendor",
  "Mechanic",
  "Bakery",
  "Tailor",
];

export function generateBusinessPresets(businessTypeStr = "") {
  const query = (businessTypeStr || "").toLowerCase().trim();

  if (
    query.includes("hair") ||
    query.includes("salon") ||
    query.includes("beauty") ||
    query.includes("nail") ||
    query.includes("barber")
  ) {
    return {
      items: [
        { id: "i1", name: "Box Braids", price: 350.0, stock: 12, minStock: 5 },
        { id: "i2", name: "Wash & Set", price: 120.0, stock: 20, minStock: 5 },
        { id: "i3", name: "Hair Relaxer & Treatment", price: 180.0, stock: 8, minStock: 3 },
        { id: "i4", name: "Cornrows", price: 150.0, stock: 15, minStock: 5 },
        { id: "i5", name: "Nail Gel Set", price: 200.0, stock: 10, minStock: 4 },
        { id: "i6", name: "Wig Install", price: 300.0, stock: 6, minStock: 2 },
      ],
      expenseCategories: [
        "Hair Bundles & Extensions",
        "Relaxer & Shampoo Stock",
        "Salon Electricity Voucher",
        "Salon Rent",
      ],
      starterTransactions: [
        { id: "t1", type: "sale", name: "Box Braids", qty: 1, amount: 350.0, ts: Date.now() - 3600000 * 2 },
        { id: "t2", type: "expense", name: "Hair Bundles & Extensions", qty: 1, amount: 180.0, ts: Date.now() - 3600000 * 5 },
      ],
      simulatedOcr: [
        { id: "ext-1", type: "sale", name: "Box Braids", qty: 1, amount: 350.0, editable: true },
        { id: "ext-2", type: "expense", name: "Hair Bundles & Extensions", qty: 1, amount: 180.0, editable: true },
      ],
    };
  }

  if (
    query.includes("car") ||
    query.includes("wash") ||
    query.includes("auto") ||
    query.includes("mechanic")
  ) {
    return {
      items: [
        { id: "i1", name: "Full Body Wash", price: 100.0, stock: 25, minStock: 5 },
        { id: "i2", name: "Interior Vacuum & Tyre Polish", price: 80.0, stock: 18, minStock: 5 },
        { id: "i3", name: "Engine Clean", price: 120.0, stock: 10, minStock: 3 },
        { id: "i4", name: "Call-out Diagnostic & Labor", price: 250.0, stock: 5, minStock: 2 },
      ],
      expenseCategories: [
        "Bulk Car Shampoo",
        "Pressure Hose Spares",
        "Water & Electricity Token",
      ],
      starterTransactions: [
        { id: "t1", type: "sale", name: "Full Wash & Polish", qty: 1, amount: 150.0, ts: Date.now() - 3600000 * 2 },
        { id: "t2", type: "expense", name: "Car Wax & Chemicals", qty: 1, amount: 75.0, ts: Date.now() - 3600000 * 5 },
      ],
      simulatedOcr: [
        { id: "ext-1", type: "sale", name: "Full Wash & Polish", qty: 1, amount: 150.0, editable: true },
        { id: "ext-2", type: "expense", name: "Car Wax & Chemicals", qty: 1, amount: 75.0, editable: true },
      ],
    };
  }

  if (
    query.includes("food") ||
    query.includes("kota") ||
    query.includes("restaurant") ||
    query.includes("shisanyama") ||
    query.includes("cook") ||
    query.includes("bakery") ||
    query.includes("spaza")
  ) {
    return {
      items: [
        { id: "spz-1", name: "Iwisa Maize Meal 10kg", price: 115.0, stock: 18, minStock: 10 },
        { id: "spz-2", name: "Sunfoil Cooking Oil 2L", price: 75.0, stock: 8, minStock: 10 },
        { id: "spz-3", name: "Albany Superior White Bread", price: 18.5, stock: 24, minStock: 10 },
        { id: "spz-4", name: "Coca-Cola 1.25L", price: 22.0, stock: 12, minStock: 10 },
      ],
      expenseCategories: [
        "Iwisa & Flour Bulk Order",
        "Sunfoil Oil Restock",
        "Electricity Token",
        "Stock Delivery Transport",
      ],
      starterTransactions: [
        { id: "t1", type: "sale", name: "Iwisa Maize Meal 10kg", qty: 1, amount: 115.0, ts: Date.now() - 3600000 * 2 },
        { id: "t2", type: "sale", name: "Albany Superior White Bread", qty: 2, amount: 37.0, ts: Date.now() - 3600000 * 1 },
        { id: "t3", type: "expense", name: "Stock Delivery Transport", qty: 1, amount: 75.0, ts: Date.now() - 3600000 * 5 },
      ],
      simulatedOcr: [
        { id: "ext-1", type: "sale", name: "Iwisa Maize Meal 10kg", qty: 1, amount: 115.0, editable: true },
        { id: "ext-2", type: "expense", name: "Stock Delivery Transport", qty: 1, amount: 75.0, editable: true },
      ],
    };
  }

  if (
    query.includes("fruit") ||
    query.includes("veg") ||
    query.includes("street") ||
    query.includes("vendor") ||
    query.includes("market")
  ) {
    return {
      items: [
        { id: "i1", name: "Bowl of Tomatoes", price: 20.0, stock: 35, minStock: 10 },
        { id: "i2", name: "Banana Bunch", price: 15.0, stock: 25, minStock: 8 },
        { id: "i3", name: "Bag of Oranges", price: 25.0, stock: 20, minStock: 6 },
        { id: "i4", name: "Pocket of Potatoes", price: 55.0, stock: 15, minStock: 4 },
        { id: "i5", name: "Peanuts Packet", price: 10.0, stock: 45, minStock: 12 },
      ],
      expenseCategories: [
        "Wholesale Market Stock Box",
        "Bakkie / Taxi Transport Hire",
        "Plastic Packing Bags",
      ],
      starterTransactions: [
        { id: "t1", type: "sale", name: "Daily Street Sales", qty: 1, amount: 520.0, ts: Date.now() - 3600000 * 2 },
        { id: "t2", type: "expense", name: "Wholesale Market Stock", qty: 1, amount: 200.0, ts: Date.now() - 3600000 * 5 },
      ],
      simulatedOcr: [
        { id: "ext-1", type: "sale", name: "Daily Street Sales", qty: 1, amount: 520.0, editable: true },
        { id: "ext-2", type: "expense", name: "Wholesale Market Stock", qty: 1, amount: 200.0, editable: true },
      ],
    };
  }

  if (
    query.includes("tailor") ||
    query.includes("sew") ||
    query.includes("clothing") ||
    query.includes("fashion")
  ) {
    return {
      items: [
        { id: "i1", name: "Dress Alteration", price: 90.0, stock: 15, minStock: 3 },
        { id: "i2", name: "Custom Traditional Attire", price: 450.0, stock: 6, minStock: 2 },
        { id: "i3", name: "Hemming & Zips", price: 40.0, stock: 25, minStock: 5 },
        { id: "i4", name: "Curtain Fitting", price: 150.0, stock: 8, minStock: 2 },
      ],
      expenseCategories: [
        "Fabric & Cotton Rolls",
        "Sewing Machine Needles",
        "Transport to Fabric Wholesaler",
      ],
      starterTransactions: [
        { id: "t1", type: "sale", name: "Custom Traditional Attire", qty: 1, amount: 450.0, ts: Date.now() - 3600000 * 2 },
        { id: "t2", type: "expense", name: "Fabric & Cotton Rolls", qty: 1, amount: 150.0, ts: Date.now() - 3600000 * 5 },
      ],
      simulatedOcr: [
        { id: "ext-1", type: "sale", name: "Custom Traditional Attire", qty: 1, amount: 450.0, editable: true },
        { id: "ext-2", type: "expense", name: "Fabric & Cotton Rolls", qty: 1, amount: 150.0, editable: true },
      ],
    };
  }

  // Default Trade Presets
  return {
    items: [
      { id: "i1", name: "Standard Service", price: 150.0, stock: 20, minStock: 5 },
      { id: "i2", name: "Custom Order", price: 250.0, stock: 10, minStock: 3 },
      { id: "i3", name: "Quick Sale Item", price: 50.0, stock: 30, minStock: 8 },
      { id: "i4", name: "Repair / Maintenance Job", price: 200.0, stock: 8, minStock: 2 },
    ],
    expenseCategories: [
      "Raw Materials & Stock",
      "Transport Fee",
      "Tool Maintenance",
    ],
    starterTransactions: [
      { id: "t1", type: "sale", name: "Custom Client Order", qty: 1, amount: 400.0, ts: Date.now() - 3600000 * 2 },
      { id: "t2", type: "expense", name: "Raw Materials & Stock", qty: 1, amount: 120.0, ts: Date.now() - 3600000 * 5 },
    ],
    simulatedOcr: [
      { id: "ext-1", type: "sale", name: "Custom Client Order", qty: 1, amount: 400.0, editable: true },
      { id: "ext-2", type: "expense", name: "Raw Materials & Stock", qty: 1, amount: 120.0, editable: true },
    ],
  };
}

export const JOURNEY_STEPS = [
  { num: "01", key: "cashActivity" },
  { num: "02", key: "record" },
  { num: "03", key: "structure" },
  { num: "04", key: "understand" },
  { num: "05", key: "financialIdentityJourney" },
  { num: "06", key: "growthReady" },
];

export const PARTNERS = [
  { id: "a1", name: "Thusong Microfinance", type: "Micro-Lender", minScore: 60 },
  { id: "a2", name: "Vuka Enterprise Fund", type: "Growth Capital", minScore: 75 },
  { id: "a3", name: "Kopano Wholesale Credit", type: "Stock Advance Partner", minScore: 50 },
  { id: "a4", name: "Ubuntu Cover", type: "Commercial Insurer", minScore: 40 },
];

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "zu", label: "isiZulu" },
  { code: "xh", label: "isiXhosa" },
  { code: "af", label: "Afrikaans" },
  { code: "st", label: "Sesotho" },
  { code: "nso", label: "Sepedi" },
  { code: "ve", label: "Tshivenda" },
];

export const CURRENCIES = {
  ZAR: { symbol: "R", code: "ZAR", label: "South African Rand (R)" },
  USD: { symbol: "$", code: "USD", label: "US Dollar ($)" },
  KES: { symbol: "KSh", code: "KES", label: "Kenyan Shilling (KSh)" },
  NGN: { symbol: "₦", code: "NGN", label: "Nigerian Naira (₦)" },
};

export function computeActiveStreak(transactions) {
  if (!transactions.length) return 0;
  const daySet = new Set(transactions.map((tx) => new Date(tx.ts).toDateString()));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!daySet.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (daySet.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function fmtMoney(n, currencyCode = "ZAR") {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.ZAR;
  return curr.symbol + (Math.round((n || 0) * 100) / 100).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
