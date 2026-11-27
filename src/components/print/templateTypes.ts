export type TemplateKind = "combo" | "care" | "thanks" | "gift" | "seal" | "sauce";
export type InkTheme = "brand" | "eco" | "forest" | "cream";

export interface CareCardConfig {
  badge: string;
  title: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  storageNote: string;
  manualLabel: string;
  stickerUrl: string;
}

export interface ThankYouCardConfig {
  badge: string;
  brandName: string;
  tagline: string;
  message: string;
  igHandle: string;
  waNumber: string;
  ctaText: string;
  subFooter: string;
  showGrid: boolean;
}

export interface GiftNoteConfig {
  header: string;
  toLabel: string;
  toValue: string;
  fromLabel: string;
  fromValue: string;
  messageValue: string;
  footerHandle: string;
}

export interface BoxSealConfig {
  brandName: string;
  badge: string;
  options: [string, string, string, string];
  rightLabel: string;
  rightSub: string;
}

export interface SauceLabelConfig {
  brandName: string;
  flavor1: string;
  flavor2: string;
  note: string;
}

export interface PrintTemplateConfig {
  templateKind: TemplateKind;
  inkTheme: InkTheme;
  showCropMarks: boolean;
  care: CareCardConfig;
  thanks: ThankYouCardConfig;
  gift: GiftNoteConfig;
  seal: BoxSealConfig;
  sauce: SauceLabelConfig;
}

export const STICKER_OPTIONS = [
  { label: "Classic Basque", url: "/stickers/sticker-slice-classic.png" },
  { label: "Uji Matcha", url: "/stickers/sticker-slice-matcha.png" },
  { label: "Dark Choco", url: "/stickers/sticker-slice-chocolate.png" },
  { label: "Fern Leaf", url: "/stickers/fern-leaf.png" },
  { label: "Tanpa Stiker", url: "" },
] as const;

export const DEFAULT_TEMPLATE_CONFIG: PrintTemplateConfig = {
  templateKind: "combo",
  inkTheme: "brand",
  showCropMarks: true,
  care: {
    badge: "CARE CARD · BENTO & WHOLE",
    title: "Satu Kue, Dua Tekstur.",
    step1Title: "1. Langsung dari Kulkas (2–6°C)",
    step1Desc:
      "Untuk tekstur padat, dingin & creamy. Cocok dipotong rapi dengan garpu.",
    step2Title: "2. Diamkan 15 Menit di Suhu Ruang",
    step2Desc:
      "Untuk bagian tengah yang lebih lumer & molten di setiap suapan.",
    storageNote: "Tanpa pengawet · Tahan 4–5 hari di chiller",
    manualLabel: "Dipanggang:",
    stickerUrl: "/stickers/sticker-slice-classic.png",
  },
  thanks: {
    badge: "HANDCRAFTED IN SMALL BATCHES",
    brandName: "nook cake",
    tagline: "your sweetest little escape.",
    message:
      "Terima kasih sudah memesan dari dapur kecil kami. Semoga potongan kue ini membuat harimu sedikit lebih manis.",
    igHandle: "IG: @nookcakeid",
    waNumber: "WA: 0851-5662-2944",
    ctaText: "Tag cerita manismu ↗",
    subFooter: "Fresh baked daily",
    showGrid: true,
  },
  gift: {
    header: "A SWEET LITTLE NOTE",
    toLabel: "Untuk:",
    toValue: "",
    fromLabel: "Dari:",
    fromValue: "",
    messageValue: "",
    footerHandle: "@nookcakeid",
  },
  seal: {
    brandName: "nook cake",
    badge: "FRESHLY BAKED",
    options: ["Original", "Matcha", "Choco", "Whole 18cm"],
    rightLabel: "BATCH",
    rightSub: "2–6°C Chiller",
  },
  sauce: {
    brandName: "nook cake",
    flavor1: "Choco Ganache",
    flavor2: "Selai Strawberry",
    note: "25ml · Simpan di chiller",
  },
};

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  patch: Partial<PrintTemplateConfig>;
}

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: "default",
    name: "Standard Harian",
    description: "Copywriting bawaan untuk pesanan bento & whole harian",
    patch: DEFAULT_TEMPLATE_CONFIG,
  },
  {
    id: "birthday",
    name: "Birthday / Gift",
    description: "Nada ucapan ulang tahun hangat untuk pesanan hadiah",
    patch: {
      templateKind: "gift",
      gift: {
        header: "HAPPY BIRTHDAY · SPECIAL BENTO",
        toLabel: "Untuk:",
        toValue: "",
        fromLabel: "Dari:",
        fromValue: "",
        messageValue:
          "Selamat ulang tahun! Semoga tahun barumu penuh kebahagiaan dan momen manis.",
        footerHandle: "@nookcakeid",
      },
      thanks: {
        ...DEFAULT_TEMPLATE_CONFIG.thanks,
        badge: "CELEBRATE WITH NOOK",
        message:
          "Selamat merayakan momen spesialmu! Semoga Basque cheesecake ini jadi bagian paling manis hari ini.",
      },
    },
  },
  {
    id: "repeat-promo",
    name: "Repeat Order Hook",
    description: "Ajak pelanggan pesan lagi atau tinggalkan review",
    patch: {
      templateKind: "thanks",
      thanks: {
        ...DEFAULT_TEMPLATE_CONFIG.thanks,
        badge: "REPEAT ORDER · FREE SAUCE?",
        message:
          "Suka dengan kuenya? Share di IG Story & tag @nookcakeid, lalu tunjukkan ke WA kami untuk bonus saus di order berikutnya.",
        ctaText: "Order lagi via WA ↗",
        subFooter: "Slot terbatas tiap hari",
      },
    },
  },
  {
    id: "kraft-eco",
    name: "Kraft / Hemat Tinta",
    description: "Garis tegas tanpa blok warna untuk kertas Kraft/krem",
    patch: {
      inkTheme: "eco",
      thanks: {
        ...DEFAULT_TEMPLATE_CONFIG.thanks,
        showGrid: false,
      },
    },
  },
];
