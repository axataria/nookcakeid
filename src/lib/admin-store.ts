import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured, schema } from "@/db";
import { calculateMovingAverageCost, calculateROE, FINANCIAL_MASTER } from "@/lib/finance";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED_SLOT"
  | "BAKING"
  | "READY_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface RawMaterialRecord {
  id: string;
  code: string;
  name: string;
  baseUnit: "GRAM" | "PIECE" | "ML";
  currentStock: number;
  minimumBuffer: number;
  movingAvgCost: number;
  lastPurchasePrice: number;
  storageType: string;
  updatedAt: string;
}

export interface StockLedgerRecord {
  id: string;
  rawMaterialId: string;
  materialName: string;
  transactionType: "ORDER_DEDUCTION" | "GOODS_RECEIPT" | "WASTE_ADJUSTMENT" | "INITIAL_BALANCE";
  quantityChange: number;
  balanceAfter: number;
  unitCost?: number;
  totalCost?: number;
  notes?: string;
  createdAt: string;
}

export interface OrderItemRecord {
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitHpp: number;
  subtotal: number;
  addons?: string[];
  customNote?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: string;
  slotDate: string;
  totalAmount: number;
  totalHpp: number;
  status: OrderStatus;
  notes?: string;
  items: OrderItemRecord[];
  createdAt: string;
}

export interface EquityRecord {
  id: string;
  name: string;
  category: "EQUIPMENT" | "WORKING_CAPITAL" | "RENOVATION" | "OTHER";
  amount: number;
  recordedDate: string;
  notes?: string;
}

export interface OpexRecord {
  id: string;
  name: string;
  category: "RENT" | "UTILITIES" | "MARKETING" | "PACKAGING_MISC" | "LABOR" | "OTHER";
  amount: number;
  periodMonth: string;
  recordedDate: string;
  notes?: string;
}

export interface StoreState {
  rawMaterials: RawMaterialRecord[];
  stockLedger: StockLedgerRecord[];
  orders: OrderRecord[];
  equities: EquityRecord[];
  opex: OpexRecord[];
  dailySlotCapacity: number;
}

const STORE_FILE = process.env.VERCEL
  ? path.join(os.tmpdir(), "nook-admin-store.json")
  : path.join(process.cwd(), ".next", "admin-store-dev.json");

