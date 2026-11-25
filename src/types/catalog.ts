export type ProductVariant = 'BENTO' | 'SLICE' | 'WHOLE';

export interface DippingSauce {
  id: string;
  name: string;
  price: number;
  description: string;
  colorHex: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  variant: ProductVariant;
  price: number;
  promoPrice?: number;
  description: string;
  badge?: string;
  portion: string;
  weightGrams: number;
  dimensions?: string;
  imageUrl: string;
  availableAddons: DippingSauce[];
}

export interface CartItemAddon {
  sauceId: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // Unique ID per custom cart entry
  productId: string;
  name: string;
  variant: ProductVariant;
  unitPrice: number;
  quantity: number;
  selectedAddons: CartItemAddon[];
  customNote?: string;
}

export interface PreOrderSlot {
  dateKey: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Besok" or "Rabu"
  dateFormatted: string; // e.g. "24 Nov"
  fullDate: string; // e.g. "Selasa, 24 November 2026"
  totalCapacity: number; // e.g. 16 Bento
  bookedCapacity: number; // e.g. 11 Bento
  isCutOff: boolean; // True if past 16:00 WIB for tomorrow
  isSoldOut: boolean;
}
