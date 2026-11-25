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
  const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
  const totalItemPrice = (price + addonsTotal) * quantity;

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
          {product.promoPrice && (
            <span className="absolute top-2 right-2 font-mono text-[10px] uppercase tracking-wider font-bold bg-[#E11D48] text-white px-2 py-0.5 rounded shadow-sm">
              Diskon 20%
            </span>
          )}
        </div>

        <div className="pt-4">
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <h3 className="font-display font-black text-lg sm:text-xl text-[#00332A] tracking-tight">
              {product.name}
            </h3>
            <div className="flex flex-col items-end shrink-0 leading-tight">
              {product.promoPrice && (
                <span className="font-mono text-xs line-through text-stone-400 font-normal">
                  {formatRupiah(product.price)}
                </span>
              )}
              <span className="font-mono text-base font-bold text-[#0E5B44]">
                {formatRupiah(price)}
              </span>
            </div>
          </div>

          <p className="font-mono text-xs text-[#2E4732] leading-relaxed line-clamp-2">
            {product.description}
          </p>

          <p className="font-mono text-[11px] text-[#687E6C] mt-2">
            {product.portion.replaceAll(" - ", "–")} · {product.dimensions || "1/5 loyang"}
            {product.promoPrice ? " · Diskon 20%" : ""}
          </p>

          {/* 1. Ekstra Saus Cocolan 25ml */}
          <div className="mt-3 pt-2.5 border-t border-[#EAE5D8]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#0E5B44] flex items-center gap-1.5">
                <span>Ekstra Saus (25ml)</span>
              </span>
              {addons.length > 0 && (
                <span className="font-mono text-[10px] text-[#0E5B44] bg-[#C4DE6E]/40 px-1.5 py-0.5 rounded font-bold">
                  +{formatRupiah(addonsTotal)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {product.availableAddons.map((a) => {
                const isSelected = addons.some((x) => x.sauceId === a.id);
                return (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => {
                      setAddons(
                        isSelected
                          ? addons.filter((x) => x.sauceId !== a.id)
                          : [...addons, { sauceId: a.id, name: a.name, price: a.price }],
                      );
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-[#0E5B44]/8 border-[#0E5B44] shadow-sm text-[#00332A]"
                        : "bg-[#FAF7F0] border-[#D9D3C5] hover:border-[#0E5B44]/50 text-[#2E4732]"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-inner flex items-center justify-center border border-black/10"
                      style={{ backgroundColor: a.colorHex }}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-bold text-xs truncate leading-tight">
                        {a.name.replace(" (25ml)", "")}
                      </p>
                      <p className="font-mono text-[10px] text-[#0E5B44] font-bold">
                        +{formatRupiah(a.price)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Kartu Ucapan / Gift Message Accordion */}
          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => setIsOptionsOpen((prev) => !prev)}
              className={`flex items-center justify-between w-full py-1.5 px-2.5 rounded-xl border text-[11px] font-mono transition-colors ${
                note
                  ? "bg-[#0E5B44]/5 border-[#0E5B44]/40 text-[#00332A]"
                  : "bg-[#FAF7F0] hover:bg-[#F4F1E8] border-[#D9D3C5] text-[#2E4732]"
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <span aria-hidden="true">💌</span>
                <span className="font-bold">
                  {note ? "Kartu Ucapan Terpasang" : "Tulis Ucapan di Kartu"}
                </span>
                <span className="text-[#0E5B44] font-semibold text-[9.5px] bg-[#C4DE6E]/40 px-1.5 py-0.2 rounded shrink-0">
                  Gratis
                </span>
              </span>
              <div className="flex items-center gap-1 text-[#0E5B44] shrink-0">
                <motion.span
                  animate={{ rotate: isOptionsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOptionsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-1.5 p-2.5 bg-[#FAF7F0] border border-[#D9D3C5] rounded-xl text-xs relative">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#687E6C] mb-1">
                      <span>Pesan pada Care Card:</span>
                      <span className={note.length > 140 ? "text-amber-600 font-bold" : ""}>
                        {note.length}/160
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      maxLength={160}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Contoh: Selamat ulang tahun, Sarah! 🎂 Semoga rehat soremu semakin manis."
                      className="w-full text-xs p-2 rounded-lg border border-[#D9D3C5] bg-white font-mono text-[#00332A] placeholder:text-stone-400 focus:outline-none focus:border-[#0E5B44] resize-none leading-relaxed"
                    />
                    {note && (
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-sans italic text-[10px] text-[#0E5B44] truncate max-w-[200px]">
                          &ldquo;{note}&rdquo;
                        </span>
                        <button
                          type="button"
                          onClick={() => setNote("")}
                          className="text-[10px] font-mono text-stone-500 hover:text-red-600 underline shrink-0"
                        >
                          Hapus ucapan
                        </button>
                      </div>
                    )}
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

      <div className="mt-4 pt-3 border-t border-[#D9D3C5] flex items-center gap-3">
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
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#0E5B44] text-[#FAF7F0] font-display font-extrabold text-xs sm:text-sm hover:bg-[#0B4A37] transition-colors shadow-sm disabled:opacity-50"
          onClick={add}
          disabled={max === 0}
        >
          {justAdded ? (
            <span className="inline-flex items-center gap-1.5 text-[#C4DE6E]">
              <Check className="w-4 h-4" /> Ditambahkan
            </span>
          ) : (
            <span>Tambah · {formatRupiah(totalItemPrice)}</span>
          )}
        </motion.button>
      </div>
    </motion.article>
  );
}
