/**
 * Material Requirements Planning (MRP) Calculation Engine
 * Aggregates daily sales orders into exact raw material gramatures and packaging units.
 * Single Source of Truth: PRD.md & docs/ERD_DATABASE.md
 */

export interface RawMaterialRequirement {
  materialCode: string;
  name: string;
  totalQuantity: number;
  unit: 'GRAM' | 'PIECE' | 'ML';
  currentStock: number;
  shortage: number;
}

export interface OvenBatchCalculation {
  totalBento: number;
  totalSlice: number;
  totalWhole: number;
  loyangBesarEquivalent: number;
  recommendedOvenBatches: number; // Max 4 loyang per batch
}

export const BOM_RECIPES: Record<
  string,
  {
    materials: Record<string, number>;
    packaging: Record<string, number>;
  }
> = {
  // Bento Cake (10x7 cm) - Cheesecake Ori + Brownies Base (1 resep cheesecake = 2 loyang, 1 adonan brownies = 4 loyang)
  'CAKE-BENTO-10X7': {
    materials: {
      'RAW-KEJU-CALF': 100, // grams
      'RAW-FIBERCREME': 25, // grams
      'RAW-TELUR': 0.75, // pieces (0.5 cheesecake + 0.25 brownies)
      'RAW-PONDAN': 0.25, // pcs Pondan Signature Brownie Mix
      'RAW-GULA': 30, // grams
      'RAW-MAIZENA': 3, // grams
      'RAW-VANILLA': 1.5, // grams
      'RAW-GARAM': 1.25, // grams
    },
    packaging: {
      'PKG-BOX-BAGASSE': 1,
      'PKG-SENDOK-KAYU': 1,
      'PKG-CARE-CARD': 1,
      'PKG-SEAL-STICKER': 1,
    },
  },
  // Cheesecake Slice (1/5 Loyang)
  'CAKE-SLICE-CLASSIC': {
    materials: {
      'RAW-KEJU-CALF': 80,
      'RAW-CREAM-ANCHOR': 44,
      'RAW-TELUR': 0.4,
      'RAW-PONDAN': 46,
      'RAW-BUTTER': 20,
      'RAW-GULA': 24,
    },
    packaging: {
      'PKG-MIKA-TRIANGLE': 1,
      'PKG-CARE-CARD': 1,
    },
  },
  // Celebration Whole Cake (16 cm)
  'CAKE-WHOLE-16CM': {
    materials: {
      'RAW-KEJU-CALF': 350,
      'RAW-CREAM-ANCHOR': 200,
      'RAW-TELUR': 2.0,
      'RAW-PONDAN': 180,
      'RAW-BUTTER': 80,
      'RAW-GULA': 100,
    },
    packaging: {
      'PKG-BOX-WHOLE-16CM': 1,
      'PKG-PITA-LINEN': 1,
      'PKG-LILIN-ARTISAN': 1,
      'PKG-CARE-CARD': 1,
    },
  },
  // Uji Matcha Bento
  'CAKE-BENTO-MATCHA': {
    materials: {
      'RAW-KEJU-CALF': 100,
      'RAW-FIBERCREME': 25,
      'RAW-TELUR': 0.75,
      'RAW-PONDAN': 0.25,
      'RAW-GULA': 30,
      'RAW-MAIZENA': 3,
      'RAW-VANILLA': 1.5,
      'RAW-GARAM': 1.25,
      'RAW-ZENLATTE-MATCHA': 0.5, // sachet (1 bks / 2 loyang)
    },
    packaging: {
      'PKG-BOX-BAGASSE': 1,
      'PKG-SENDOK-KAYU': 1,
      'PKG-CARE-CARD': 1,
      'PKG-SEAL-STICKER': 1,
    },
  },
  // Lotus Biscoff Bento
  'CAKE-BENTO-BISCOFF': {
    materials: {
      'RAW-KEJU-CALF': 100,
      'RAW-CREAM-ANCHOR': 55,
      'RAW-TELUR': 0.5,
      'RAW-PONDAN': 55,
      'RAW-BUTTER': 25,
      'RAW-GULA': 25,
      'RAW-BISCOFF-SPREAD': 25,
      'RAW-BISCOFF-CRUMBS': 15,
    },
    packaging: {
      'PKG-BOX-BAGASSE': 1,
      'PKG-SENDOK-KAYU': 1,
      'PKG-CARE-CARD': 1,
      'PKG-SEAL-STICKER': 1,
    },
  },
  // Choco Basque Bento
  'CAKE-BENTO-CHOCO': {
    materials: {
      'RAW-KEJU-CALF': 100,
      'RAW-FIBERCREME': 25,
      'RAW-TELUR': 0.75,
      'RAW-PONDAN': 0.25,
      'RAW-GULA': 30,
      'RAW-MAIZENA': 3,
      'RAW-VANILLA': 1.5,
      'RAW-GARAM': 1.25,
      'RAW-CHOCOLATOS': 0.5, // sachet (1 bks / 2 loyang)
    },
    packaging: {
      'PKG-BOX-BAGASSE': 1,
      'PKG-SENDOK-KAYU': 1,
      'PKG-CARE-CARD': 1,
      'PKG-SEAL-STICKER': 1,
    },
  },
  // Whole Basque 18cm
  'CAKE-WHOLE-18CM': {
    materials: {
      'RAW-KEJU-CALF': 480,
      'RAW-CREAM-ANCHOR': 260,
      'RAW-TELUR': 2.5,
      'RAW-PONDAN': 260,
      'RAW-BUTTER': 120,
      'RAW-GULA': 120,
    },
    packaging: {
      'PKG-BOX-KRAFT': 1,
      'PKG-PISAU-KUE': 1,
      'PKG-LILIN': 1,
      'PKG-CARE-CARD': 1,
      'PKG-SEAL-STICKER': 1,
    },
  },
  // Landing page SKUs (aliases to 10cm / Bento recipes)
  'CAKE-BURNT-CORNER-10CM': {
    materials: {
      'RAW-KEJU-CALF': 100,
      'RAW-FIBERCREME': 25,
      'RAW-TELUR': 0.75,
      'RAW-PONDAN': 0.25,
      'RAW-GULA': 30,
      'RAW-MAIZENA': 3,
      'RAW-VANILLA': 1.5,
      'RAW-GARAM': 1.25,
    },
    packaging: {
      'PKG-BOX-BAGASSE': 1,
      'PKG-SENDOK-KAYU': 1,
      'PKG-CARE-CARD': 1,
      'PKG-SEAL-STICKER': 1,
    },
  },
  'CAKE-MATCHA-BASQUE-10CM': {
    materials: {
      'RAW-KEJU-CALF': 100,
      'RAW-FIBERCREME': 25,
      'RAW-TELUR': 0.75,
      'RAW-PONDAN': 0.25,
      'RAW-GULA': 30,
      'RAW-MAIZENA': 3,
      'RAW-VANILLA': 1.5,
      'RAW-GARAM': 1.25,
      'RAW-ZENLATTE-MATCHA': 0.5,
    },
    packaging: {
      'PKG-BOX-BAGASSE': 1,
      'PKG-SENDOK-KAYU': 1,
      'PKG-CARE-CARD': 1,
      'PKG-SEAL-STICKER': 1,
    },
  },
  'CAKE-CHOCO-BASQUE-10CM': {
    materials: {
      'RAW-KEJU-CALF': 100,
      'RAW-FIBERCREME': 25,
      'RAW-TELUR': 0.75,
      'RAW-PONDAN': 0.25,
      'RAW-GULA': 30,
      'RAW-MAIZENA': 3,
      'RAW-VANILLA': 1.5,
      'RAW-GARAM': 1.25,
      'RAW-CHOCOLATOS': 0.5,
    },
    packaging: {
      'PKG-BOX-BAGASSE': 1,
      'PKG-SENDOK-KAYU': 1,
      'PKG-CARE-CARD': 1,
      'PKG-SEAL-STICKER': 1,
    },
  },
};

