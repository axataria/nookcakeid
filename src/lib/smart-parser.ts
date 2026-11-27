import { FINANCIAL_MASTER } from "@/lib/finance";

export interface CorrectionNote {
  original: string;
  correctedTo: string;
}

export interface RestockItem {
  materialId?: string;
  materialName: string;
  baseUnit: "GRAM" | "PIECE" | "ML";
  packSize: number;
  packCount: number;
  quantityAdded: number;
  totalPrice: number;
  unitCost: number;
}

export type ParsedAction =
  | {
      type: "ORDER";
      customerName: string;
      slotDate: string;
      slotLabel: string;
      status?: "CONFIRMED_SLOT" | "DELIVERED";
      isHistorical?: boolean;
      items: {
        sku: string;
        productName: string;
        quantity: number;
        unitPrice: number;
      }[];
      totalAmount: number;
      corrections: CorrectionNote[];
    }
  | ({
      type: "RESTOCK";
      corrections: CorrectionNote[];
    } & RestockItem)
  | {
      type: "RESTOCK_BATCH";
      items: RestockItem[];
      totalPrice: number;
      corrections: CorrectionNote[];
    }
  | {
      type: "ORDER_STATUS";
      target: string;
      nextStatus: "CONFIRMED_SLOT" | "BAKING" | "READY_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
      statusLabel: string;
      corrections: CorrectionNote[];
    }
  | {
      type: "OPEX";
      name: string;
      amount: number;
      corrections: CorrectionNote[];
    }
  | {
      type: "EQUITY";
      name: string;
      amount: number;
      corrections: CorrectionNote[];
    }
  | {
      type: "QUERY";
      queryKind: "STOCK" | "PROFIT" | "TOMORROW" | "BEP" | "PREP";
      corrections: CorrectionNote[];
    }
  | {
      type: "UNKNOWN";
      rawText: string;
      hint: string;
    };

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array<number>(n + 1).fill(0),
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  return dp[m][n];
}

function getDateOffset(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().slice(0, 10);
}

function parseShorthandPrice(token: string): number | null {
  const clean = token.toLowerCase().replace(/^rp\.?/i, "").replace(/[.,](?=\d{3})/g, "");
  const mRb = clean.match(/^(\d+(?:\.\d+)?)(?:rb|k)$/);
  if (mRb) return Math.round(parseFloat(mRb[1]) * 1000);
  const mJt = clean.match(/^(\d+(?:\.\d+)?)(?:jt|juta)$/);
  if (mJt) return Math.round(parseFloat(mJt[1]) * 1000000);
  if (/^\d{4,9}$/.test(clean)) return parseInt(clean, 10);
  return null;
}

