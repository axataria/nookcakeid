# Project Structure & Brand Style Guide
## nook & cake. (`@nookandcake.id`)
### *your sweetest little escape.*

---

## 1. Brand Identity & Visual Aesthetic Style

Dokumen ini mendefinisikan identitas brand, arah visual (*art direction*), dan pemetaan ke dalam struktur sistem aplikasi web pre-order & ERP **nook & cake.**.

```text
               nook & cake.
      — your sweetest little escape —
```

| Atribut Brand | Nilai Spesifikasi | Implementasi Visual & Teknis |
| :--- | :--- | :--- |
| **Brand Name** | **`nook & cake.`** | Ditulis serba huruf kecil (*lowercase*) dengan tanda titik di akhir untuk kesan *understated luxury*. |
| **Tagline** | *"your sweetest little escape."* | Warm & conversational; mengomunikasikan rehat manis di tengah rutinitas. |
| **Instagram / Medsos** | **`@nookandcake.id`** | Handle resmi pada kanal media sosial dan footer PWA. |
| **Hero / Signature Menu** | **The Burnt Corner** | Artisan Burnt Basque Cheesecake dengan aroma smoky caramel & *custard-like center*. |
| **Gaya Desain** | **Warm Minimalist / Korean-Editorial Bakery** | Paduan tekstur linen/oatmeal, tipografi editorial serif, dan interaksi taktil (anti AI-slop). |
| **Material Kemasan** | **Oatmeal / Linen Beige** | Dus kraft bertekstur, kertas roti *unbleached*, pita katun/rami, stempel tinta espresso. |

---

## 2. Tipografi & Skala Font (Editorial & Chic)

Sesuai arahan desain, tipografi memadukan font **Editorial Serif** yang anggun untuk *branding / headline* dan font **Sans-Serif modern** untuk kejelasan fungsional di layar ponsel (*mobile ergonomics*):

* **Heading & Display Font:** **Fraunces** atau **Cormorant Garamond** (Serif ramping, *high-contrast*, berkarakter hangat).
* **Body & Functional UI Font:** **Manrope** (Modern geometric sans-serif, bersih, ergonomis, dan terbaca sangat tajam untuk angka, nominal harga, dan slot kalender).

```css
/* Typography Token Mapping */
--font-serif-editorial: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
--font-sans-ui: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
```

---

## 3. Palet Warna Semantik & Desain Token (Oatmeal & Linen Theme)

```css
:root {
  /* Canvas & Linen Neutrals */
  --color-canvas-oatmeal: #FAF7F2;     /* Latar belakang utama: warna gandum / linen alami */
  --color-card-linen:     #FFFFFF;     /* Kartu produk bersih */
  --color-card-subtle:    #F4EFE6;     /* Aksen biskuit / oatmeal lembut */
  --color-border-subtle:  #E8E1D5;     /* Garis tepi hangat bertekstur linen */

  /* Text & Inks */
  --color-ink-espresso:   #1C1917;     /* Teks utama: espresso tua (Stone-900) */
  --color-ink-muted:      #78716C;     /* Teks sekunder: warm roast (Stone-500) */

  /* Brand Signature: The Burnt Corner */
  --color-burnt-caramel:  #D97706;     /* Amber-600: lelehan karamel basque */
  --color-caramel-deep:   #B45309;     /* Amber-700: warna crust terpanggang */
  --color-butter-cream:   #FEF3C7;     /* Amber-100: warna mentega & custard keju */

  /* Packaging & Accent */
  --color-kraft-paper:    #D7C4B7;     /* Aksen pita/tali kardus kraft */
  --color-sage-accent:    #84907E;     /* Aksen herbal / matcha basque */
}
```

---

## 4. Struktur Folder Repositori (Next.js 15 Modular Monolith)

Struktur direktori dirancang modular memisahkan antarmuka pelanggan mobile-first dengan dashboard dapur dan kalkulasi HPP:

