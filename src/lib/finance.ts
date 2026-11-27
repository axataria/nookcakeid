/**
 * Financial Calculation & Unit Economics Engine
 * All calculations use integer-based arithmetic to eliminate floating point rounding errors.
 * Single Source of Truth: docs/HPP_DAN_LABA_RUGI.md & PRD.md
 */

export interface ProductFinancials {
  sku: string;
  name: string;
  sellingPrice: number;
  promoPrice?: number;
  foodCost: number;
  packagingCost: number;
  overheadCost: number;
  totalHpp: number;
  grossProfit: number;
  grossMarginPct: number;
}

export const FINANCIAL_MASTER: Record<string, ProductFinancials> = {
  'CAKE-BENTO-10X7': {
    sku: 'CAKE-BENTO-10X7',
    name: 'Bento Cake (10x7 cm)',
    sellingPrice: 35000,
    foodCost: 22428,
    packagingCost: 2490,
    overheadCost: 1400,
    totalHpp: 26318,
    grossProfit: 8682,
    grossMarginPct: 24.81,
  },
  'CAKE-SLICE-CLASSIC': {
    sku: 'CAKE-SLICE-CLASSIC',
    name: 'Cheesecake Slice (1/5 Loyang)',
    sellingPrice: 40000,
    foodCost: 18686,
    packagingCost: 1664,
    overheadCost: 1400,
    totalHpp: 21750,
    grossProfit: 18250,
    grossMarginPct: 45.63,
  },
  'CAKE-WHOLE-16CM': {
    sku: 'CAKE-WHOLE-16CM',
    name: 'Celebration Whole Basque (16 cm)',
    sellingPrice: 195000,
    foodCost: 72000,
    packagingCost: 8500,
    overheadCost: 4500,
    totalHpp: 85000,
    grossProfit: 110000,
    grossMarginPct: 56.41,
  },
  'CAKE-BENTO-MATCHA': {
    sku: 'CAKE-BENTO-MATCHA',
    name: 'The Uji Matcha Basque (10x7 cm)',
    sellingPrice: 40000,
    foodCost: 23828,
    packagingCost: 2490,
    overheadCost: 1400,
    totalHpp: 27718,
    grossProfit: 12282,
    grossMarginPct: 30.71,
  },
  'CAKE-BENTO-BISCOFF': {
    sku: 'CAKE-BENTO-BISCOFF',
    name: 'Caramelized Lotus Biscoff (10x7 cm)',
    sellingPrice: 65000,
    foodCost: 28500,
    packagingCost: 2490,
    overheadCost: 1400,
    totalHpp: 32390,
    grossProfit: 32610,
    grossMarginPct: 50.17,
  },
  'CAKE-BENTO-CHOCO': {
    sku: 'CAKE-BENTO-CHOCO',
    name: 'The Choco Basque (10 cm)',
    sellingPrice: 40000,
    foodCost: 23728,
    packagingCost: 2490,
    overheadCost: 1400,
    totalHpp: 27618,
    grossProfit: 12382,
    grossMarginPct: 30.96,
  },
  'CAKE-WHOLE-18CM': {
    sku: 'CAKE-WHOLE-18CM',
    name: 'The Whole Basque (18 cm)',
    sellingPrice: 195000,
    foodCost: 75000,
    packagingCost: 8500,
    overheadCost: 4500,
    totalHpp: 88000,
    grossProfit: 107000,
    grossMarginPct: 54.87,
  },
  'CAKE-BURNT-CORNER-10CM': {
    sku: 'CAKE-BURNT-CORNER-10CM',
    name: 'The Burnt Corner (10 cm)',
    sellingPrice: 35000,
    foodCost: 22428,
    packagingCost: 2490,
    overheadCost: 1400,
    totalHpp: 26318,
    grossProfit: 8682,
    grossMarginPct: 24.81,
  },
  'CAKE-MATCHA-BASQUE-10CM': {
    sku: 'CAKE-MATCHA-BASQUE-10CM',
    name: 'The Matcha Basque (10 cm)',
    sellingPrice: 40000,
    foodCost: 23828,
    packagingCost: 2490,
    overheadCost: 1400,
    totalHpp: 27718,
    grossProfit: 12282,
    grossMarginPct: 30.71,
  },
  'CAKE-CHOCO-BASQUE-10CM': {
    sku: 'CAKE-CHOCO-BASQUE-10CM',
    name: 'The Choco Basque (10 cm)',
    sellingPrice: 40000,
    foodCost: 23728,
    packagingCost: 2490,
    overheadCost: 1400,
    totalHpp: 27618,
    grossProfit: 12382,
    grossMarginPct: 30.96,
  },
  'SAUCE-CHOCOLATE-25ML': {
    sku: 'SAUCE-CHOCOLATE-25ML',
    name: 'Chocolate Ganache (25ml)',
    sellingPrice: 10000,
    foodCost: 3500,
    packagingCost: 900,
    overheadCost: 200,
    totalHpp: 4600,
    grossProfit: 5400,
    grossMarginPct: 54.0,
  },
  'SAUCE-STRAWBERRY-25ML': {
    sku: 'SAUCE-STRAWBERRY-25ML',
    name: 'Selai Strawberry (25ml)',
    sellingPrice: 10000,
    foodCost: 3400,
    packagingCost: 900,
    overheadCost: 200,
    totalHpp: 4500,
    grossProfit: 5500,
    grossMarginPct: 55.0,
  },
};

