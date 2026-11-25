import { Product, DippingSauce, PreOrderSlot } from "@/types/catalog";

export const DIPPING_SAUCES: DippingSauce[] = [
  {
    id: "sauce-caramel",
    name: "Sea Salt Caramel (25ml)",
    price: 9000,
    description: "Saus karamel dengan garam laut",
    colorHex: "#D97706",
  },
  {
    id: "sauce-chocolate",
    name: "Dark Chocolate Ganache 70% (25ml)",
    price: 10000,
    description: "Ganache cokelat dengan cream",
    colorHex: "#3E2723",
  },
  {
    id: "sauce-berry",
    name: "Wild Berry Compote (25ml)",
    price: 10000,
    description: "Tart simmered raspberries, blackberries, and lemon zest",
    colorHex: "#881337",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-bento-classic",
    sku: "CAKE-BENTO-10X7",
    name: "The Burnt Corner Bento (10x7 cm)",
    variant: "BENTO",
    price: 59000,
    promoPrice: 52000,
    description:
      "Basque cheesecake dengan lapisan brownies, mahkota karamel panggang, dan bagian tengah yang lembut.",
    portion: "1 - 2 Orang",
    weightGrams: 280,
    dimensions: "10 x 7 cm",
    imageUrl: "/products/bento-classic.webp",
    availableAddons: DIPPING_SAUCES,
  },
  {
    id: "prod-slice-classic",
    sku: "CAKE-SLICE-CLASSIC",
    name: "Basque Cheesecake Slice",
    variant: "SLICE",
    price: 40000,
    description:
      "Satu potong dari lima bagian loyang. Pinggiran terpanggang dengan bagian tengah cream cheese yang lembut.",
    portion: "1 Orang",
    weightGrams: 210,
    imageUrl: "/products/slice-classic.webp",
    availableAddons: DIPPING_SAUCES,
  },
  {
    id: "prod-bento-matcha",
    sku: "CAKE-BENTO-MATCHA",
    name: "The Uji Matcha Basque (10x7 cm)",
    variant: "BENTO",
    price: 65000,
    description:
      "Basque cheesecake dengan matcha. Rasa teh hijau yang menyeimbangkan lembutnya cream cheese.",
    portion: "1 - 2 Orang",
    weightGrams: 285,
    dimensions: "10 x 7 cm",
    imageUrl: "/products/bento-matcha.webp",
    availableAddons: [DIPPING_SAUCES[0], DIPPING_SAUCES[1]],
  },
  {
    id: "prod-bento-biscoff",
    sku: "CAKE-BENTO-BISCOFF",
    name: "Caramelized Lotus Biscoff (10x7 cm)",
    variant: "BENTO",
    price: 65000,
    description:
      "Lapisan lelehan selai Lotus Biscoff berpadu remah biskuit karamel di atas basque cheesecake yang lumer.",
    portion: "1 - 2 Orang",
    weightGrams: 290,
    dimensions: "10 x 7 cm",
    imageUrl: "/products/bento-biscoff.webp",
    availableAddons: [DIPPING_SAUCES[0], DIPPING_SAUCES[1]],
  },
  {
    id: "prod-whole-celebration",
    sku: "CAKE-WHOLE-16CM",
    name: "Celebration Whole Basque (16 cm)",
    variant: "WHOLE",
    price: 195000,
    description:
      "Satu loyang Basque cheesecake untuk dinikmati bersama. Tambahkan ucapan untuk hari yang ingin dirayakan.",
    portion: "6 - 8 Orang",
    weightGrams: 980,
    dimensions: "Diameter 16 cm",
    imageUrl: "/products/whole-celebration.webp",
    availableAddons: DIPPING_SAUCES,
  },
];

export const INITIAL_PREORDER_SLOTS: PreOrderSlot[] = [];