function getDateOffset(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().slice(0, 10);
}

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function createInitialSeed(): StoreState {
  const now = new Date().toISOString();

  return {
    dailySlotCapacity: 16,
    rawMaterials: [
      {
        id: "mat-calf",
        code: "RM-CALF",
        name: "Cream Cheese Calf",
        baseUnit: "GRAM",
        currentStock: 0,
        minimumBuffer: 1000,
        movingAvgCost: 120,
        lastPurchasePrice: 120,
        storageType: "CHILLED",
        updatedAt: now,
      },
      {
        id: "mat-fibercreme",
        code: "RM-FIBERCREME",
        name: "FiberCreme Bubuk",
        baseUnit: "GRAM",
        currentStock: 0,
        minimumBuffer: 200,
        movingAvgCost: 160,
        lastPurchasePrice: 160,
        storageType: "AMBIENT",
        updatedAt: now,
      },
      {
        id: "mat-telur",
        code: "RM-EGG",
        name: "Telur Ayam Segar",
        baseUnit: "PIECE",
        currentStock: 0,
        minimumBuffer: 15,
        movingAvgCost: 1800,
        lastPurchasePrice: 1800,
        storageType: "AMBIENT",
        updatedAt: now,
      },
      {
        id: "mat-pondan",
        code: "RM-PONDAN",
        name: "Pondan Signature Brownie Mix",
        baseUnit: "PIECE",
        currentStock: 0,
        minimumBuffer: 5,
        movingAvgCost: 14000,
        lastPurchasePrice: 14000,
        storageType: "AMBIENT",
        updatedAt: now,
      },
      {
        id: "mat-gula",
        code: "RM-GULA",
        name: "Gula Pasir",
        baseUnit: "GRAM",
        currentStock: 0,
        minimumBuffer: 500,
        movingAvgCost: 19,
        lastPurchasePrice: 19,
        storageType: "AMBIENT",
        updatedAt: now,
      },
      {
        id: "mat-maizena",
        code: "RM-MAIZENA",
        name: "Tepung Maizena Hawaii",
        baseUnit: "GRAM",
        currentStock: 0,
        minimumBuffer: 100,
        movingAvgCost: 35,
        lastPurchasePrice: 35,
        storageType: "AMBIENT",
        updatedAt: now,
      },
      {
        id: "mat-vanilla",
        code: "RM-VANILLA",
        name: "Vanilla Bubuk Koepoe",
        baseUnit: "GRAM",
        currentStock: 0,
        minimumBuffer: 10,
        movingAvgCost: 550,
        lastPurchasePrice: 550,
        storageType: "AMBIENT",
        updatedAt: now,
      },
      {
        id: "mat-garam",
        code: "RM-GARAM",
        name: "Garam Dapur",
        baseUnit: "GRAM",
        currentStock: 0,
        minimumBuffer: 50,
        movingAvgCost: 24,
        lastPurchasePrice: 24,
        storageType: "AMBIENT",
        updatedAt: now,
      },
      {
        id: "mat-matcha",
        code: "RM-MATCHA",
        name: "Zenlatte Matcha (Sachet)",
        baseUnit: "PIECE",
        currentStock: 0,
        minimumBuffer: 5,
        movingAvgCost: 2800,
        lastPurchasePrice: 2800,
        storageType: "AMBIENT",
        updatedAt: now,
      },
      {
        id: "mat-chocolatos",
        code: "RM-CHOCOLATOS",
        name: "Chocolatos Drink (Sachet)",
        baseUnit: "PIECE",
        currentStock: 0,
        minimumBuffer: 5,
        movingAvgCost: 2600,
        lastPurchasePrice: 2600,
        storageType: "AMBIENT",
        updatedAt: now,
      },
      {
        id: "mat-box-bento",
        code: "PK-BENTO",
        name: "Packaging Box Bento",
        baseUnit: "PIECE",
        currentStock: 0,
        minimumBuffer: 20,
        movingAvgCost: 2350,
        lastPurchasePrice: 2350,
        storageType: "PACKAGING",
        updatedAt: now,
      },
      {
        id: "mat-sendok",
        code: "PK-SENDOK",
        name: "Sendok Kayu",
        baseUnit: "PIECE",
        currentStock: 0,
        minimumBuffer: 25,
        movingAvgCost: 140,
        lastPurchasePrice: 140,
        storageType: "PACKAGING",
        updatedAt: now,
      },
      {
        id: "mat-box-whole",
        code: "PK-WHOLE",
        name: "Box Whole Cake 18cm + Pita",
        baseUnit: "PIECE",
        currentStock: 0,
        minimumBuffer: 8,
        movingAvgCost: 8500,
        lastPurchasePrice: 8500,
        storageType: "PACKAGING",
        updatedAt: now,
      },
    ],
    stockLedger: [],
    orders: [],
    equities: [],
    opex: [],
  };
}

function readDevStore(): StoreState {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, "utf8");
      return JSON.parse(raw) as StoreState;
    }
  } catch {
    // fallback to seed
  }
  const seed = createInitialSeed();
  writeDevStore(seed);
  return seed;
}

function writeDevStore(state: StoreState): void {
  try {
    const dir = path.dirname(STORE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(state, null, 2), "utf8");
  } catch {
    // ignore read-only fs errors
  }
}

