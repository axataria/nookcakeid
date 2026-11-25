"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useMounted } from "@/lib/useMounted";
import { formatRupiah } from "@/lib/format";

export function CartBottomBar() {
  const s = useCartStore();
  const mounted = useMounted();

  const isVisible = mounted && s.items.length > 0 && !s.isCartDrawerOpen;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="cart-bar"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => s.setIsCartDrawerOpen(true)}
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            <span className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-amber-200" />
              <span>
                <strong>{s.getTotalCount()} item</strong> · {formatRupiah(s.getSubtotal())}
              </span>
            </span>
            <span className="font-semibold text-amber-100">Lihat keranjang ↗</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