export const RAW_MATERIAL_NAMES: Record<string, { name: string; unit: 'GRAM' | 'PIECE' | 'ML' }> = {
  'RAW-KEJU-CALF': { name: 'Keju Calf Cream Cheese', unit: 'GRAM' },
  'RAW-FIBERCREME': { name: 'FiberCreme Bubuk', unit: 'GRAM' },
  'RAW-CREAM-ANCHOR': { name: 'Anchor Whipping Cream Dairy', unit: 'GRAM' },
  'RAW-TELUR': { name: 'Telur Ayam Segar', unit: 'PIECE' },
  'RAW-PONDAN': { name: 'Pondan Signature Brownie Mix', unit: 'PIECE' },
  'RAW-BUTTER': { name: 'Butter / Margarin Palmboom', unit: 'GRAM' },
  'RAW-GULA': { name: 'Gula Pasir Halus', unit: 'GRAM' },
  'RAW-MAIZENA': { name: 'Tepung Maizena Hawaii', unit: 'GRAM' },
  'RAW-VANILLA': { name: 'Vanilla Bubuk Koepoe', unit: 'GRAM' },
  'RAW-GARAM': { name: 'Garam Dapur', unit: 'GRAM' },
  'RAW-ZENLATTE-MATCHA': { name: 'Zenlatte Matcha (Sachet)', unit: 'PIECE' },
  'RAW-CHOCOLATOS': { name: 'Chocolatos Drink (Sachet)', unit: 'PIECE' },
  'RAW-MATCHA-UJI': { name: 'Pure Uji Matcha Powder (Kyoto)', unit: 'GRAM' },
  'RAW-BISCOFF-SPREAD': { name: 'Lotus Biscoff Spread', unit: 'GRAM' },
  'RAW-BISCOFF-CRUMBS': { name: 'Lotus Biscoff Biscuit Crumbs', unit: 'GRAM' },
  'PKG-BOX-BAGASSE': { name: 'Bagasse Eco Box Bento (10x7)', unit: 'PIECE' },
  'PKG-SENDOK-KAYU': { name: 'Sendok Kayu Higienis', unit: 'PIECE' },
  'PKG-MIKA-TRIANGLE': { name: 'Mika Box Cake Slice', unit: 'PIECE' },
  'PKG-BOX-WHOLE-16CM': { name: 'Dus Kraft Whole Cake (16cm)', unit: 'PIECE' },
  'PKG-PITA-LINEN': { name: 'Pita Linen Katun Oatmeal', unit: 'PIECE' },
  'PKG-LILIN-ARTISAN': { name: 'Lilin Ulang Tahun Spiral', unit: 'PIECE' },
  'PKG-CARE-CARD': { name: 'Care Card Serving Guide', unit: 'PIECE' },
  'PKG-SEAL-STICKER': { name: 'Stiker Segel The Burnt Corner', unit: 'PIECE' },
};