export async function getFullStoreState(): Promise<StoreState> {
  const db = getDb();
  if (!db) {
    return readDevStore();
  }

  // When MySQL DATABASE_URL is configured, read live tables
  const [mats, ledgers, ordRows, itemRows, eqRows, opxRows] = await Promise.all([
    db.select().from(schema.rawMaterials),
    db.select().from(schema.stockLedger).orderBy(desc(schema.stockLedger.createdAt)).limit(50),
    db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)),
    db.select().from(schema.orderItems),
    db.select().from(schema.ownerEquity),
    db.select().from(schema.opexExpenses),
  ]);

  const matNameMap = new Map(mats.map((m) => [m.id, m.name]));
  const itemsByOrder = new Map<string, OrderItemRecord[]>();
  for (const it of itemRows) {
    const arr = itemsByOrder.get(it.orderId) || [];
    arr.push({
      sku: it.sku,
      productName: it.productName,
      quantity: it.quantity,
      unitPrice: Number(it.unitPrice),
      unitHpp: Number(it.unitHpp),
      subtotal: Number(it.subtotal),
      addons: it.addonsJson ? (JSON.parse(it.addonsJson) as string[]) : undefined,
      customNote: it.customNote || undefined,
    });
    itemsByOrder.set(it.orderId, arr);
  }

  return {
    dailySlotCapacity: 16,
    rawMaterials: mats.map((m) => ({
      id: m.id,
      code: m.code,
      name: m.name,
      baseUnit: m.baseUnit,
      currentStock: Number(m.currentStock),
      minimumBuffer: Number(m.minimumBuffer),
      movingAvgCost: Number(m.movingAvgCost),
      lastPurchasePrice: Number(m.lastPurchasePrice),
      storageType: m.storageType,
      updatedAt: m.updatedAt.toISOString(),
    })),
    stockLedger: ledgers.map((l) => ({
      id: l.id,
      rawMaterialId: l.rawMaterialId,
      materialName: matNameMap.get(l.rawMaterialId) || l.rawMaterialId,
      transactionType: l.transactionType,
      quantityChange: Number(l.quantityChange),
      balanceAfter: Number(l.balanceAfter),
      unitCost: l.unitCost ? Number(l.unitCost) : undefined,
      totalCost: l.totalCost ? Number(l.totalCost) : undefined,
      notes: l.notes || undefined,
      createdAt: l.createdAt.toISOString(),
    })),
    orders: ordRows.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      deliveryMethod: o.deliveryMethod,
      slotDate: o.slotDate,
      totalAmount: Number(o.totalAmount),
      totalHpp: Number(o.totalHpp),
      status: o.status,
      notes: o.notes || undefined,
      items: itemsByOrder.get(o.id) || [],
      createdAt: o.createdAt.toISOString(),
    })),
    equities: eqRows.map((e) => ({
      id: e.id,
      name: e.name,
      category: e.category,
      amount: Number(e.amount),
      recordedDate: e.recordedDate,
      notes: e.notes || undefined,
    })),
    opex: opxRows.map((op) => ({
      id: op.id,
      name: op.name,
      category: op.category,
      amount: Number(op.amount),
      periodMonth: op.periodMonth,
      recordedDate: op.recordedDate,
      notes: op.notes || undefined,
    })),
  };
}

export async function createQuickOrder(input: {
  customerName: string;
  slotDate: string;
  items: { sku: string; productName: string; quantity: number; unitPrice: number }[];
  notes?: string;
}): Promise<OrderRecord> {
  const orderId = `ord-${crypto.randomUUID().slice(0, 8)}`;
  const orderNumber = `NK-${Math.floor(1000 + Math.random() * 9000)}`;

  const enrichedItems: OrderItemRecord[] = input.items.map((it) => {
    const fin = FINANCIAL_MASTER[it.sku];
    const unitHpp = fin ? fin.totalHpp : Math.round(it.unitPrice * 0.48);
    return {
      sku: it.sku,
      productName: it.productName,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      unitHpp,
      subtotal: it.unitPrice * it.quantity,
    };
  });

  const totalAmount = enrichedItems.reduce((acc, i) => acc + i.subtotal, 0);
  const totalHpp = enrichedItems.reduce((acc, i) => acc + i.unitHpp * i.quantity, 0);
  const newOrder: OrderRecord = {
    id: orderId,
    orderNumber,
    customerName: input.customerName,
    customerPhone: "-",
    deliveryMethod: "PICKUP",
    slotDate: input.slotDate,
    totalAmount,
    totalHpp,
    status: "CONFIRMED_SLOT",
    notes: input.notes,
    items: enrichedItems,
    createdAt: new Date().toISOString(),
  };

  const db = getDb();
  if (!db) {
    const state = readDevStore();
    state.orders.unshift(newOrder);
    writeDevStore(state);
    return newOrder;
  }

  await db.insert(schema.orders).values({
    id: orderId,
    orderNumber,
    customerName: newOrder.customerName,
    customerPhone: newOrder.customerPhone,
    deliveryMethod: newOrder.deliveryMethod,
    slotDate: newOrder.slotDate,
    totalAmount: totalAmount.toFixed(2),
    totalHpp: totalHpp.toFixed(2),
    status: newOrder.status,
    notes: newOrder.notes,
  });

  for (const item of enrichedItems) {
    await db.insert(schema.orderItems).values({
      id: `oi-${crypto.randomUUID().slice(0, 8)}`,
      orderId,
      productId: item.sku,
      sku: item.sku,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toFixed(2),
      unitHpp: item.unitHpp.toFixed(2),
      subtotal: item.subtotal.toFixed(2),
    });
  }

  return newOrder;
}

