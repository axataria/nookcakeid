"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Minus, Check } from "lucide-react";
import { Product, CartItemAddon } from "@/types/catalog";
import { useCartStore } from "@/store/useCartStore";
import { formatRupiah } from "@/lib/format";

export function CakeCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { addItem, items } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [addons, setAddons] = useState<CartItemAddon[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const units = (v: string) => (v === "WHOLE" ? 20 : v === "SLICE" ? 4 : 5);
  const used = items.reduce((n, i) => n + units(i.variant) * i.quantity, 0);
  const max = Math.max(0, Math.floor((80 - used) / units(product.variant)));
  const price = product.promoPrice ?? product.price;

  function add() {
    if (quantity > max) {
      setError("Kapasitas pesanan per sesi telah mencapai batas maksimal.");
      return;
    }
    setError("");
    addItem(product, quantity, addons, note);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
    setQuantity(1);
  }

  return (
    <motion.article
      className="bg-white rounded-2xl border-2 border-[#D9D3C5] p-4 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between group overflow-hidden"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <div>
        <div className="product-image overflow-hidden relative aspect-4/3 rounded-xl bg-[#F4F1E8] border border-stone-200">
          <Image
            src={product.imageUrl}
            alt={`Ilustrasi ${product.name}`}
            fill
            sizes="(max-width: 640px) 340px, (max-width: 1000px) 420px, 360px"
            quality={85}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <span className="absolute top-2 left-2 font-mono text-[10px] uppercase tracking-wider font-bold bg-[#0E5B44] text-[#C4DE6E] px-2 py-0.5 rounded shadow-sm">
            0{index + 1} · {product.variant}
          </span>
        </div>

        <div className="pt-4">
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <h3 className="font-display font-black text-lg sm:text-xl text-[#00332A] tracking-tight">
              {product.name}
            </h3>
            <span className="font-mono text-base font-bold text-[#0E5B44] shrink-0">
              {formatRupiah(price)}
            </span>
          </div>

          <p className="font-mono text-xs text-[#2E4732] leading-relaxed line-clamp-2">
            {product.description}
          </p>

          <p className="font-mono text-[11px] text-[#687E6C] mt-2">
            {product.portion.replaceAll(" - ", "–")} · {product.dimensions || "1/5 loyang"}
            {product.promoPrice ? " · Harga promo" : ""}
          </p>

          {/* Animated Addons Accordion */}
          <div className="mt-3.5 border-t border-[#D9D3C5] pt-2.5">
            <button
              type="button"
              className="flex items-center justify-between w-full py-1.5 text-xs font-mono font-medium text-[#2E4732] hover:text-[#00332A] transition-colors"
              onClick={() => setIsOptionsOpen((prev) => !prev)}
              aria-expanded={isOptionsOpen}
            >
              <span>+ Tambah saus / ucapan</span>
              <motion.span
                animate={{ rotate: isOptionsOpen ? 180 : 0 }}
                transition={{ duration: 0.22 }}
              >
                <ChevronDown className="w-3.5 h-3.5 text-[#0E5B44]" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOptionsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="options mt-2 mb-1 p-3 bg-[#FAF7F0] border border-[#D9D3C5] rounded-lg text-xs space-y-2">
                    {product.availableAddons.map((a) => (
                      <label
                        className="check-row flex items-center justify-between cursor-pointer"
                        key={a.id}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-[#0E5B44] rounded"
                            checked={addons.some((x) => x.sauceId === a.id)}
                            onChange={(e) =>
                              setAddons(
                                e.target.checked
                                  ? [
                                      ...addons,
                                      { sauceId: a.id, name: a.name, price: a.price },
                                    ]
                                  : addons.filter((x) => x.sauceId !== a.id),
                              )
                            }
                          />
                          <span className="font-mono text-xs">{a.name}</span>
                        </span>
                        <span className="font-mono font-bold text-[#0E5B44]">
                          {formatRupiah(a.price)}
                        </span>
                      </label>
                    ))}
                    <label className="field block pt-1">
                      <span className="block font-mono text-[11px] text-[#2E4732] mb-1">
                        Ucapan pada kartu:
                      </span>
                      <input
                        maxLength={160}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Contoh: Happy Birthday, Sarah! 🎂"
                        className="w-full text-xs p-2 rounded border border-[#D9D3C5] bg-white font-mono"
                      />
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <p className="font-mono text-xs text-red-600 mt-2" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-[#D9D3C5] flex items-center gap-3">
        <div className="flex items-center border border-[#D9D3C5] rounded-xl bg-[#F4F1E8] px-2 py-1">
          <motion.button
            whileTap={{ scale: 0.86 }}
            aria-label={`Kurangi ${product.name}`}
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => q - 1)}
            className="p-1 text-[#00332A] disabled:opacity-40"
          >
            <Minus className="w-3.5 h-3.5" />
          </motion.button>
          <output className="min-w-6 text-center font-mono font-bold text-xs text-[#00332A]">
            {quantity}
          </output>
          <motion.button
            whileTap={{ scale: 0.86 }}
            aria-label={`Tambah ${product.name}`}
            disabled={quantity >= max}
            onClick={() => setQuantity((q) => q + 1)}
            className="p-1 text-[#00332A] disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#0E5B44] text-[#FAF7F0] font-display font-extrabold text-sm hover:bg-[#0B4A37] transition-colors shadow-sm disabled:opacity-50"
          onClick={add}
          disabled={max === 0}
        >
          {justAdded ? (
            <span className="inline-flex items-center gap-1.5 text-[#C4DE6E]">
              <Check className="w-4 h-4" /> Ditambahkan
            </span>
          ) : (
            <span>Tambah +</span>
          )}
        </motion.button>
      </div>
    </motion.article>
  );
}
