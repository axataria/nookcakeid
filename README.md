# Project CISKEK: Artisan Basque Cheesecake E-Commerce & ERP
> Mat-Themed Artisan Pre-Order Storefront with 3D Interactive Basque Cheesecake & WhatsApp Checkout

## ⚡ Panduan Cepat Menjalankan di PC Lain (Quick Start)

### Syarat Sistem:
- **Node.js**: Versi 20, 22, atau 24 LTS (direkomendasikan Node.js 22+).
- **NPM**: Versi 10 atau lebih baru.

### Langkah-langkah:
1. **Ekstrak file `.zip`** ini ke folder kerja di komputer Anda.
2. Buka Terminal / PowerShell / Command Prompt di dalam folder proyek hasil ekstrak.
3. Install seluruh dependency:
   ```bash
   npm install
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```
5. Buka browser dan akses:
   ```
   http://localhost:3000
   ```
   *(Atau port yang tertera di terminal, misal `http://localhost:3001`)*

### Perintah Penting:
| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server development lokal |
| `npm run check` | Menjalankan ESLint dan typecheck TypeScript ketat |
| `npm run build` | Membuat build produksi teroptimasi |
| `npm start` | Menjalankan server hasil build produksi |

---

## Local development

Use Node.js 24 (`.nvmrc`) and npm 10 or newer. The package engine range also
allows Node.js 22.13+ and 26. From this directory:

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. No environment variables, database, or payment
credentials are required for the current demo. Optional overrides are listed in
`.env.example`; copy it to `.env.local` only if needed.
Set `TEST_BASE_URL` in the shell when running Playwright; Playwright does not
automatically load `.env.local`.
Before a production build, set `SITE_URL` to the public origin (for example,
`https://your-domain.example`) so social preview images resolve to your site.
Local development defaults to `http://localhost:3000`.

| Command | Purpose |
| --- | --- |
| `npm run check` | Run ESLint and strict TypeScript checks |
| `npx playwright install chromium` | Install the browser before the first test run |
| `npm test` | Run hydration/cart regressions at desktop and mobile sizes |
| `npm run test:ui` | Open the interactive browser test runner |
| `npm run build` | Create a production build |
| `npm start` | Serve that production build |

Browser tests start an isolated development server on `127.0.0.1:3100` and use
`.next-test` for build output. They fail if that port is occupied. To test an
existing server instead, set `$env:TEST_BASE_URL = 'http://localhost:3000'` in
PowerShell before `npm test`. Clear it with `Remove-Item Env:TEST_BASE_URL`.
Development uses `.next-development`; production build/start use `.next`.
If you override `NEXT_DIST_DIR`, use the same value for build and start.

Next.js is pinned to 15.5.29. Its nested PostCSS dependency is overridden to
the project's patched PostCSS 8 version; keep that override until the framework
ships a patched dependency. ESLint 9 is used to match the Next.js 15 preset's
supported range. Commit `package-lock.json` with dependency changes and use
`npm ci` for repeatable installs.

### Current implementation status

The storefront supports catalog browsing, date selection, and a cart persisted
in browser local storage. Orders are confirmed manually through Instagram.
Admin screens use demo data; slot reservations are in memory. PostgreSQL tables
are declared in `src/db/schema.ts`, but database connectivity and migrations are
not configured. Order creation and payment webhook endpoints intentionally
return HTTP 503 while online payments are unavailable.

The architecture documents below describe the intended full system, including
PostgreSQL, Redis, QRIS, authentication, and notifications. They are not a list of
services needed to run the current demo. The installed styling stack is Tailwind
CSS 3, although some planning documents refer to version 4.

This directory currently has no Git repository. Initialize version control and
connect a remote separately when ready to preserve changes and enable CI.

Selamat datang di repositori arsitektur **Project CISKEK**. Proyek ini dirancang khusus untuk memadukan pengalaman web pre-order modern kelas artisan (mobile-first, tactile UI ala Emil Kowalski) dengan mesin backend ERP yang presisi untuk perhitungan HPP, kalkulasi laba, pelacakan Open PO supplier, dan manajemen kapasitas oven harian.

---

## 📚 Dokumentasi Arsitektur & Spesifikasi Lengkap

Seluruh dokumen spesifikasi telah disusun secara modular tanpa fluff (*zero AI slop*):

