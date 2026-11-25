import {
  pgTable,
  text,
  varchar,
  numeric,
  boolean,
  timestamp,
  integer,
  uuid,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const unitTypeEnum = pgEnum('unit_type', ['GRAM', 'PIECE', 'ML']);
export const productVariantEnum = pgEnum('product_variant', ['SLICE', 'BENTO', 'WHOLE']);
export const orderStatusEnum = pgEnum('order_status', [
  'PENDING_PAYMENT',
  'CONFIRMED_SLOT',
  'BAKING',
  'READY_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
]);
export const poStatusEnum = pgEnum('po_status', [
  'DRAFT',
  'SUBMITTED',
  'PARTIALLY_RECEIVED',
  'FULLY_RECEIVED',
  'CLOSED',
]);
export const ledgerTypeEnum = pgEnum('ledger_type', [
  'ORDER_DEDUCTION',
  'GOODS_RECEIPT',
  'WASTE_ADJUSTMENT',
  'INITIAL_BALANCE',
]);

// 1. Raw Materials
export const rawMaterials = pgTable('raw_materials', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  baseUnit: unitTypeEnum('base_unit').notNull(),
  currentStock: numeric('current_stock', { precision: 12, scale: 3 }).default('0').notNull(),
  minimumBuffer: numeric('minimum_buffer', { precision: 12, scale: 3 }).default('0').notNull(),
  movingAvgCost: numeric('moving_avg_cost', { precision: 12, scale: 2 }).notNull(),
  lastPurchasePrice: numeric('last_purchase_price', { precision: 12, scale: 2 }).notNull(),
  storageType: varchar('storage_type', { length: 50 }).default('CHILLED').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Finished Products
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  sku: varchar('sku', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  variant: productVariantEnum('variant').notNull(),
  sellingPrice: numeric('selling_price', { precision: 12, scale: 2 }).notNull(),
  calculatedHpp: numeric('calculated_hpp', { precision: 12, scale: 2 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Daily Baking Slots (Solo Baker Protection)
export const dailySlots = pgTable('daily_slots', {
  id: uuid('id').defaultRandom().primaryKey(),
  slotDate: varchar('slot_date', { length: 10 }).notNull().unique(), // YYYY-MM-DD
  maxCapacity: integer('max_capacity').default(16).notNull(), // 14-16 bento sweet spot
  bookedCapacity: integer('booked_capacity').default(0).notNull(),
  isLocked: boolean('is_locked').default(false).notNull(),
  cutOffTime: varchar('cut_off_time', { length: 5 }).default('16:00').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Sales Orders
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }).notNull(),
  deliveryAddress: text('delivery_address'),
  deliveryMethod: varchar('delivery_method', { length: 20 }).default('PICKUP').notNull(),
  slotDate: varchar('slot_date', { length: 10 }).notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  status: orderStatusEnum('status').default('PENDING_PAYMENT').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 5. Order Items
export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  productId: uuid('product_id')
    .references(() => products.id)
    .notNull(),
  sku: varchar('sku', { length: 50 }).notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  addonsJson: text('addons_json'), // Serialized array of chosen dipping sauces
  customNote: text('custom_note'),
});

// 6. Stock Ledger (Inventory Audit Trail)
export const stockLedger = pgTable('stock_ledger', {
  id: uuid('id').defaultRandom().primaryKey(),
  rawMaterialId: uuid('raw_material_id')
    .references(() => rawMaterials.id)
    .notNull(),
  transactionType: ledgerTypeEnum('transaction_type').notNull(),
  quantityChange: numeric('quantity_change', { precision: 12, scale: 3 }).notNull(),
  balanceAfter: numeric('balance_after', { precision: 12, scale: 3 }).notNull(),
  referenceId: varchar('reference_id', { length: 100 }), // Order ID or PO ID
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
