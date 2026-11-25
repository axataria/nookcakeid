# PRD: Admin Site (`admin.nookcake.shop`) & Fitur Admin Quick Chat
**Project:** CISKEK — *nook & cake.*  
**Status:** Draft / Siap Implementasi  
**Target Domain:** `admin.nookcake.shop` (terpisah dari storefront publik `nookcake.shop`)

---

## 1. Latar Belakang & Tujuan
Sebagai **Solo Baker (1 orang)**, proses pencatatan pesanan masuk, restock bahan baku, dan pemantauan profit harus cepat dan tidak membebani operasional harian.

Tujuan utama sistem ini:
1. Memisahkan akses operasional ke subdomain khusus **`admin.nookcake.shop`** yang terlindungi login owner.
2. Menyediakan **Admin Quick Chat** berbasis **Smart Parser lokal** (tanpa AI Agent / tanpa biaya API eksternal) agar owner cukup mengetik pesan singkat untuk mencatat pesanan maupun tambah stok bahan.
3. Menghubungkan seluruh data ke **MySQL cPanel** untuk tracking pesanan, stok bahan real-time, **Laba Kotor, Laba Bersih, BEP, dan ROE (Return on Equity)**, serta menampilkannya dalam **Complete Visual Dashboard**.

---

## 2. Arsitektur Subdomain (`admin.nookcake.shop`)

### 2.1 Routing & Pemisahan Akses
- **Storefront Publik:** `nookcake.shop` (katalog, keranjang, info produk).
- **Admin Site:** `admin.nookcake.shop` (Kitchen, Inventory & MRP, Procurement, Analytics & ROE, serta Quick Chat).
- **Implementasi di Next.js:**
  - Menggunakan `middleware.ts` untuk mendeteksi `host === 'admin.nookcake.shop'` (atau `admin.localhost:3000` saat development) dan mengarahkan request ke route admin.
  - Akses langsung ke route admin melalui domain utama `nookcake.shop/admin` diblokir atau di-redirect.

### 2.2 Keamanan (Owner Authentication)
- Login sederhana khusus **1 akun Owner** (email/username + password hash, disimpan di environment variable `.env` cPanel atau tabel `admin_users`).
- Session berbasis HTTP-only cookie agar seluruh halaman dan API `/api/admin/*` aman dari akses publik.

---

## 3. Fitur Utama: Admin Quick Chat (Smart Parser Lokal)

### 3.1 Prinsip Kerja
- **Tanpa AI Agent:** Menggunakan rule-based / keyword parser yang langsung membaca master data SKU di `src/lib/finance.ts` dan master bahan baku di database.
- **Simple Auto-Correction (Fuzzy Matching):** Jika ada typo pada nama produk, bahan, atau perintah (misal `kaju calf`, `bnto`, `mactha`, `slcie`), parser otomatis mencocokkan ke kata terdekat (alias/Levenshtein distance) dan menandai hasil koreksinya di kartu konfirmasi.
- **Alur 2 Langkah (Aman dari Typo):**
  1. Owner mengetik perintah singkat di kolom chat (atau klik tombol shortcut `+ Order`, `+ Stok`, `Cek Laba`).
  2. Sistem menampilkan **Kartu Konfirmasi** berisi hasil pembacaan (nama item, jumlah, total/saldo baru) dengan tombol **Simpan** dan **Batal**.

### 3.2 Format Perintah yang Didukung
1. **Catat Pesanan Baru:**
   - Contoh: `order Budi 2 bento 1 matcha besok`
   - Aksi: Membuat record di `orders` & `order_items`, menghitung total harga & HPP, mengurangi kuota `daily_slots`, dan menandai kebutuhan bahan di MRP.
2. **Tambah Stok Bahan (Restock / Goods Receipt):**
   - Mendukung format kemasan & total harga sekaligus, contoh:
     - `masuk calf 200g 2pcs 48000` $\rightarrow$ otomatis dihitung `200g × 2 = 400g` dengan total harga `Rp 48.000` (`Rp 120/g`).
     - `restock anchor 1.5kg 120rb` atau `masuk keju calf 2000g`.
   - Aksi: Menambah `current_stock` di `raw_materials`, mencatat mutasi di `stock_ledger` (`GOODS_RECEIPT`), dan memperbarui `moving_avg_cost` jika harga beli diisi.
3. **Cek Ringkasan Cepat:**
   - Contoh: `cek stok`, `cek laba`, `rekap besok`
   - Aksi: Menampilkan ringkasan stok menipis, laba bersih bulan berjalan, atau jumlah pesanan untuk batch berikutnya.

