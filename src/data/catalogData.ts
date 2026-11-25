import { Product, DippingSauce, PreOrderSlot } from "@/types/catalog";

export const DIPPING_SAUCES: DippingSauce[] = [
  {
    id: "sauce-chocolate",
    name: "Chocolate Ganache (25ml)",
    price: 10000,
    description: "Saus cokelat pekat yang lumer dan lembut",
    colorHex: "#3E2723",
  },
  {
    id: "sauce-strawberry",
    name: "Selai Strawberry (25ml)",
    price: 10000,
    description: "Selai stroberi asam manis yang segar",
    colorHex: "#BE123C",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-whole-basque",
    sku: "CAKE-WHOLE-18CM",
    name: "The Whole Basque",
    variant: "WHOLE",
    price: 244000,
    promoPrice: 195000,
    badge: "Diskon 20%",
    description:
      "Satu loyang utuh Basque cheesecake original ukuran 18 cm dengan bagian tengah yang lembut dan lumer.",
    portion: "6 - 8 Orang",
    weightGrams: 1150,
    dimensions: "Diameter 18 cm",
    imageUrl: "/products/whole-celebration.webp",
    availableAddons: DIPPING_SAUCES,
  },
  {
    id: "prod-burnt-corner",
    sku: "CAKE-BURNT-CORNER-10CM",
    name: "The Burnt Corner",
    variant: "BENTO",
    price: 35000,
    description:
      "Cheesecake original dengan dasar brownies lembut dan bagian atas karamel panggang yang gurih manis.",
    portion: "1 - 2 Orang",
    weightGrams: 280,
    dimensions: "10 cm",
    imageUrl: "/products/bento-classic.webp",
    availableAddons: DIPPING_SAUCES,
  },
  {
    id: "prod-matcha-basque",
    sku: "CAKE-MATCHA-BASQUE-10CM",
    name: "The Matcha Basque",
    variant: "BENTO",
    price: 40000,
    description:
      "Cheesecake matcha dengan rasa teh hijau yang seimbang, dipadu dasar brownies lembut.",
    portion: "1 - 2 Orang",
    weightGrams: 285,
    dimensions: "10 cm",
    imageUrl: "/products/bento-matcha.webp",
    availableAddons: DIPPING_SAUCES,
  },
  {
    id: "prod-choco-basque",
    sku: "CAKE-CHOCO-BASQUE-10CM",
    name: "The Choco Basque",
    variant: "BENTO",
    price: 40000,
    description:
      "Cheesecake cokelat pekat yang lumer dengan dasar brownies cokelat.",
    portion: "1 - 2 Orang",
    weightGrams: 290,
    dimensions: "10 cm",
    imageUrl: "/products/bento-choco.webp",
    availableAddons: DIPPING_SAUCES,
  },
];

export const INITIAL_PREORDER_SLOTS: PreOrderSlot[] = [];