```text
appciskek/
├── docs/                                  # Dokumentasi arsitektur & rekayasa teknis
│   ├── ARCHITECTURE.md                    # Desain sistem modular, Redis lock, & flow data
│   ├── DESIGN_SYSTEM.md                   # Desain token, komponen taktil, & Emil Kowalski physics
│   ├── ERD_DATABASE.md                    # Skema relasional PostgreSQL & Drizzle ORM
│   ├── HPP_DAN_LABA_RUGI.md               # Master HPP, laba rugi, BEP & tren menu artisan
│   └── MOBILE_UX.md                       # Screen flow pre-order mobile & tablet kitchen
├── public/                                # Static assets publik
│   ├── branding/                          # Aset visual nook & cake.
│   │   ├── logo-serif.svg                 # Logo nook & cake. format SVG
│   │   ├── stamp-burnt-corner.svg         # Stamp stiker The Burnt Corner
│   │   └── packaging-texture.png          # Tekstur linen/oatmeal kraft
│   └── icons/                             # Favicon & PWA icons
├── src/
│   ├── app/                               # Next.js 15 App Router
│   │   ├── (customer)/                    # Route Group: Pengalaman Belanja Pelanggan (PWA)
│   │   │   ├── layout.tsx                 # Mobile-first frame dengan typography serif
│   │   │   ├── page.tsx                   # Katalog menu & hero The Burnt Corner
│   │   │   ├── slot/                      # Pemilihan slot pre-order H-1/H-2
│   │   │   ├── checkout/                  # Drawer checkout taktil (Vaul)
│   │   │   └── order/[id]/                # Halaman status pesanan & panduan simpan
│   │   ├── (admin)/                       # Route Group: Kitchen & Owner Dashboard
│   │   │   ├── layout.tsx                 # Responsive desktop & tablet layout
│   │   │   ├── kitchen/                   # MRP kitchen display & oven schedule
│   │   │   ├── inventory/                 # Master bahan, stock ledger, & open PO
│   │   │   └── analytics/                 # Analisis laba bersih & HPP moving average
│   │   ├── api/                           # Webhook & Server Actions
│   │   │   ├── midtrans/                  # Webhook pembayaran QRIS
│   │   │   └── whatsapp/                  # Notifikasi konfirmasi otomatis
│   │   ├── globals.css                    # Setup Tailwind v4 & CSS variables oatmeal/linen
│   │   └── layout.tsx                     # Root layout dengan Font Fraunces & Manrope
│   ├── components/                        # UI Components Library
│   │   ├── branding/                      # Komponen brand nook & cake.
│   │   │   ├── BrandHeader.tsx            # Header serba huruf kecil + tagline
│   │   │   └── CareCardModal.tsx          # Serving guide The Burnt Corner
│   │   ├── catalog/                       # Kartu menu kue & detail varian
│   │   │   └── CakeCard.tsx               # Card aspect-[4/3] dengan micro-animations
│   │   ├── slot-picker/                   # Kalender pill geser jempol
│   │   │   └── SlotDatePill.tsx           # Badge kuota slot oven harian
│   │   └── ui/                            # Primitif Radix UI & Vaul Drawer
│   │       ├── button.tsx                 # Taktil button (scale: 0.97 spring feedback)
│   │       └── drawer.tsx                 # Bottom sheet swipeable
│   ├── db/                                # Database & ORM Layer
│   │   ├── schema/                        # Skema Drizzle (BOM, orders, slots, inventory)
│   │   ├── migrations/                    # SQL migrations
│   │   └── index.ts                       # Koneksi database PostgreSQL
│   ├── lib/                               # Utility & Helper Functions
│   │   ├── finance.ts                     # Kalkulasi HPP presisi integer (Bento & Slice)
│   │   ├── mrp-engine.ts                  # Perhitungan kebutuhan bahan otomatis
│   │   └── spring-physics.ts              # Konfigurasi motion ala Emil Kowalski
│   └── types/                             # TypeScript interfaces & Zod schemas
├── AGENT.md                               # Panduan teknis AI Engineer (Anti AI-Slop)
├── PRD.md                                 # Product Requirements Document & BOM resep
├── README.md                              # Dokumentasi ringkas proyek
└── STRUCTURE.md                           # File ini (Brand style & system architecture map)
```

---

## 5. Standar Komponen & Brand Touchpoints

### 5.1 Kartu Produk Hero (*The Burnt Corner*)
* **Visual:** Rasio foto `aspect-[4/3]`, sudut melengkung halus (`rounded-2xl`), shadow lembut alami (`shadow-card` tanpa blur hitam kotor).
* **Tagline Produk:** *"our signature burnt basque with creamy custard center & caramelized crown."*
* **Badge Slot:** Pill kecil warna linen dengan teks espresso: *"Tersedia untuk slot besok"*.

### 5.2 Micro-Interactions (Emil Kowalski Philosophy)
* **Tap Feedback:** Tombol aksi utama mengecil halus (`scale: 0.97`) dan membal menggunakan spring physics (`stiffness: 450, damping: 25`).
* **Drawer Checkout:** Meluncur dari bawah dengan latar belakang oatmeal lembut dan sudut lengkung atas 24px.
