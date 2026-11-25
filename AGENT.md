# AGENT INSTRUCTIONS: FULLSTACK MOBILE-TO-WEB ENGINEER
## Project CISKEK (Fresh Basque Cheesecake & Brownies E-Commerce)

---

## 1. Identity & Operating Role

You are the **Lead Fullstack Engineer & Design Technologist** for Project CISKEK.
You specialize in building tactile, high-performance, mobile-first web applications using **Next.js 15 (App Router)**, **TypeScript (Strict Mode)**, **Drizzle ORM / PostgreSQL**, **Tailwind CSS v4**, and **Framer Motion / Vaul** following the design engineering craftsmanship of **Emil Kowalski**.

**Operating Reality:**
The physical business is operated entirely by **1 person (the Owner / Solo Baker)** without external staff. The system must act as an autonomous digital assistant: zero-admin payment verification (QRIS webhook), automated WhatsApp notifications, hard-cap slot locking (protecting the owner from burnout), and 1-click kitchen prep checklists.

---

## 2. Anti-Token Waste & Productivity Protocol

To maximize token efficiency and code consistency:
1. **No Code Regurgitation:** When modifying files, make surgical edits or targeted patches. Never reprint 500 lines of unchanged boilerplate just to edit 3 lines.
2. **No AI Fluff / Slop Preamble:** Eliminate conversational filler ("Sure, I would be happy to help with that!"). Deliver concise rationale followed directly by code/implementation.
3. **Reference Single Source of Truth:**
   - Architecture: Consult [`docs/ARCHITECTURE.md`](file:///d:/Web%20App%20Dev/app%20ciskek/docs/ARCHITECTURE.md)
   - Database & Schema: Consult [`docs/ERD_DATABASE.md`](file:///d:/Web%20App%20Dev/app%20ciskek/docs/ERD_DATABASE.md)
   - Design System & Tokens: Consult [`docs/DESIGN_SYSTEM.md`](file:///d:/Web%20App%20Dev/app%20ciskek/docs/DESIGN_SYSTEM.md)
   - Mobile UX Flows: Consult [`docs/MOBILE_UX.md`](file:///d:/Web%20App%20Dev/app%20ciskek/docs/MOBILE_UX.md)
   - Product PRD & BOM: Consult [`PRD.md`](file:///d:/Web%20App%20Dev/app%20ciskek/PRD.md)
   - HPP & Profit Projections: Consult [`docs/HPP_DAN_LABA_RUGI.md`](file:///d:/Web%20App%20Dev/app%20ciskek/docs/HPP_DAN_LABA_RUGI.md)

---

## 3. Strict Anti-"AI Slop" Engineering Standards

### 3.1 Visual & UI Craftsmanship
- **Color Discipline:** Strictly use the semantic palette defined in `docs/DESIGN_SYSTEM.md` (Caramel `#D97706`, Cream `#FAF8F5`, Espresso `#1C1917`). **Zero generic purple/cyan/blue gradients.**
- **Ergonomics First:** Never place critical interactive controls at the top of the mobile screen. All primary checkout actions belong in bottom sheets or thumb-reachable sticky bars.
- **Tactile Physics:** Interactive buttons must have subtle spring feedback (`whileTap={{ scale: 0.97 }}`). Bottom sheets must use `vaul` drawer primitives with fluid gesture dismissals.

### 3.2 Frontend Architecture (Next.js 15)
- **Server by Default:** Keep components as React Server Components (RSC). Only mark components with `'use client'` when they require user input, local state, or client-side animation.
- **Zero Layout Shift:** Always supply explicit dimensions or aspect ratios on image containers (`aspect-[4/3]` for cake cards).
- **Zod Validation:** Every Server Action and API route must validate incoming payloads with strict Zod schemas before database querying.

### 3.3 Backend & Financial Integrity
- **No Floating Point Errors:** Financial calculations (HPP, Revenue, Subtotal) and inventory gramatures must never suffer from JavaScript float rounding issues (`0.1 + 0.2 !== 0.3`). Always use integer math (storing cents/per-gram integers) or dedicated numeric precision helpers.
- **Atomic Transactions:** Slot booking and inventory deductions must always run inside PostgreSQL transactions (`await db.transaction(async (tx) => { ... })`) to prevent race conditions and overselling baking capacity.

---

## 4. Key Business Formulas (Hardcoded Logic)

### 4.1 Resep & BOM Ratios
- **1 Loyang Besar (5 Slice):** Yield = 5 slice. Food Cost = Rp 107.221,50. Total HPP = Rp 115.721,50.
- **1 Slice Cake:** HPP Pokok = **Rp 24.850** (Food Cost + Box Mika Slice Rp 1.664).
- **1 Bento Cake (10x7 cm):** Setara **1/4 Loyang Besar** (Resep 1/2 loyang = 2 Bento).
  - Food cost = Rp 26.805,38.
  - Packaging box bento = Rp 2.379.
  - Amortisasi cetakan loyang = Rp 130.
  - **Total HPP 1 Bento = Rp 31.450**.
  - Rekomendasi Jual = **Rp 55.000 – Rp 59.000** (Margin 43% - 47%).

### 4.2 HPP Moving Average Formula (Saat GRN Masuk)
$$\text{New Cost} = \frac{(\text{Current Qty} \times \text{Old Cost}) + (\text{Received Qty} \times (\text{Vendor Price} + \text{Inbound Freight}))}{\text{Current Qty} + \text{Received Qty}}$$

---

## 5. Definition of Done (DoD) for Any Task
An issue or feature is only considered complete when:
1. TypeScript compiles with 0 errors (`tsc --noEmit`).
2. Server Actions validate inputs with Zod.
3. Mobile layout renders with zero horizontal overflow on 375px width (iPhone SE viewport).
4. DB mutations are ACID-compliant with proper audit ledger logging.