/**
 * Calculates raw material deductions from ordered product quantities
 */
export function calculateMRPRequirements(
  orders: { sku: string; quantity: number }[],
  currentStockLedger: Record<string, number> = {}
): RawMaterialRequirement[] {
  const aggregated: Record<string, number> = {};

  for (const order of orders) {
    const bom = BOM_RECIPES[order.sku];
    if (!bom) continue;

    // Materials
    for (const [matCode, perUnit] of Object.entries(bom.materials)) {
      aggregated[matCode] = (aggregated[matCode] || 0) + perUnit * order.quantity;
    }

    // Packaging
    for (const [pkgCode, perUnit] of Object.entries(bom.packaging)) {
      aggregated[pkgCode] = (aggregated[pkgCode] || 0) + perUnit * order.quantity;
    }
  }

  return Object.entries(aggregated).map(([code, total]) => {
    const meta = RAW_MATERIAL_NAMES[code] || { name: code, unit: 'GRAM' as const };
    const stock = currentStockLedger[code] ?? 1000; // default buffer
    const shortage = Math.max(0, total - stock);

    return {
      materialCode: code,
      name: meta.name,
      totalQuantity: Math.round(total * 100) / 100,
      unit: meta.unit,
      currentStock: stock,
      shortage: Math.round(shortage * 100) / 100,
    };
  });
}

/**
 * Calculates oven batching schedules
 */
export function calculateOvenBatches(
  items: { variant: string; quantity: number }[]
): OvenBatchCalculation {
  let totalBento = 0;
  let totalSlice = 0;
  let totalWhole = 0;

  for (const item of items) {
    if (item.variant === 'BENTO') totalBento += item.quantity;
    else if (item.variant === 'SLICE') totalSlice += item.quantity;
    else if (item.variant === 'WHOLE') totalWhole += item.quantity;
  }

  // 1 Loyang Besar = 2 Bento = 5 Slice = 0.8 Whole
  const loyangBesarEquivalent = totalBento * 0.5 + totalSlice * 0.2 + totalWhole * 1.25;
  const recommendedOvenBatches = Math.ceil(loyangBesarEquivalent / 4); // Oven holds up to 4 loyang per bake

  return {
    totalBento,
    totalSlice,
    totalWhole,
    loyangBesarEquivalent: Math.round(loyangBesarEquivalent * 10) / 10,
    recommendedOvenBatches: Math.max(1, recommendedOvenBatches),
  };
}
