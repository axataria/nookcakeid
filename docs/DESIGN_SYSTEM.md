# Design System & Design Tokens
## Project CISKEK: Tactile Artisan Bakery UI (Emil Kowalski Philosophy)

---

## 1. Filosofi Desain: Anti "AI Slop" & Craftsmanship

> *"Design is not just what it looks like and feels like. Design is how it animates, responds to touch, and respects the user's attention without gratuitous visual noise."* — Principles inspired by Emil Kowalski.

### Karakteristik "AI Slop" yang Dilarang Keras:
❌ **Dilarang:** Gradien ungu-ke-biru generik (*generic AI SaaS gradient*).  
❌ **Dilarang:** Efek neon glow/glassmorphism berlebihan yang mengaburkan teks.  
❌ **Dilarang:** Modal pop-up mengambang di layar HP yang merusak ergonomi jempol.  
❌ **Dilarang:** Icon dan ilustrasi 3D kartun generik yang tidak memiliki konteks bakery.  

### Karakteristik Desain CISKEK:
✅ **Artisan Warmth:** Palet warna hangat terinspirasi dari bahan asli: keju panggang (*burnt Basque*), lelehan mentega (*golden butter*), vanila, dan warna kontras kopi espresso tua.  
✅ **Tactile Feedback:** Tombol memiliki mikro-skala saat ditekan (`scale: 0.97`), transisi pegas fisik (*spring dynamics*), dan animasi counter angka (*smooth number ticker*).  
✅ **Thumb-Zone Ergonomics:** Semua aksi kritis (pilih tanggal slot, tambah loyang, checkout) berada di area bawah layar ponsel (*bottom sheet / sticky action bar*).  

---

## 2. Design Tokens (CSS Variables & Tailwind Config)

### 2.1 Palet Warna Semantik (*Cheesecake & Bakery Palette*)

```css
:root {
  /* Surface & Background */
  --bg-canvas: #FAF8F5;          /* Warm Cream / Tepung Vanila */
  --bg-card: #FFFFFF;            /* Pure Crisp White Card */
  --bg-card-subtle: #F3EFEA;     /* Soft Biscuit Crust */
  
  /* Text & Foreground */
  --text-primary: #1C1917;       /* Deep Espresso Stone-900 */
  --text-secondary: #78716C;     /* Warm Roast Stone-500 */
  --text-muted: #A8A29E;         /* Muted Stone-400 */
  
  /* Brand Accent: Burnt Basque Caramel */
  --primary: #D97706;            /* Rich Golden Caramel Amber-600 */
  --primary-hover: #B45309;      /* Deep Baked Amber-700 */
  --primary-subtle: #FEF3C7;     /* Butter Cream Amber-100 */
  --primary-contrast: #FFFFFF;   /* Text on Primary */
  
  /* Secondary Accent: Rich Dark Chocolate Brownies */
  --accent-brown: #3E2723;       /* Fudgy Brownies Cocoa */
  --accent-cheese: #FBBF24;      /* Melted Cheese Accent */
  
  /* Semantic Status */
  --success: #15803D;            /* Fresh Mint Leaf Green */
  --success-subtle: #DCFCE7;
  --warning: #C2410C;            /* Oven Flame Orange */
  --warning-subtle: #FFEDD5;
  --danger: #B91C1C;             /* Raspberry Red */
  --danger-subtle: #FEE2E2;

  /* Borders & Dividers */
  --border-light: #E7E5E4;       /* Subtle Warm Stone-200 */
  --border-focus: #D97706;

  /* Elevation Shadows (Soft Diffused, Zero Dirty Blur) */
  --shadow-subtle: 0 1px 2px 0 rgba(28, 25, 23, 0.04);
  --shadow-card: 0 4px 12px -2px rgba(28, 25, 23, 0.06), 0 2px 6px -1px rgba(28, 25, 23, 0.03);
  --shadow-float: 0 12px 32px -4px rgba(28, 25, 23, 0.12), 0 4px 12px -2px rgba(28, 25, 23, 0.06);

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;
}
```

---

## 3. Skala Tipografi & Hierarki Visual

Menggunakan font modern yang hangat, geometris, dan terbaca sangat tajam di layar ponsel: **Manrope** (geometric sans-serif untuk fungsional UI & nominal harga) dipadukan dengan **Fraunces** / **Cormorant Garamond** (editorial serif untuk branding `nook & cake.`).

| Token Level | Ukuran / Line-Height | Weight | Pemakaian Khusus |
| :--- | :--- | :--- | :--- |
| `display-1` | 32px / 1.15 | Bold (700) | Hero Headline Web Order |
| `title-1` | 24px / 1.25 | SemiBold (600) | Judul Katalog & Nama Varian Utama |
| `title-2` | 18px / 1.30 | SemiBold (600) | Header Bagian & Card Section |
| `body-base` | 15px / 1.50 | Regular (400) | Deskripsi Bahan, Catatan Pemesanan |
| `body-medium`| 15px / 1.50 | Medium (500) | Label Form, Status Slot |
| `label-sm` | 13px / 1.40 | Medium (500) | Badge Kapasitas, Tag Tanggal H-1 |
| `price-tag` | 20px / 1.20 | Bold (700) | Format Rupiah dengan Desimal Rapih |

---

## 4. Primitif Mikro-Interaksi (Emil Kowalski Style)

### 4.1 Parameter Fisika Spring Animation
```typescript
// Config standar spring transition
export const springPhysics = {
  tactile: { type: "spring", stiffness: 450, damping: 25 },  // Untuk button click & tap
  sheet: { type: "spring", stiffness: 300, damping: 30 },    // Untuk bottom sheet drawer (Vaul)
  counter: { type: "spring", stiffness: 500, damping: 35 },  // Untuk angka keranjang belanja
};
```

### 4.2 Spesifikasi Komponen Kunci

#### 1. Slot Date Picker Pill (Pilihan Tanggal H-1 / H-2)
- Bentuk pill horizontal scrollable di mobile.
- Menampilkan: Hari (e.g. "Kamis"), Tanggal ("24 Nov"), dan sisa kuota ("4 slot tersisa" / "Penuh").
- **State Interaktif:**
  - *Default:* Border abu halus, background putih.
  - *Active:* Background Caramel `primary`, teks putih, spring bounce kecil.
  - *Full/Sold Out:* Opacity 40%, garis coret, tidak bisa di-tap.

#### 2. Tactile Quantity Stepper (- 1 +)
- Menggantikan dropdown standar yang kaku.
- Tombol minus dan plus berbentuk lingkaran dengan diameter 36px (standar sentuhan jempol minimum).
- Angka di tengah menggunakan animasi **Animated Counter** (angka meluncur naik saat bertambah, meluncur turun saat berkurang).
- Saat mencapai batas slot, tombol `+` bergetar halus (*shake micro-animation*) sebagai feedback penolakan visual tanpa pop-up yang mengganggu.

#### 3. Sticky Checkout Drawer (Vaul Powered)
- Di mobile, keranjang belanja dan formulir pengiriman muncul sebagai **Bottom Sheet Drawer**.
- Bisa di-drag ke bawah secara natural untuk menutup.
- Tombol utama checkout melekat di dasar layar ponsel (*safe-area-inset-bottom*), menampilkan:
  - Jumlah item ("2 Kue Terpilih").
  - Total Harga ("Rp 118.000").
  - CTA Button ("Lanjut Pilih Jam Kirim $\rightarrow$").
