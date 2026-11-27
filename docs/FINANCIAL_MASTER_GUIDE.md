# NookCake Financial Master Guide

Comprehensive reference for **NookCake** recipes, ingredient costs, packaging, unit economics (HPP), selling prices, gross margins, Break-Even Point (BEP), Return on Equity (ROE), and Moving Average Costing.

> **Codebase Single Source of Truth:**
> - [`src/lib/finance.ts`](../src/lib/finance.ts) (`FINANCIAL_MASTER`, `MONTHLY_FIXED_OPEX`, `BEP_MONTHLY_BENTO_UNITS`, `calculateMovingAverageCost`, `calculateROE`)
> - [`src/lib/mrp-calculator.ts`](../src/lib/mrp-calculator.ts) (`BOM_RECIPES`, `RAW_MATERIAL_NAMES`)
> - [`src/lib/admin-store.ts`](../src/lib/admin-store.ts) (`rawMaterials`, `getDashboardSummary`)
> - [`src/data/catalogData.ts`](../src/data/catalogData.ts) (Landing page selling prices)

---

## 1. Ingredient Prices & Recipe Breakdown (per 1 Loyang)

### A. Cheesecake Layer (1 Recipe = 2 Loyang → Divided by 2)

> Pre-bake target weight: **180 g** cheesecake batter per loyang (conservative 2-loyang yield used for HPP safety buffer).

| Ingredient | Market Reference Price | 1 Recipe (2 Loyang) | Cost / Recipe | Cost / 1 Loyang |
|---|---|---|---:|---:|
| **Calf Cream Cheese** | Rp 24.000 / 200 g | 200 g (1 pcs) | Rp 24.000 | **Rp 12.000** |
| **FiberCreme Bubuk** | Rp 16.000 / 100 g | 50 g | Rp 8.000 | **Rp 4.000** |
| **Telur Ayam** | Rp 28.500 / kg (~16 pcs) | 1 pc | Rp 1.800 | **Rp 900** |
| **Vanilla Bubuk Koepoe** | Rp 11.000 / 20 g | 1 tsp (~3 g) | Rp 1.650 | **Rp 825** |
| **Gula Pasir** | Rp 18.500 / 1.000 g | 60 g | Rp 1.110 | **Rp 555** |
| **Maizena Hawaii** | Rp 7.000 / 200 g | 6 g | Rp 210 | **Rp 105** |
| **Air Dingin (Whipcream)** | Drinking water / ice | 75 g (75 ml) | Rp 100 | **Rp 50** |
| **Garam** | Rp 6.000 / 250 g | ½ tsp (~2.5 g) | Rp 60 | **Rp 30** |
| **Subtotal Cheesecake Layer** | | | **Rp 36.930** | **Rp 18.465** |

### B. Brownies Base Layer (1 Batch = 4 Loyang → Divided by 4)

> Pre-bake target weight: **75 g** brownies batter per loyang.

| Ingredient | Market Reference Price | 1 Batch (4 Loyang) | Cost / Batch | Cost / 1 Loyang |
|---|---|---|---:|---:|
| **Pondan Signature Brownie Mix** | Rp 14.000 / pcs | 1 pcs | Rp 14.000 | **Rp 3.500** |
| **Telur Ayam** | ~Rp 1.800 / pc | 1 pc | Rp 1.800 | **Rp 450** |
| **Air** | Drinking water | 40 ml | Rp 50 | **Rp 13** |
| **Subtotal Brownies Layer** | | | **Rp 15.850** | **Rp 3.963** |

### C. Flavor Add-ons (1 Sachet per 2 Loyang)

| Variant | Flavoring | Package Price | Cost / 1 Loyang |
|---|---|---|---:|
| **Original (Burnt Corner)** | — | — | **Rp 0** |
| **Matcha Basque** | Zenlatte Matcha | Rp 28.000 / 10 pcs (Rp 2.800 / pcs) | **Rp 1.400** |
| **Choco Basque** | Chocolatos Drink | Rp 26.000 / 10 pcs (Rp 2.600 / pcs) | **Rp 1.300** |

---

## 2. Packaging & Overhead (per 1 Loyang)

| Component | Details | Cost / 1 Loyang |
|---|---|---:|
| **Packaging Box** | Pack box bento | Rp 2.350 |
| **Sendok Kayu** | Rp 7.000 / 50 pcs | Rp 140 |
| **Total Packaging (`packagingCost`)** | | **Rp 2.490** |
| **Overhead (`overheadCost`)** | Oven electricity, gas, baking paper | **Rp 1.400** |
| **Total Packaging + Overhead** | | **Rp 3.890** |

---

## 3. Master HPP, Selling Prices & Gross Margin

All 10 cm / Bento selling prices are synchronized with the storefront ([`src/data/catalogData.ts`](../src/data/catalogData.ts)):

