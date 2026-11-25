import {
  mysqlTable,
  varchar,
  text,
  decimal,
  boolean,
  timestamp,
  int,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';

export const unitTypeEnum = mysqlEnum('unit_type', ['GRAM', 'PIECE', 'ML']);
export const productVariantEnum = mysqlEnum('product_variant', [
  'SLICE',
  'BENTO',
  'WHOLE',
]);
export const orderStatusEnum = mysqlEnum('order_status', [
  'PENDING_PAYMENT',
  'CONFIRMED_SLOT',
  'BAKING',
  'READY_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
]);
export const ledgerTypeEnum = mysqlEnum('ledger_type', [
  'ORDER_DEDUCTION',
  'GOODS_RECEIPT',
  'WASTE_ADJUSTMENT',
  'INITIAL_BALANCE',
]);
export const equityCategoryEnum = mysqlEnum('equity_category', [
  'EQUIPMENT',
  'WORKING_CAPITAL',
  'RENOVATION',
  'OTHER',
]);
export const opexCategoryEnum = mysqlEnum('opex_category', [
  'RENT',
  'UTILITIES',
  'MARKETING',
  'PACKAGING_MISC',
  'LABOR',
  'OTHER',
]);

// 1. Raw Materials
export const rawMaterials = mysqlTable('raw_materials', {
  id: varchar('id', { length: 36 }).primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  baseUnit: unitTypeEnum.notNull(),
  currentStock: decimal('current_stock', { precision: 12, scale: 3 })
    .default('0.000')
    .notNull(),
  minimumBuffer: decimal('minimum_buffer', { precision: 12, scale: 3 })
    .default('0.000')
    .notNull(),
  movingAvgCost: decimal('moving_avg_cost', { precision: 12, scale: 2 }).notNull(),
  lastPurchasePrice: decimal('last_purchase_price', {
    precision: 12,
    scale: 2,
  }).notNull(),
  storageType: varchar('storage_type', { length: 50 }).default('CHILLED').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 2. Finished Products
export const products = mysqlTable('products', {
  id: varchar('id', { length: 36 }).primaryKey(),
  sku: varchar('sku', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  variant: productVariantEnum.notNull(),
  sellingPrice: decimal('selling_price', { precision: 12, scale: 2 }).notNull(),
  calculatedHpp: decimal('calculated_hpp', { precision: 12, scale: 2 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 3. Daily Baking Slots (Solo Baker Protection)
export const dailySlots = mysqlTable('daily_slots', {
  id: varchar('id', { length: 36 }).primaryKey(),
  slotDate: varchar('slot_date', { length: 10 }).notNull().unique(), // YYYY-MM-DD
  maxCapacity: int('max_capacity').default(16).notNull(),
  bookedCapacity: int('booked_capacity').default(0).notNull(),
  isLocked: boolean('is_locked').default(false).notNull(),
  cutOffTime: varchar('cut_off_time', { length: 5 }).default('16:00').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Sales Orders
export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }).notNull(),
  deliveryAddress: text('delivery_address'),
  deliveryMethod: varchar('delivery_method', { length: 20 })
    .default('PICKUP')
    .notNull(),
  slotDate: varchar('slot_date', { length: 10 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  totalHpp: decimal('total_hpp', { precision: 12, scale: 2 })
    .default('0.00')
    .notNull(),
  status: orderStatusEnum.default('PENDING_PAYMENT').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 5. Order Items
export const orderItems = mysqlTable('order_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 })
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  sku: varchar('sku', { length: 50 }).notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  quantity: int('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  unitHpp: decimal('unit_hpp', { precision: 12, scale: 2 })
    .default('0.00')
    .notNull(),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
  addonsJson: text('addons_json'),
  customNote: text('custom_note'),
});

// 6. Stock Ledger (Inventory Audit Trail)
export const stockLedger = mysqlTable('stock_ledger', {
  id: varchar('id', { length: 36 }).primaryKey(),
  rawMaterialId: varchar('raw_material_id', { length: 36 })
    .references(() => rawMaterials.id, { onDelete: 'cascade' })
    .notNull(),
  transactionType: ledgerTypeEnum.notNull(),
  quantityChange: decimal('quantity_change', { precision: 12, scale: 3 }).notNull(),
  balanceAfter: decimal('balance_after', { precision: 12, scale: 3 }).notNull(),
  unitCost: decimal('unit_cost', { precision: 12, scale: 2 }),
  totalCost: decimal('total_cost', { precision: 12, scale: 2 }),
  referenceId: varchar('reference_id', { length: 100 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. Owner Equity / Modal Awal (untuk perhitungan ROE)
export const ownerEquity = mysqlTable('owner_equity', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: equityCategoryEnum.default('EQUIPMENT').notNull(),
  amount: decimal('amount', { precision: 14, scale: 2 }).notNull(),
  recordedDate: varchar('recorded_date', { length: 10 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 8. Monthly OPEX Expenses (untuk Laba Bersih & ROE)
export const opexExpenses = mysqlTable('opex_expenses', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: opexCategoryEnum.default('UTILITIES').notNull(),
  amount: decimal('amount', { precision: 14, scale: 2 }).notNull(),
  periodMonth: varchar('period_month', { length: 7 }).notNull(), // YYYY-MM
  recordedDate: varchar('recorded_date', { length: 10 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
