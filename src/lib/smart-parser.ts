import { FINANCIAL_MASTER } from "@/lib/finance";

export interface CorrectionNote {
  original: string;
  correctedTo: string;
}

export type ParsedAction =
  | {
      type: "ORDER";
      customerName: string;
      slotDate: string;
      slotLabel: string;
      items: {
        sku: string;
        productName: string;
        quantity: number;
        unitPrice: number;
      }[];
      totalAmount: number;
      corrections: CorrectionNote[];
    }
  | {
      type: "RESTOCK";
      materialId?: string;
      materialName: string;
      baseUnit: "GRAM" | "PIECE" | "ML";
      packSize: number;
      packCount: number;
      quantityAdded: number;
      totalPrice: number;
      unitCost: number;
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
      queryKind: "STOCK" | "PROFIT" | "TOMORROW";
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
  { keyword: "whole", sku: "CAKE-WHOLE-18CM", productName: "The Whole Basque", unitPrice: 195000 },
  { keyword: "utuh", sku: "CAKE-WHOLE-18CM", productName: "The Whole Basque", unitPrice: 195000 },
  { keyword: "loyang", sku: "CAKE-WHOLE-18CM", productName: "The Whole Basque", unitPrice: 195000 },
  { keyword: "bento", sku: "CAKE-BURNT-CORNER-10CM", productName: "The Burnt Corner", unitPrice: 35000 },
  { keyword: "burnt", sku: "CAKE-BURNT-CORNER-10CM", productName: "The Burnt Corner", unitPrice: 35000 },
  { keyword: "corner", sku: "CAKE-BURNT-CORNER-10CM", productName: "The Burnt Corner", unitPrice: 35000 },
  { keyword: "ori", sku: "CAKE-BURNT-CORNER-10CM", productName: "The Burnt Corner", unitPrice: 35000 },
  { keyword: "original", sku: "CAKE-BURNT-CORNER-10CM", productName: "The Burnt Corner", unitPrice: 35000 },
  { keyword: "matcha", sku: "CAKE-MATCHA-BASQUE-10CM", productName: "The Matcha Basque", unitPrice: 40000 },
  { keyword: "greentea", sku: "CAKE-MATCHA-BASQUE-10CM", productName: "The Matcha Basque", unitPrice: 40000 },
  { keyword: "choco", sku: "CAKE-CHOCO-BASQUE-10CM", productName: "The Choco Basque", unitPrice: 40000 },
  { keyword: "coklat", sku: "CAKE-CHOCO-BASQUE-10CM", productName: "The Choco Basque", unitPrice: 40000 },
  { keyword: "cokelat", sku: "CAKE-CHOCO-BASQUE-10CM", productName: "The Choco Basque", unitPrice: 40000 },
  { keyword: "ganache", sku: "SAUCE-CHOCOLATE-25ML", productName: "Chocolate Ganache (25ml)", unitPrice: 10000 },
  { keyword: "strawberry", sku: "SAUCE-STRAWBERRY-25ML", productName: "Selai Strawberry (25ml)", unitPrice: 10000 },
  { keyword: "stroberi", sku: "SAUCE-STRAWBERRY-25ML", productName: "Selai Strawberry (25ml)", unitPrice: 10000 },
  { keyword: "selai", sku: "SAUCE-STRAWBERRY-25ML", productName: "Selai Strawberry (25ml)", unitPrice: 10000 },
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
  { keyword: "anchor", materialId: "mat-anchor-cream", materialName: "Whipped Cream Anchor", baseUnit: "ML" },
  { keyword: "cream", materialId: "mat-anchor-cream", materialName: "Whipped Cream Anchor", baseUnit: "ML" },
  { keyword: "telur", materialId: "mat-telur", materialName: "Telur Omega-3", baseUnit: "GRAM" },
  { keyword: "egg", materialId: "mat-telur", materialName: "Telur Omega-3", baseUnit: "GRAM" },
  { keyword: "matcha", materialId: "mat-matcha", materialName: "Uji Matcha Powder", baseUnit: "GRAM" },
  { keyword: "coklat", materialId: "mat-choco", materialName: "Dark Chocolate 70%", baseUnit: "GRAM" },
  { keyword: "choco", materialId: "mat-choco", materialName: "Dark Chocolate 70%", baseUnit: "GRAM" },
  { keyword: "strawberry", materialId: "mat-strawberry", materialName: "Selai Strawberry Compote", baseUnit: "ML" },
  { keyword: "stroberi", materialId: "mat-strawberry", materialName: "Selai Strawberry Compote", baseUnit: "ML" },
  { keyword: "bento", materialId: "mat-box-bento", materialName: "Box Bagasse Bento 10cm", baseUnit: "PIECE" },
  { keyword: "box", materialId: "mat-box-bento", materialName: "Box Bagasse Bento 10cm", baseUnit: "PIECE" },
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

  // 1. Query shortcuts: cek stok, cek laba, rekap besok
  if (firstWord === "cek" || firstWord === "rekap" || firstWord === "status") {
    if (lower.includes("stok") || lower.includes("bahan")) {
      return { type: "QUERY", queryKind: "STOCK", corrections };
    }
    if (lower.includes("laba") || lower.includes("profit") || lower.includes("roe") || lower.includes("uang")) {
      return { type: "QUERY", queryKind: "PROFIT", corrections };
    }
    if (lower.includes("besok") || lower.includes("order") || lower.includes("rekap")) {
      return { type: "QUERY", queryKind: "TOMORROW", corrections };
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

  // 3. Restock / Goods Receipt command: "masuk calf 200g 2pcs 48000"
  const isRestock =
    ["masuk", "restock", "stok", "beli", "tambah"].includes(firstWord) ||
    levenshtein(firstWord, "masuk") <= 1 ||
    levenshtein(firstWord, "restock") <= 2;

  if (isRestock) {
    if (firstWord !== "masuk" && firstWord !== "restock" && firstWord !== "beli" && firstWord !== "stok" && firstWord !== "tambah") {
      corrections.push({ original: tokens[0], correctedTo: "masuk" });
    }

    let matchedMat: (typeof MATERIAL_KEYWORDS)[number] | null = null;
    let packSize = 0;
    let packCount = 1;
    let totalPrice = 0;
    let fallbackUnit: "GRAM" | "PIECE" | "ML" = "GRAM";
    const unknownWords: string[] = [];

    for (let i = 1; i < tokens.length; i++) {
      const tok = tokens[i];
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

    // If user wrote "masuk box bento 50pcs 110000" where unit is PIECE and packSize is 0
    const effectivePackSize = packSize > 0 ? packSize : 1;
    const quantityAdded = effectivePackSize * packCount;
    const unitCost =
      totalPrice > 0 && quantityAdded > 0
        ? Math.round((totalPrice / quantityAdded) * 100) / 100
        : 0;

    if (quantityAdded > 0 && (matchedMat || unknownWords.length > 0)) {
      return {
        type: "RESTOCK",
        materialId: matchedMat?.materialId,
        materialName,
        baseUnit,
        packSize: effectivePackSize,
        packCount,
        quantityAdded,
        totalPrice,
        unitCost,
        corrections,
      };
    }
  }

  // 4. Order command: "order Budi 2 bento 1 matcha besok"
  const isOrder =
    ["order", "pesan", "ord", "beli"].includes(firstWord) ||
    levenshtein(firstWord, "order") <= 2;

  if (isOrder) {
    if (firstWord !== "order" && firstWord !== "pesan") {
      corrections.push({ original: tokens[0], correctedTo: "order" });
    }

    let slotDate = getDateOffset(0);
    let slotLabel = "Hari Ini";
    const itemsMap = new Map<
      string,
      { sku: string; productName: string; quantity: number; unitPrice: number }
    >();
    const nameTokens: string[] = [];
    let pendingQty = 1;
    let seenFirstItem = false;

    for (let i = 1; i < tokens.length; i++) {
      const tok = tokens[i];
      const tokLower = tok.toLowerCase();

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
      if (tokLower === "hari" && tokens[i + 1]?.toLowerCase() === "ini") {
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

      // Check 2x / 3x shorthand
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
    if (items.length > 0) {
      const customerName = nameTokens.length
        ? nameTokens.map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ")
        : "Pelanggan Walk-in";
      const totalAmount = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
      return {
        type: "ORDER",
        customerName,
        slotDate,
        slotLabel,
        items,
        totalAmount,
        corrections,
      };
    }
  }

  return {
    type: "UNKNOWN",
    rawText: rawInput,
    hint: "Contoh perintah: 'order Budi 2 bento 1 matcha besok' · 'masuk calf 200g 2pcs 48000' · 'opex listrik 350rb' · 'cek laba'",
  };
}