const PRODUCT_KEYWORDS: {
  keyword: string;
  sku: string;
  productName: string;
  unitPrice: number;
}[] = [
  { keyword: "whole", sku: "CAKE-WHOLE-18CM", productName: "The Whole Basque", unitPrice: FINANCIAL_MASTER["CAKE-WHOLE-18CM"].sellingPrice },
  { keyword: "utuh", sku: "CAKE-WHOLE-18CM", productName: "The Whole Basque", unitPrice: FINANCIAL_MASTER["CAKE-WHOLE-18CM"].sellingPrice },
  { keyword: "loyang", sku: "CAKE-WHOLE-18CM", productName: "The Whole Basque", unitPrice: FINANCIAL_MASTER["CAKE-WHOLE-18CM"].sellingPrice },
  { keyword: "18cm", sku: "CAKE-WHOLE-18CM", productName: "The Whole Basque", unitPrice: FINANCIAL_MASTER["CAKE-WHOLE-18CM"].sellingPrice },
  { keyword: "bento", sku: "CAKE-BURNT-CORNER-10CM", productName: "The Burnt Corner", unitPrice: FINANCIAL_MASTER["CAKE-BURNT-CORNER-10CM"].sellingPrice },
  { keyword: "burnt", sku: "CAKE-BURNT-CORNER-10CM", productName: "The Burnt Corner", unitPrice: FINANCIAL_MASTER["CAKE-BURNT-CORNER-10CM"].sellingPrice },
  { keyword: "corner", sku: "CAKE-BURNT-CORNER-10CM", productName: "The Burnt Corner", unitPrice: FINANCIAL_MASTER["CAKE-BURNT-CORNER-10CM"].sellingPrice },
  { keyword: "ori", sku: "CAKE-BURNT-CORNER-10CM", productName: "The Burnt Corner", unitPrice: FINANCIAL_MASTER["CAKE-BURNT-CORNER-10CM"].sellingPrice },
  { keyword: "original", sku: "CAKE-BURNT-CORNER-10CM", productName: "The Burnt Corner", unitPrice: FINANCIAL_MASTER["CAKE-BURNT-CORNER-10CM"].sellingPrice },
  { keyword: "cheesecake", sku: "CAKE-BURNT-CORNER-10CM", productName: "The Burnt Corner", unitPrice: FINANCIAL_MASTER["CAKE-BURNT-CORNER-10CM"].sellingPrice },
  { keyword: "ciskek", sku: "CAKE-BURNT-CORNER-10CM", productName: "The Burnt Corner", unitPrice: FINANCIAL_MASTER["CAKE-BURNT-CORNER-10CM"].sellingPrice },
  { keyword: "10cm", sku: "CAKE-BURNT-CORNER-10CM", productName: "The Burnt Corner", unitPrice: FINANCIAL_MASTER["CAKE-BURNT-CORNER-10CM"].sellingPrice },
  { keyword: "matcha", sku: "CAKE-MATCHA-BASQUE-10CM", productName: "The Matcha Basque", unitPrice: FINANCIAL_MASTER["CAKE-MATCHA-BASQUE-10CM"].sellingPrice },
  { keyword: "greentea", sku: "CAKE-MATCHA-BASQUE-10CM", productName: "The Matcha Basque", unitPrice: FINANCIAL_MASTER["CAKE-MATCHA-BASQUE-10CM"].sellingPrice },
  { keyword: "zenlatte", sku: "CAKE-MATCHA-BASQUE-10CM", productName: "The Matcha Basque", unitPrice: FINANCIAL_MASTER["CAKE-MATCHA-BASQUE-10CM"].sellingPrice },
  { keyword: "choco", sku: "CAKE-CHOCO-BASQUE-10CM", productName: "The Choco Basque", unitPrice: FINANCIAL_MASTER["CAKE-CHOCO-BASQUE-10CM"].sellingPrice },
  { keyword: "coklat", sku: "CAKE-CHOCO-BASQUE-10CM", productName: "The Choco Basque", unitPrice: FINANCIAL_MASTER["CAKE-CHOCO-BASQUE-10CM"].sellingPrice },
  { keyword: "cokelat", sku: "CAKE-CHOCO-BASQUE-10CM", productName: "The Choco Basque", unitPrice: FINANCIAL_MASTER["CAKE-CHOCO-BASQUE-10CM"].sellingPrice },
  { keyword: "chocolatos", sku: "CAKE-CHOCO-BASQUE-10CM", productName: "The Choco Basque", unitPrice: FINANCIAL_MASTER["CAKE-CHOCO-BASQUE-10CM"].sellingPrice },
  { keyword: "ganache", sku: "SAUCE-CHOCOLATE-25ML", productName: "Chocolate Ganache (25ml)", unitPrice: FINANCIAL_MASTER["SAUCE-CHOCOLATE-25ML"].sellingPrice },
  { keyword: "strawberry", sku: "SAUCE-STRAWBERRY-25ML", productName: "Selai Strawberry (25ml)", unitPrice: FINANCIAL_MASTER["SAUCE-STRAWBERRY-25ML"].sellingPrice },
  { keyword: "stroberi", sku: "SAUCE-STRAWBERRY-25ML", productName: "Selai Strawberry (25ml)", unitPrice: FINANCIAL_MASTER["SAUCE-STRAWBERRY-25ML"].sellingPrice },
  { keyword: "selai", sku: "SAUCE-STRAWBERRY-25ML", productName: "Selai Strawberry (25ml)", unitPrice: FINANCIAL_MASTER["SAUCE-STRAWBERRY-25ML"].sellingPrice },
  { keyword: "saus", sku: "SAUCE-CHOCOLATE-25ML", productName: "Chocolate Ganache (25ml)", unitPrice: FINANCIAL_MASTER["SAUCE-CHOCOLATE-25ML"].sellingPrice },
];