| Dokumen | Deskripsi & Cakupan | Tautan File |
| :--- | :--- | :--- |
| **`STRUCTURE.md`** | **Struktur Repositori & Brand Style Guide (`nook & cake.`)**<br>Identitas brand, palet oatmeal/linen beige, tipografi editorial serif, menu *The Burnt Corner*, dan pohon folder Next.js 15. | [Buka `STRUCTURE.md`](file:///d:/Web%20App%20Dev/app%20ciskek/STRUCTURE.md) |
| **`AGENT.md`** | **Instruksi & Standar Rekayasa untuk AI Agent (Fullstack Mobile-to-Web)**<br>Protokol efisiensi token, aturan anti-AI slop, standar Next.js 15, Drizzle, dan rumus finansial. | [Buka `AGENT.md`](file:///d:/Web%20App%20Dev/app%20ciskek/AGENT.md) |
| **`PRD.md`** | **Product Requirements Document (PRD v3.1)**<br>Data bahan baku tervalidasi, Bill of Materials (BOM), kalkulasi HPP Slice & Bento Cake, ulasan kritis (*Ruthless Review*). | [Buka `PRD.md`](file:///d:/Web%20App%20Dev/app%20ciskek/PRD.md) |
| **`docs/HPP_DAN_LABA_RUGI.md`** | **Master HPP, Unit Economics, Proyeksi Laba Rugi & Rekomendasi Menu**<br>BOM gramatur, food cost riil, OPEX bulanan, simulasi net profit 3 skenario, BEP, dan menu trending (Matcha, Lotus, Drip Sauce). | [Buka `docs/HPP_DAN_LABA_RUGI.md`](file:///d:/Web%20App%20Dev/app%20ciskek/docs/HPP_DAN_LABA_RUGI.md) |
| **`docs/ARCHITECTURE.md`** | **Arsitektur Sistem & Alur Kerja Data**<br>Modular monolith Next.js 15, atomic slot locking dengan Redis, pipeline MRP otomatis jam 16:00, dan keamanan RBAC. | [Buka `docs/ARCHITECTURE.md`](file:///d:/Web%20App%20Dev/app%20ciskek/docs/ARCHITECTURE.md) |
| **`docs/ERD_DATABASE.md`** | **Skema Relasi Database (PostgreSQL / Drizzle Schema)**<br>Tabel master bahan, produk varian, resep BOM, slot harian, pesanan, supplier, Open PO, GRN, dan stock ledger. | [Buka `docs/ERD_DATABASE.md`](file:///d:/Web%20App%20Dev/app%20ciskek/docs/ERD_DATABASE.md) |
| **`docs/DESIGN_SYSTEM.md`** | **Design System & Design Tokens (Emil Kowalski Philosophy)**<br>Palet warna artisan warm bakery, skala tipografi, spring physics, dan spesifikasi komponen taktil (Bottom Sheet, Stepper). | [Buka `docs/DESIGN_SYSTEM.md`](file:///d:/Web%20App%20Dev/app%20ciskek/docs/DESIGN_SYSTEM.md) |
| **`docs/MOBILE_UX.md`** | **Desain Antarmuka Mobile-First & Screen Flows**<br>Wireframe tekstual alur pelanggan (Pilih Slot $\rightarrow$ Katalog $\rightarrow$ Drawer Checkout $\rightarrow$ Dynamic QRIS) dan Tablet Dapur. | [Buka `docs/MOBILE_UX.md`](file:///d:/Web%20App%20Dev/app%20ciskek/docs/MOBILE_UX.md) |

---

## 🍰 Ringkasan Parameter Finansial Produk

- **Cheesecake Slice (1 pcs dari Loyang 5 Slice):**
  - HPP Bersih: **Rp 24.850** | Rekomendasi Jual: **Rp 40.000** | Laba Kotor: **Rp 15.150 (37,9%)**
- **Bento Cake 10x7 (Porsi 1/4 Loyang Besar / 1/2 Resep = 2 Bento):**
  - HPP Bersih: **Rp 31.450** | Rekomendasi Jual: **Rp 59.000** | Laba Kotor: **Rp 27.550 (46,7%)**
- **Sistem Pre-Order:** Slot tanggal $H+1$ s/d $H+2$ dengan cut-off pukul 16:00 WIB dan kedaluwarsa booking 15-60 menit.