export const ACTIVE_CATALOG_SKUS = [
  'CAKE-BURNT-CORNER-10CM',
  'CAKE-MATCHA-BASQUE-10CM',
  'CAKE-CHOCO-BASQUE-10CM',
  'CAKE-WHOLE-18CM',
  'SAUCE-CHOCOLATE-25ML',
  'SAUCE-STRAWBERRY-25ML',
] as const;

export const MONTHLY_FIXED_OPEX = 1250000; // Rp 1.250.000 / month (Electricity, WiFi, Chiller, Domain)
export const BEP_MONTHLY_BENTO_UNITS = 144; // Titik impas operasional (Rp 1.250.000 / Rp 8.682)

/**
 * Calculates Weighted Moving Average Cost for Raw Materials upon Goods Receipt (GRN)
 * New Cost = ((Current Qty * Old Cost) + (Received Qty * (Vendor Price + Inbound Freight))) / (Current Qty + Received Qty)
 */
export function calculateMovingAverageCost(
  currentQty: number,
  oldCostPerUnit: number,
  receivedQty: number,
  vendorUnitPrice: number,
  inboundFreightTotal = 0
): number {
  const totalQty = currentQty + receivedQty;
  if (totalQty <= 0) return oldCostPerUnit;

  const currentTotalValue = currentQty * oldCostPerUnit;
  const newReceiptTotalValue = receivedQty * vendorUnitPrice + inboundFreightTotal;

  const newUnitCost = (currentTotalValue + newReceiptTotalValue) / totalQty;
  return Math.round(newUnitCost * 100) / 100;
}

/**
 * Computes net daily profit based on completed sales
 */
export function calculateDailyProfit(
  items: { sku: string; quantity: number; unitPrice: number }[],
  dailyOpexShare = Math.round(MONTHLY_FIXED_OPEX / 30)
) {
  let grossRevenue = 0;
  let totalHpp = 0;

  for (const item of items) {
    const fin = FINANCIAL_MASTER[item.sku];
    const unitHpp = fin ? fin.totalHpp : 0;
    grossRevenue += item.unitPrice * item.quantity;
    totalHpp += unitHpp * item.quantity;
  }

  const grossProfit = grossRevenue - totalHpp;
  const netProfit = grossProfit - dailyOpexShare;
  const grossMarginPct = grossRevenue > 0 ? (grossProfit / grossRevenue) * 100 : 0;

  return {
    grossRevenue,
    totalHpp,
    grossProfit,
    dailyOpexShare,
    netProfit,
    grossMarginPct: Math.round(grossMarginPct * 100) / 100,
  };
}

/**
 * Return on Equity (ROE %) = (Net Profit / Total Owner Equity) * 100
 */
export function calculateROE(netProfit: number, totalEquity: number): number {
  if (totalEquity <= 0) return 0;
  return Math.round((netProfit / totalEquity) * 10000) / 100;
}