const MATERIAL_KEYWORDS: {
  keyword: string;
  materialId: string;
  materialName: string;
  baseUnit: "GRAM" | "PIECE" | "ML";
}[] = [
  { keyword: "calf", materialId: "mat-calf", materialName: "Cream Cheese Calf", baseUnit: "GRAM" },
  { keyword: "keju", materialId: "mat-calf", materialName: "Cream Cheese Calf", baseUnit: "GRAM" },
  { keyword: "cheese", materialId: "mat-calf", materialName: "Cream Cheese Calf", baseUnit: "GRAM" },
  { keyword: "fibercreme", materialId: "mat-fibercreme", materialName: "FiberCreme Bubuk", baseUnit: "GRAM" },
  { keyword: "fiber", materialId: "mat-fibercreme", materialName: "FiberCreme Bubuk", baseUnit: "GRAM" },
  { keyword: "whipcream", materialId: "mat-fibercreme", materialName: "FiberCreme Bubuk", baseUnit: "GRAM" },
  { keyword: "telur", materialId: "mat-telur", materialName: "Telur Ayam Segar", baseUnit: "PIECE" },
  { keyword: "telor", materialId: "mat-telur", materialName: "Telur Ayam Segar", baseUnit: "PIECE" },
  { keyword: "egg", materialId: "mat-telur", materialName: "Telur Ayam Segar", baseUnit: "PIECE" },
  { keyword: "pondan", materialId: "mat-pondan", materialName: "Pondan Signature Brownie Mix", baseUnit: "PIECE" },
  { keyword: "brownies", materialId: "mat-pondan", materialName: "Pondan Signature Brownie Mix", baseUnit: "PIECE" },
  { keyword: "brownie", materialId: "mat-pondan", materialName: "Pondan Signature Brownie Mix", baseUnit: "PIECE" },
  { keyword: "gula", materialId: "mat-gula", materialName: "Gula Pasir", baseUnit: "GRAM" },
  { keyword: "maizena", materialId: "mat-maizena", materialName: "Tepung Maizena Hawaii", baseUnit: "GRAM" },
  { keyword: "hawaii", materialId: "mat-maizena", materialName: "Tepung Maizena Hawaii", baseUnit: "GRAM" },
  { keyword: "vanilla", materialId: "mat-vanilla", materialName: "Vanilla Bubuk Koepoe", baseUnit: "GRAM" },
  { keyword: "vanili", materialId: "mat-vanilla", materialName: "Vanilla Bubuk Koepoe", baseUnit: "GRAM" },
  { keyword: "koepoe", materialId: "mat-vanilla", materialName: "Vanilla Bubuk Koepoe", baseUnit: "GRAM" },
  { keyword: "garam", materialId: "mat-garam", materialName: "Garam Dapur", baseUnit: "GRAM" },
  { keyword: "matcha", materialId: "mat-matcha", materialName: "Zenlatte Matcha (Sachet)", baseUnit: "PIECE" },
  { keyword: "zenlatte", materialId: "mat-matcha", materialName: "Zenlatte Matcha (Sachet)", baseUnit: "PIECE" },
  { keyword: "chocolatos", materialId: "mat-chocolatos", materialName: "Chocolatos Drink (Sachet)", baseUnit: "PIECE" },
  { keyword: "coklat", materialId: "mat-chocolatos", materialName: "Chocolatos Drink (Sachet)", baseUnit: "PIECE" },
  { keyword: "choco", materialId: "mat-chocolatos", materialName: "Chocolatos Drink (Sachet)", baseUnit: "PIECE" },
  { keyword: "bento", materialId: "mat-box-bento", materialName: "Packaging Box Bento", baseUnit: "PIECE" },
  { keyword: "box", materialId: "mat-box-bento", materialName: "Packaging Box Bento", baseUnit: "PIECE" },
  { keyword: "pack", materialId: "mat-box-bento", materialName: "Packaging Box Bento", baseUnit: "PIECE" },
  { keyword: "sendok", materialId: "mat-sendok", materialName: "Sendok Kayu", baseUnit: "PIECE" },
  { keyword: "whole", materialId: "mat-box-whole", materialName: "Box Whole Cake 18cm + Pita", baseUnit: "PIECE" },
];