| Product | SKU(s) | Food Cost | Packaging | Overhead | **Total HPP** | **Selling Price** | **Gross Profit** | **Gross Margin** |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| **Original / The Burnt Corner (10 cm)** | `CAKE-BURNT-CORNER-10CM`, `CAKE-BENTO-10X7` | Rp 22.428 | Rp 2.490 | Rp 1.400 | **Rp 26.318** | Rp 35.000 | **Rp 8.682** | **24.81%** |
| **Matcha Basque (10 cm)** | `CAKE-MATCHA-BASQUE-10CM`, `CAKE-BENTO-MATCHA` | Rp 23.828 | Rp 2.490 | Rp 1.400 | **Rp 27.718** | Rp 40.000 | **Rp 12.282** | **30.71%** |
| **Choco Basque (10 cm)** | `CAKE-CHOCO-BASQUE-10CM`, `CAKE-BENTO-CHOCO` | Rp 23.728 | Rp 2.490 | Rp 1.400 | **Rp 27.618** | Rp 40.000 | **Rp 12.382** | **30.96%** |
| **The Whole Basque (18 cm)** | `CAKE-WHOLE-18CM` | Rp 75.000 | Rp 8.500 | Rp 4.500 | **Rp 88.000** | Rp 195.000 | **Rp 107.000** | **54.87%** |
| **Chocolate Ganache (25 ml)** | `SAUCE-CHOCOLATE-25ML` | Rp 3.500 | Rp 900 | Rp 200 | **Rp 4.600** | Rp 10.000 | **Rp 5.400** | **54.00%** |
| **Selai Strawberry (25 ml)** | `SAUCE-STRAWBERRY-25ML` | Rp 3.400 | Rp 900 | Rp 200 | **Rp 4.500** | Rp 10.000 | **Rp 5.500** | **55.00%** |

---

## 4. OPEX, Break-Even Point (BEP) & ROE Formulas

### Fixed Monthly OPEX
- Default baseline (`MONTHLY_FIXED_OPEX`): **Rp 1.250.000 / month** (electricity, WiFi, chiller, domain).
- Live dashboard (`monthlyOpex`): dynamically summed from OPEX entries recorded in the current month via `/api/admin/finance`.

### Break-Even Point (BEP)
$$\text{BEP (units/month)} = \left\lceil \frac{\text{Monthly Fixed OPEX}}{\text{Original Bento Gross Profit}} \right\rceil = \left\lceil \frac{1.250.000}{8.682} \right\rceil = \mathbf{144\text{ loyang / month}}$$

*(Equivalent to ~5 loyang/day across 30 days. Whole cake orders count as 4 Bento-equivalent units in the dashboard BEP progress tracker.)*

### Net Profit & Return on Equity (ROE)
- **Gross Profit:** $\text{Total Revenue} - \text{Total HPP}$
- **Net Profit (Take-Home Pay):** $\text{Gross Profit} - \text{Monthly OPEX}$
- **ROE (%):**
$$\text{ROE (\%)} = \begin{cases} 0 & \text{if } \text{Total Equity} \le 0 \\ \left(\frac{\text{Net Profit}}{\text{Total Equity}}\right) \times 100 & \text{if } \text{Total Equity} > 0 \end{cases}$$

### Weighted Moving Average Cost (GRN)
Used when receiving raw material purchases to prevent profit distortion from fluctuating ingredient prices:
$$\text{New Cost/Unit} = \frac{(\text{Current Qty} \times \text{Old Cost/Unit}) + (\text{Received Qty} \times \text{Vendor Price} + \text{Inbound Freight})}{\text{Current Qty} + \text{Received Qty}}$$

---

## 5. Raw Material Master Codes

| Material Code (`admin-store`) | BOM Code (`mrp-calculator`) | Name | Unit | Default Unit Cost |
|---|---|---|---|---:|
| `RM-CALF` | `RAW-KEJU-CALF` | Cream Cheese Calf | `GRAM` | Rp 120 |
| `RM-FIBERCREME` | `RAW-FIBERCREME` | FiberCreme Bubuk | `GRAM` | Rp 160 |
| `RM-EGG` | `RAW-TELUR` | Telur Ayam Segar | `PIECE` | Rp 1.800 |
| `RM-PONDAN` | `RAW-PONDAN` | Pondan Signature Brownie Mix | `PIECE` | Rp 14.000 |
| `RM-GULA` | `RAW-GULA` | Gula Pasir | `GRAM` | Rp 19 |
| `RM-MAIZENA` | `RAW-MAIZENA` | Tepung Maizena Hawaii | `GRAM` | Rp 35 |
| `RM-VANILLA` | `RAW-VANILLA` | Vanilla Bubuk Koepoe | `GRAM` | Rp 550 |
| `RM-GARAM` | `RAW-GARAM` | Garam Dapur | `GRAM` | Rp 24 |
| `RM-MATCHA` | `RAW-ZENLATTE-MATCHA` | Zenlatte Matcha (Sachet) | `PIECE` | Rp 2.800 |
| `RM-CHOCOLATOS` | `RAW-CHOCOLATOS` | Chocolatos Drink (Sachet) | `PIECE` | Rp 2.600 |
| `PK-BENTO` | `PKG-BOX-BAGASSE` | Packaging Box Bento | `PIECE` | Rp 2.350 |
| `PK-SENDOK` | `PKG-SENDOK-KAYU` | Sendok Kayu | `PIECE` | Rp 140 |
| `PK-WHOLE` | `PKG-BOX-KRAFT` | Box Whole Cake 18cm + Pita | `PIECE` | Rp 8.500 |