---

## 4. Complete Visual Dashboard & Tracking Data
Selain input cepat lewat chat, `admin.nookcake.shop` menyediakan **Dashboard Visual Lengkap** untuk memantau seluruh performa bisnis dalam satu layar:
1. **Ringkasan KPI Utama (Cards):** Total Pendapatan, Laba Kotor (Gross Margin %), Laba Bersih (Take-Home Pay), BEP Progress, dan **ROE (%)**.
2. **Grafik Keuangan & Penjualan (Charts):**
   - Tren Pendapatan vs HPP vs Laba Bersih (harian / mingguan / bulanan).
   - Komposisi penjualan per produk (Bento, Slice, Whole Cake, Add-on Sauce).
3. **Visual Tracking Pesanan & Kuota Slot:**
   - Status pipeline pesanan (`Pending` $\rightarrow$ `Paid` $\rightarrow$ `Baking` $\rightarrow$ `Ready` $\rightarrow$ `Delivered`) dalam bentuk board/progress bar.
   - Indikator kapasitas Solo Baker harian (misal `12 / 16 Bento`).
4. **Visual Status Stok Bahan Baku:**
   - Bar indikator level stok tiap bahan (Aman / Menipis / Kritis di bawah `minimum_buffer`) beserta riwayat mutasi masuk-keluar.

---

## 5. Mobile-First UI & Bottom Navbar Quick Action
Karena Solo Baker sering mencatat pesanan dan belanja bahan langsung dari HP (di dapur atau di toko bahan), `admin.nookcake.shop` wajib memiliki tampilan **Mobile-First** yang nyaman digunakan satu tangan:
- **Responsive Layout:**
  - **Desktop/Tablet:** Sidebar navigasi di kiri (seperti layout admin saat ini).
  - **Mobile (`< 768px`):** Sidebar disembunyikan dan diganti dengan **Bottom Navigation Bar (Sticky)** di bagian bawah layar.
- **Bottom Navbar untuk Quick Action:**
  - **Dashboard** (Ringkasan KPI, Laba, ROE, & Grafik)
  - **Quick Chat** (Tombol tengah/utama untuk langsung buka chat input `order ...` / `masuk ...`)
  - **Orders** (Tracking status pesanan & kuota slot harian)
  - **Stok** (Cek level stok bahan & riwayat mutasi)
  - **Menu / Lainnya** (Kitchen Prep, Procurement, & Pengaturan Modal/OPEX)

---

## 6. Database (MySQL cPanel) & Metrik Keuangan

### 6.1 Penyesuaian Database
- Migrasi `src/db/schema.ts` dari `drizzle-orm/pg-core` (PostgreSQL) ke **`drizzle-orm/mysql-core` (MySQL)** + driver `mysql2`.
- Koneksi menggunakan `DATABASE_URL` di `.env` cPanel.

### 6.2 Tracking Pesanan, Stok, Laba & ROE
- **Tracking Pesanan:** Status order (`PENDING_PAYMENT` $\rightarrow$ `CONFIRMED_SLOT` $\rightarrow$ `BAKING` $\rightarrow$ `READY_FOR_DELIVERY` $\rightarrow$ `DELIVERED` / `CANCELLED`).
- **Laba Kotor & Laba Bersih:** Dihitung otomatis dari `orders` selesai dikurangi total HPP produk (`FINANCIAL_MASTER`) dan `OPEX` bulanan.
- **ROE (Return on Equity):**
  - Penambahan tabel/pengaturan **Modal Awal / Ekuitas Pemilik** (oven, chiller, loyang, modal bahan awal).
  - Rumus:
    $$\text{ROE} = \frac{\text{Laba Bersih}}{\text{Total Ekuitas Pemilik}} \times 100\%$$
  - Ditampilkan di halaman Analytics (`admin.nookcake.shop/analytics`).

---

## 7. Tahapan Implementasi
1. **Fase 1 — Subdomain & Auth:** Setup `middleware.ts` untuk `admin.nookcake.shop` + halaman login owner.
2. **Fase 2 — Database MySQL:** Konversi `src/db/schema.ts` ke MySQL, setup `src/db/index.ts`, dan push schema ke MySQL cPanel.
3. **Fase 3 — Admin Quick Chat:** Buat komponen UI Chat + Smart Parser lokal untuk input order & tambah stok.
4. **Fase 4 — Complete Visual Dashboard & Live Data:** Sambungkan Kitchen, Inventory, Order Tracking, dan Visual Dashboard (Grafik Keuangan, Pipeline Order, Indikator Stok, & ROE) ke MySQL.