function fuzzyFind<T extends { keyword: string }>(
  word: string,
  dictionary: T[],
): { match: T; wasCorrected: boolean } | null {
  const clean = word.toLowerCase();
  const exact = dictionary.find((d) => d.keyword === clean);
  if (exact) return { match: exact, wasCorrected: false };

  if (clean.length < 3) return null;
  let best: T | null = null;
  let bestDist = Infinity;
  const maxAllowed = clean.length <= 4 ? 1 : 2;

  for (const item of dictionary) {
    const dist = levenshtein(clean, item.keyword);
    if (dist <= maxAllowed && dist < bestDist) {
      bestDist = dist;
      best = item;
    }
  }

  return best ? { match: best, wasCorrected: true } : null;
}

export function parseQuickChatCommand(rawInput: string): ParsedAction {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      type: "UNKNOWN",
      rawText: rawInput,
      hint: "Ketik perintah seperti: 'order Budi 2 bento 1 matcha besok' atau 'masuk calf 200g 2pcs 48000'",
    };
  }

  const lower = trimmed.toLowerCase();
  const tokens = trimmed.split(/\s+/);
  const firstWord = tokens[0].toLowerCase();
  const corrections: CorrectionNote[] = [];

  // 1. Query shortcuts: cek stok, cek laba, cek bep, cek prep/oven, rekap besok
  if (firstWord === "cek" || firstWord === "rekap" || firstWord === "status") {
    if (lower.includes("oven") || lower.includes("prep") || lower.includes("panggang") || lower.includes("bahan")) {
      return { type: "QUERY", queryKind: "PREP", corrections };
    }
    if (lower.includes("bep") || lower.includes("impas") || lower.includes("margin") || lower.includes("target")) {
      return { type: "QUERY", queryKind: "BEP", corrections };
    }
    if (lower.includes("stok")) {
      return { type: "QUERY", queryKind: "STOCK", corrections };
    }
    if (lower.includes("laba") || lower.includes("profit") || lower.includes("roe") || lower.includes("uang")) {
      return { type: "QUERY", queryKind: "PROFIT", corrections };
    }
    if (lower.includes("besok") || lower.includes("order") || lower.includes("rekap")) {
      return { type: "QUERY", queryKind: "TOMORROW", corrections };
    }
  }

  // 1b. Order status update: "oven Budi", "siap #ORD-001", "selesai Budi", "konfirmasi Budi", "batal Budi"
  const STATUS_COMMANDS: Record<
    string,
    { status: "CONFIRMED_SLOT" | "BAKING" | "READY_FOR_DELIVERY" | "DELIVERED" | "CANCELLED"; label: string }
  > = {
    konfirmasi: { status: "CONFIRMED_SLOT", label: "Slot Terkonfirmasi" },
    confirm: { status: "CONFIRMED_SLOT", label: "Slot Terkonfirmasi" },
    oven: { status: "BAKING", label: "Di Oven" },
    panggang: { status: "BAKING", label: "Di Oven" },
    bake: { status: "BAKING", label: "Di Oven" },
    siap: { status: "READY_FOR_DELIVERY", label: "Siap Kirim" },
    kirim: { status: "READY_FOR_DELIVERY", label: "Siap Kirim" },
    selesai: { status: "DELIVERED", label: "Selesai" },
    lunas: { status: "DELIVERED", label: "Selesai" },
    batal: { status: "CANCELLED", label: "Dibatalkan" },
  };
  if (STATUS_COMMANDS[firstWord] && tokens.length >= 2) {
    const target = tokens.slice(1).join(" ").trim();
    if (target) {
      return {
        type: "ORDER_STATUS",
        target,
        nextStatus: STATUS_COMMANDS[firstWord].status,
        statusLabel: STATUS_COMMANDS[firstWord].label,
        corrections,
      };
    }
  }

  // 2. OPEX / Modal command
  if (firstWord === "opex" || firstWord === "biaya" || firstWord === "modal" || firstWord === "ekuitas") {
    const isEquity = firstWord === "modal" || firstWord === "ekuitas";
    let amount = 0;
    const nameParts: string[] = [];
    for (let i = 1; i < tokens.length; i++) {
      const p = parseShorthandPrice(tokens[i]);
      if (p !== null && amount === 0) {
        amount = p;
      } else {
        nameParts.push(tokens[i]);
      }
    }
    if (amount > 0 && nameParts.length > 0) {
      return {
        type: isEquity ? "EQUITY" : "OPEX",
        name: nameParts.join(" "),
        amount,
        corrections,
      };
    }
  }

