-- =====================================================================
-- NOOK & CAKE — MySQL Schema (TiDB Cloud / Aiven / MySQL 8 / cPanel)
-- Matching src/db/schema.ts
-- =====================================================================

CREATE TABLE IF NOT EXISTS `raw_materials` (
  `id` VARCHAR(36) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `base_unit` ENUM('GRAM', 'PIECE', 'ML') NOT NULL,
  `current_stock` DECIMAL(12, 3) NOT NULL DEFAULT 0.000,
  `minimum_buffer` DECIMAL(12, 3) NOT NULL DEFAULT 0.000,
  `moving_avg_cost` DECIMAL(12, 2) NOT NULL,
  `last_purchase_price` DECIMAL(12, 2) NOT NULL,
  `storage_type` VARCHAR(50) NOT NULL DEFAULT 'CHILLED',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `raw_materials_code_unique` (`code`)
);

CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(36) NOT NULL,
  `sku` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `variant` ENUM('SLICE', 'BENTO', 'WHOLE') NOT NULL,
  `selling_price` DECIMAL(12, 2) NOT NULL,
  `calculated_hpp` DECIMAL(12, 2) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `image_url` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_sku_unique` (`sku`)
);

CREATE TABLE IF NOT EXISTS `daily_slots` (
  `id` VARCHAR(36) NOT NULL,
  `slot_date` VARCHAR(10) NOT NULL,
  `max_capacity` INT NOT NULL DEFAULT 16,
  `booked_capacity` INT NOT NULL DEFAULT 0,
  `is_locked` BOOLEAN NOT NULL DEFAULT FALSE,
  `cut_off_time` VARCHAR(5) NOT NULL DEFAULT '16:00',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `daily_slots_slot_date_unique` (`slot_date`)
);

CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(36) NOT NULL,
  `order_number` VARCHAR(50) NOT NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `delivery_address` TEXT NULL,
  `delivery_method` VARCHAR(20) NOT NULL DEFAULT 'PICKUP',
  `slot_date` VARCHAR(10) NOT NULL,
  `total_amount` DECIMAL(12, 2) NOT NULL,
  `total_hpp` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM(
    'PENDING_PAYMENT',
    'CONFIRMED_SLOT',
    'BAKING',
    'READY_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
  ) NOT NULL DEFAULT 'PENDING_PAYMENT',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`order_number`)
);

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` VARCHAR(36) NOT NULL,
  `order_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `sku` VARCHAR(50) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL,
  `unit_price` DECIMAL(12, 2) NOT NULL,
  `unit_hpp` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `subtotal` DECIMAL(12, 2) NOT NULL,
  `addons_json` TEXT NULL,
  `custom_note` TEXT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `order_items_order_id_fk`
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `stock_ledger` (
  `id` VARCHAR(36) NOT NULL,
  `raw_material_id` VARCHAR(36) NOT NULL,
  `transaction_type` ENUM(
    'ORDER_DEDUCTION',
    'GOODS_RECEIPT',
    'WASTE_ADJUSTMENT',
    'INITIAL_BALANCE'
  ) NOT NULL,
  `quantity_change` DECIMAL(12, 3) NOT NULL,
  `balance_after` DECIMAL(12, 3) NOT NULL,
  `unit_cost` DECIMAL(12, 2) NULL,
  `total_cost` DECIMAL(12, 2) NULL,
  `reference_id` VARCHAR(100) NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `stock_ledger_raw_material_id_fk`
    FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `owner_equity` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `category` ENUM('EQUIPMENT', 'WORKING_CAPITAL', 'RENOVATION', 'OTHER') NOT NULL DEFAULT 'EQUIPMENT',
  `amount` DECIMAL(14, 2) NOT NULL,
  `recorded_date` VARCHAR(10) NOT NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `opex_expenses` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `category` ENUM('RENT', 'UTILITIES', 'MARKETING', 'PACKAGING_MISC', 'LABOR', 'OTHER') NOT NULL DEFAULT 'UTILITIES',
  `amount` DECIMAL(14, 2) NOT NULL,
  `period_month` VARCHAR(7) NOT NULL,
  `recorded_date` VARCHAR(10) NOT NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- =====================================================================
-- Master Bahan Baku Awal (Stok 0 — siap diisi lewat Quick Chat)
-- =====================================================================
INSERT IGNORE INTO `raw_materials`
  (`id`, `code`, `name`, `base_unit`, `current_stock`, `minimum_buffer`, `moving_avg_cost`, `last_purchase_price`, `storage_type`)
VALUES
  ('mat-calf', 'RM-CALF', 'Cream Cheese Calf', 'GRAM', 0.000, 1000.000, 120.00, 120.00, 'CHILLED'),
  ('mat-anchor-cream', 'RM-ANCHOR', 'Whipped Cream Anchor', 'ML', 0.000, 800.000, 82.00, 82.00, 'CHILLED'),
  ('mat-telur', 'RM-EGG', 'Telur Omega-3', 'GRAM', 0.000, 900.000, 34.00, 34.00, 'AMBIENT'),
  ('mat-matcha', 'RM-MATCHA', 'Uji Matcha Powder', 'GRAM', 0.000, 200.000, 950.00, 950.00, 'AMBIENT'),
  ('mat-choco', 'RM-CHOCO', 'Dark Chocolate 70%', 'GRAM', 0.000, 500.000, 210.00, 210.00, 'AMBIENT'),
  ('mat-strawberry', 'RM-STRAWBERRY', 'Selai Strawberry Compote', 'ML', 0.000, 300.000, 95.00, 95.00, 'CHILLED'),
  ('mat-box-bento', 'PK-BENTO', 'Box Bagasse Bento 10cm', 'PIECE', 0.000, 20.000, 2200.00, 2200.00, 'PACKAGING'),
  ('mat-box-whole', 'PK-WHOLE', 'Box Whole Cake 18cm + Pita', 'PIECE', 0.000, 8.000, 8500.00, 8500.00, 'PACKAGING');