export async function recordMaterialRestock(input: {
  materialId?: string;
  materialName: string;
  baseUnit: "GRAM" | "PIECE" | "ML";
  quantityAdded: number;
  totalPrice: number;
  notes?: string;
}): Promise<{ material: RawMaterialRecord; ledger: StockLedgerRecord }> {
  const unitCost =
    input.totalPrice > 0 && input.quantityAdded > 0
      ? Math.round((input.totalPrice / input.quantityAdded) * 100) / 100
      : 0;

  const db = getDb();
  if (!db) {
    const state = readDevStore();
    let mat = state.rawMaterials.find(
      (m) =>
        (input.materialId && m.id === input.materialId) ||
        m.name.toLowerCase() === input.materialName.toLowerCase(),
    );

    if (!mat) {
      mat = {
        id: `mat-${crypto.randomUUID().slice(0, 8)}`,
        code: `RM-${input.materialName.slice(0, 6).toUpperCase().replace(/[^A-Z0-9]/g, "")}`,
        name: input.materialName,
        baseUnit: input.baseUnit,
        currentStock: 0,
        minimumBuffer: input.baseUnit === "PIECE" ? 10 : 500,
        movingAvgCost: unitCost,
        lastPurchasePrice: unitCost,
        storageType: "AMBIENT",
        updatedAt: new Date().toISOString(),
      };
      state.rawMaterials.push(mat);
    }

    const oldQty = mat.currentStock;
    const newQty = oldQty + input.quantityAdded;
    const newMac =
      unitCost > 0
        ? calculateMovingAverageCost(oldQty, mat.movingAvgCost, input.quantityAdded, unitCost)
        : mat.movingAvgCost;

    mat.currentStock = newQty;
    mat.movingAvgCost = newMac;
    if (unitCost > 0) mat.lastPurchasePrice = unitCost;
    mat.updatedAt = new Date().toISOString();

    const ledger: StockLedgerRecord = {
      id: `led-${crypto.randomUUID().slice(0, 8)}`,
      rawMaterialId: mat.id,
      materialName: mat.name,
      transactionType: "GOODS_RECEIPT",
      quantityChange: input.quantityAdded,
      balanceAfter: newQty,
      unitCost: unitCost || mat.movingAvgCost,
      totalCost: input.totalPrice || undefined,
      notes: input.notes || "Restock via Quick Chat",
      createdAt: new Date().toISOString(),
    };
    state.stockLedger.unshift(ledger);
    writeDevStore(state);
    return { material: mat, ledger };
  }

  // MySQL path
  const existing = input.materialId
    ? await db
        .select()
        .from(schema.rawMaterials)
        .where(eq(schema.rawMaterials.id, input.materialId))
    : [];
  const matRow = existing[0];

  if (!matRow) {
    const newId = `mat-${crypto.randomUUID().slice(0, 8)}`;
    const newMat: RawMaterialRecord = {
      id: newId,
      code: `RM-${Date.now().toString().slice(-5)}`,
      name: input.materialName,
      baseUnit: input.baseUnit,
      currentStock: input.quantityAdded,
      minimumBuffer: input.baseUnit === "PIECE" ? 10 : 500,
      movingAvgCost: unitCost,
      lastPurchasePrice: unitCost,
      storageType: "AMBIENT",
      updatedAt: new Date().toISOString(),
    };
    await db.insert(schema.rawMaterials).values({
      id: newId,
      code: newMat.code,
      name: newMat.name,
      baseUnit: newMat.baseUnit,
      currentStock: newMat.currentStock.toFixed(3),
      minimumBuffer: newMat.minimumBuffer.toFixed(3),
      movingAvgCost: newMat.movingAvgCost.toFixed(2),
      lastPurchasePrice: newMat.lastPurchasePrice.toFixed(2),
    });
    const ledId = `led-${crypto.randomUUID().slice(0, 8)}`;
    await db.insert(schema.stockLedger).values({
      id: ledId,
      rawMaterialId: newId,
      transactionType: "GOODS_RECEIPT",
      quantityChange: input.quantityAdded.toFixed(3),
      balanceAfter: input.quantityAdded.toFixed(3),
      unitCost: unitCost.toFixed(2),
      totalCost: input.totalPrice.toFixed(2),
      notes: input.notes || "Restock via Quick Chat",
    });
    return {
      material: newMat,
      ledger: {
        id: ledId,
        rawMaterialId: newId,
        materialName: newMat.name,
        transactionType: "GOODS_RECEIPT",
        quantityChange: input.quantityAdded,
        balanceAfter: input.quantityAdded,
        unitCost,
        totalCost: input.totalPrice,
        notes: input.notes,
        createdAt: new Date().toISOString(),
      },
    };
  }

  const oldQty = Number(matRow.currentStock);
  const newQty = oldQty + input.quantityAdded;
  const oldMac = Number(matRow.movingAvgCost);
  const newMac =
    unitCost > 0
      ? calculateMovingAverageCost(oldQty, oldMac, input.quantityAdded, unitCost)
      : oldMac;

  await db
    .update(schema.rawMaterials)
    .set({
      currentStock: newQty.toFixed(3),
      movingAvgCost: newMac.toFixed(2),
      lastPurchasePrice: (unitCost > 0 ? unitCost : Number(matRow.lastPurchasePrice)).toFixed(2),
    })
    .where(eq(schema.rawMaterials.id, matRow.id));

  const ledId = `led-${crypto.randomUUID().slice(0, 8)}`;
  await db.insert(schema.stockLedger).values({
    id: ledId,
    rawMaterialId: matRow.id,
    transactionType: "GOODS_RECEIPT",
    quantityChange: input.quantityAdded.toFixed(3),
    balanceAfter: newQty.toFixed(3),
    unitCost: (unitCost || oldMac).toFixed(2),
    totalCost: input.totalPrice.toFixed(2),
    notes: input.notes || "Restock via Quick Chat",
  });

  return {
    material: {
      id: matRow.id,
      code: matRow.code,
      name: matRow.name,
      baseUnit: matRow.baseUnit,
      currentStock: newQty,
      minimumBuffer: Number(matRow.minimumBuffer),
      movingAvgCost: newMac,
      lastPurchasePrice: unitCost > 0 ? unitCost : Number(matRow.lastPurchasePrice),
      storageType: matRow.storageType,
      updatedAt: new Date().toISOString(),
    },
    ledger: {
      id: ledId,
      rawMaterialId: matRow.id,
      materialName: matRow.name,
      transactionType: "GOODS_RECEIPT",
      quantityChange: input.quantityAdded,
      balanceAfter: newQty,
      unitCost: unitCost || oldMac,
      totalCost: input.totalPrice,
      notes: input.notes,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<OrderRecord | null> {
  const db = getDb();
  if (!db) {
    const state = readDevStore();
    const ord = state.orders.find((o) => o.id === orderId);
    if (!ord) return null;
    ord.status = status;
    writeDevStore(state);
    return ord;
  }

  await db
    .update(schema.orders)
    .set({ status })
    .where(eq(schema.orders.id, orderId));

  const state = await getFullStoreState();
  return state.orders.find((o) => o.id === orderId) || null;
}

export async function addEquityRecord(input: {
  name: string;
  category: EquityRecord["category"];
  amount: number;
  notes?: string;
}): Promise<EquityRecord> {
  const record: EquityRecord = {
    id: `eq-${crypto.randomUUID().slice(0, 8)}`,
    name: input.name,
    category: input.category,
    amount: input.amount,
    recordedDate: getDateOffset(0),
    notes: input.notes,
  };

  const db = getDb();
  if (!db) {
    const state = readDevStore();
    state.equities.unshift(record);
    writeDevStore(state);
    return record;
  }

  await db.insert(schema.ownerEquity).values({
    id: record.id,
    name: record.name,
    category: record.category,
    amount: record.amount.toFixed(2),
    recordedDate: record.recordedDate,
    notes: record.notes,
  });

  return record;
}

export async function addOpexRecord(input: {
  name: string;
  category: OpexRecord["category"];
  amount: number;
  notes?: string;
}): Promise<OpexRecord> {
  const record: OpexRecord = {
    id: `opx-${crypto.randomUUID().slice(0, 8)}`,
    name: input.name,
    category: input.category,
    amount: input.amount,
    periodMonth: getCurrentMonth(),
    recordedDate: getDateOffset(0),
    notes: input.notes,
  };

  const db = getDb();
  if (!db) {
    const state = readDevStore();
    state.opex.unshift(record);
    writeDevStore(state);
    return record;
  }

  await db.insert(schema.opexExpenses).values({
    id: record.id,
    name: record.name,
    category: record.category,
    amount: record.amount.toFixed(2),
    periodMonth: record.periodMonth,
    recordedDate: record.recordedDate,
    notes: record.notes,
  });

  return record;
}

export async function getDashboardSummary() {
  const state = await getFullStoreState();
  const activeOrders = state.orders.filter((o) => o.status !== "CANCELLED");

  const totalRevenue = activeOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalHpp = activeOrders.reduce((acc, o) => acc + o.totalHpp, 0);
  const grossProfit = totalRevenue - totalHpp;
  const grossMarginPct =
    totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 10000) / 100 : 0;

  const currentMonth = getCurrentMonth();
  const monthlyOpex = state.opex
    .filter((op) => op.periodMonth === currentMonth)
    .reduce((acc, op) => acc + op.amount, 0);

  const netProfit = grossProfit - monthlyOpex;
  const totalEquity = state.equities.reduce((acc, e) => acc + e.amount, 0);
  const roePct = calculateROE(netProfit, totalEquity);

  // BEP calculation (based on avg bento contribution margin ~ Rp 20.000)
  const totalUnitsSold = activeOrders.reduce(
    (sum, o) =>
      sum +
      o.items.reduce(
        (u, it) => u + it.quantity * (it.sku.includes("WHOLE") ? 4 : 1),
        0,
      ),
    0,
  );
  const bepTargetUnits = 144;
  const bepProgressPct = Math.min(100, Math.round((totalUnitsSold / bepTargetUnits) * 100));

  // Today's slot usage
  const today = getDateOffset(0);
  const todayBookedUnits = activeOrders
    .filter((o) => o.slotDate === today)
    .reduce(
      (sum, o) =>
        sum +
        o.items.reduce(
          (u, it) => u + it.quantity * (it.sku.includes("WHOLE") ? 4 : 1),
          0,
        ),
      0,
    );

  // Chart data: last 5 days revenue vs hpp vs profit
  const chartSeries = [-4, -3, -2, -1, 0].map((offset) => {
    const date = getDateOffset(offset);
    const dayOrders = activeOrders.filter((o) => o.slotDate === date);
    const rev = dayOrders.reduce((a, b) => a + b.totalAmount, 0);
    const hpp = dayOrders.reduce((a, b) => a + b.totalHpp, 0);
    return {
      date,
      label: date.slice(5),
      revenue: rev,
      hpp,
      profit: rev - hpp,
    };
  });

  // Product mix breakdown
  const mixMap = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const ord of activeOrders) {
    for (const it of ord.items) {
      const prev = mixMap.get(it.sku) || { name: it.productName, qty: 0, revenue: 0 };
      prev.qty += it.quantity;
      prev.revenue += it.subtotal;
      mixMap.set(it.sku, prev);
    }
  }
  const productMix = Array.from(mixMap.entries()).map(([sku, v]) => ({
    sku,
    ...v,
  }));

  // Low stock alerts
  const lowStockCount = state.rawMaterials.filter(
    (m) => m.currentStock <= m.minimumBuffer,
  ).length;

  return {
    storageEngine: isDatabaseConfigured() ? ("MYSQL" as const) : ("FALLBACK" as const),
    kpis: {
      totalRevenue,
      totalHpp,
      grossProfit,
      grossMarginPct,
      monthlyOpex,
      netProfit,
      totalEquity,
      roePct,
      totalUnitsSold,
      bepTargetUnits,
      bepProgressPct,
      todayBookedUnits,
      dailySlotCapacity: state.dailySlotCapacity,
      lowStockCount,
      totalOrders: activeOrders.length,
    },
    chartSeries,
    productMix,
    orders: state.orders,
    rawMaterials: state.rawMaterials,
    stockLedger: state.stockLedger,
    equities: state.equities,
    opex: state.opex,
  };
}