function parseRestockSegment(
  segmentTokens: string[],
  corrections: CorrectionNote[],
): RestockItem | null {
  let matchedMat: (typeof MATERIAL_KEYWORDS)[number] | null = null;
  let packSize = 0;
  let packCount = 1;
  let totalPrice = 0;
  let fallbackUnit: "GRAM" | "PIECE" | "ML" = "GRAM";
  const unknownWords: string[] = [];

  for (const tok of segmentTokens) {
    const tokLower = tok.toLowerCase();

    // Weight / volume token: 200g, 1.5kg, 500ml, 2l
    const weightMatch = tokLower.match(/^(\d+(?:\.\d+)?)(kg|g|gr|gram|ml|l|liter)$/);
    if (weightMatch) {
      const val = parseFloat(weightMatch[1]);
      const unit = weightMatch[2];
      if (unit === "kg" || unit === "l" || unit === "liter") {
        packSize = Math.round(val * 1000);
        fallbackUnit = unit === "kg" ? "GRAM" : "ML";
      } else {
        packSize = Math.round(val);
        fallbackUnit = unit === "ml" ? "ML" : "GRAM";
      }
      continue;
    }

    // Pack count token: 2pcs, 3x, 5box, 10biji
    const pcsMatch = tokLower.match(/^(\d+)(pcs|pc|x|pack|bks|box|bh|buah|dus)$/);
    if (pcsMatch) {
      packCount = parseInt(pcsMatch[1], 10);
      continue;
    }

    // Price token: 48000, 120rb, 48k
    const priceVal = parseShorthandPrice(tok);
    if (priceVal !== null) {
      totalPrice = priceVal;
      continue;
    }

    // Plain small number could be packCount if packSize is already known
    if (/^\d{1,3}$/.test(tokLower)) {
      const n = parseInt(tokLower, 10);
      if (packSize > 0) packCount = n;
      else packSize = n;
      continue;
    }

    // Material fuzzy match
    const found = fuzzyFind(tokLower, MATERIAL_KEYWORDS);
    if (found) {
      matchedMat = found.match;
      if (found.wasCorrected) {
        corrections.push({ original: tok, correctedTo: found.match.materialName });
      }
    } else {
      unknownWords.push(tok);
    }
  }

  const materialName =
    matchedMat?.materialName ||
    (unknownWords.length ? unknownWords.join(" ") : "Bahan Baku");
  const baseUnit = matchedMat?.baseUnit || fallbackUnit;

  const effectivePackSize = packSize > 0 ? packSize : 1;
  const quantityAdded = effectivePackSize * packCount;
  const unitCost =
    totalPrice > 0 && quantityAdded > 0
      ? Math.round((totalPrice / quantityAdded) * 100) / 100
      : 0;

  if (quantityAdded > 0 && (matchedMat || unknownWords.length > 0)) {
    return {
      materialId: matchedMat?.materialId,
      materialName,
      baseUnit,
      packSize: effectivePackSize,
      packCount,
      quantityAdded,
      totalPrice,
      unitCost,
    };
  }
  return null;
}

  // 3. Restock / Goods Receipt command: "masuk calf 200g 2pcs 48000" or multi-item "masuk calf 200g 24rb, fibercreme 100g 16rb"
  const isRestock =
    ["masuk", "restock", "stok", "beli", "tambah"].includes(firstWord) ||
    levenshtein(firstWord, "masuk") <= 1 ||
    levenshtein(firstWord, "restock") <= 2;

  if (isRestock) {
    if (firstWord !== "masuk" && firstWord !== "restock" && firstWord !== "beli" && firstWord !== "stok" && firstWord !== "tambah") {
      corrections.push({ original: tokens[0], correctedTo: "masuk" });
    }

    const restText = trimmed.slice(tokens[0].length).trim();
    const segments = restText
      .split(",")
      .map((s) => s.trim().split(/\s+/).filter(Boolean))
      .filter((segs) => segs.length > 0);

    const parsedItems = segments
      .map((segTokens) => parseRestockSegment(segTokens, corrections))
      .filter((it): it is RestockItem => it !== null);

    if (parsedItems.length === 1) {
      return {
        type: "RESTOCK",
        ...parsedItems[0],
        corrections,
      };
    }

    if (parsedItems.length > 1) {
      const totalPrice = parsedItems.reduce((sum, it) => sum + it.totalPrice, 0);
      return {
        type: "RESTOCK_BATCH",
        items: parsedItems,
        totalPrice,
        corrections,
      };
    }
  }

function parseOrderTokens(
  orderTokens: string[],
  corrections: CorrectionNote[],
): ParsedAction | null {
  let slotDate = getDateOffset(0);
  let slotLabel = "Hari Ini";
  let isHistorical = false;
  const itemsMap = new Map<
    string,
    { sku: string; productName: string; quantity: number; unitPrice: number }
  >();
  const nameTokens: string[] = [];
  let pendingQty = 1;
  let seenFirstItem = false;

  for (let i = 0; i < orderTokens.length; i++) {
    const tok = orderTokens[i];
    const tokLower = tok.toLowerCase();

    if (["lama", "histori", "history", "selesai", "lunas", "done"].includes(tokLower)) {
      isHistorical = true;
      continue;
    }
    if (tokLower === "kemarin") {
      slotDate = getDateOffset(-1);
      slotLabel = "Kemarin";
      isHistorical = true;
      continue;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(tokLower)) {
      slotDate = tokLower;
      slotLabel = tokLower;
      continue;
    }
    const shortDateMatch = tokLower.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
    if (shortDateMatch) {
      const day = shortDateMatch[1].padStart(2, "0");
      const month = shortDateMatch[2].padStart(2, "0");
      const year = new Date().getFullYear();
      slotDate = `${year}-${month}-${day}`;
      slotLabel = `${day}/${month}/${year}`;
      continue;
    }
    if (tokLower === "besok" || levenshtein(tokLower, "besok") <= 1) {
      if (tokLower !== "besok") corrections.push({ original: tok, correctedTo: "besok" });
      slotDate = getDateOffset(1);
      slotLabel = "Besok";
      continue;
    }
    if (tokLower === "lusa") {
      slotDate = getDateOffset(2);
      slotLabel = "Lusa";
      continue;
    }
    if (tokLower === "hari" && orderTokens[i + 1]?.toLowerCase() === "ini") {
      slotDate = getDateOffset(0);
      slotLabel = "Hari Ini";
      i++;
      continue;
    }

    if (/^\d{1,2}$/.test(tokLower)) {
      pendingQty = parseInt(tokLower, 10);
      seenFirstItem = true;
      continue;
    }

    const qtyX = tokLower.match(/^(\d{1,2})x$/);
    if (qtyX) {
      pendingQty = parseInt(qtyX[1], 10);
      seenFirstItem = true;
      continue;
    }

    const foundProd = fuzzyFind(tokLower, PRODUCT_KEYWORDS);
    if (foundProd) {
      seenFirstItem = true;
      if (foundProd.wasCorrected) {
        corrections.push({ original: tok, correctedTo: foundProd.match.productName });
      }
      const existing = itemsMap.get(foundProd.match.sku);
      const fin = FINANCIAL_MASTER[foundProd.match.sku];
      const unitPrice = fin?.promoPrice || fin?.sellingPrice || foundProd.match.unitPrice;
      if (existing) {
        existing.quantity += pendingQty;
      } else {
        itemsMap.set(foundProd.match.sku, {
          sku: foundProd.match.sku,
          productName: foundProd.match.productName,
          quantity: pendingQty,
          unitPrice,
        });
      }
      pendingQty = 1;
      continue;
    }

    if (!seenFirstItem) {
      nameTokens.push(tok);
    }
  }

  const items = Array.from(itemsMap.values());
  if (items.length === 0) return null;

  const customerName = nameTokens.length
    ? nameTokens.map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ")
    : "Pelanggan Walk-in";
  const totalAmount = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
  return {
    type: "ORDER",
    customerName,
    slotDate,
    slotLabel,
    status: isHistorical ? "DELIVERED" : "CONFIRMED_SLOT",
    isHistorical,
    items,
    totalAmount,
    corrections,
  };
}

  // 4. Order command: "order Budi 2 bento 1 matcha besok" or "histori Budi 2 ori 15/11"
  const isOrder =
    ["order", "pesan", "ord", "beli", "histori", "history"].includes(firstWord) ||
    levenshtein(firstWord, "order") <= 2;

  if (isOrder) {
    if (firstWord !== "order" && firstWord !== "pesan" && firstWord !== "histori" && firstWord !== "history") {
      corrections.push({ original: tokens[0], correctedTo: "order" });
    }
    const orderSlice =
      firstWord === "histori" || firstWord === "history"
        ? ["histori", ...tokens.slice(1)]
        : tokens.slice(1);
    const parsedOrder = parseOrderTokens(orderSlice, corrections);
    if (parsedOrder) return parsedOrder;
  }

  // 5. WhatsApp / Paste-Order fallback (e.g., "Nama: Ani\nPesan: 2 ori 1 matcha\nBesok")
  const cleanedWaText = trimmed
    .replace(/\b(nama|pemesan|customer|pesan|pesanan|order|slot|tanggal|jadwal)\s*:/gi, " ")
    .replace(/[*•\-\/,]+/g, " ");
  const waTokens = cleanedWaText.split(/\s+/).filter(Boolean);
  if (waTokens.length >= 2) {
    const parsedWa = parseOrderTokens(waTokens, corrections);
    if (parsedWa) return parsedWa;
  }

  return {
    type: "UNKNOWN",
    rawText: rawInput,
    hint: "Contoh perintah: 'order Budi 2 bento 1 matcha besok' · 'masuk calf 200g 2pcs 48000' · 'opex listrik 350rb' · 'cek laba'",
  };
}
