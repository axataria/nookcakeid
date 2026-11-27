"use client";
import { PRODUCTS } from "@/data/catalogData";
import { CakeCard } from "./CakeCard";

export function CakeCatalog() {
  return (
    <section id="menu" className="py-24 bg-[#F4F1E8] border-t border-[#00332A]/10">
      <div className="w-[min(1240px,calc(100%-48px))] mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-[#0E5B44] font-bold mb-3">
            02 / Menu
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#00332A] tracking-tight">
            Pilih yang mau dipesan.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-[#2E4732] mt-4 leading-relaxed">
            Bento 10 cm untuk porsi sendiri atau berdua, atau satu loyang utuh 18 cm untuk dinikmati ramai-ramai.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {PRODUCTS.map((product, index) => (
            <CakeCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <p className="font-mono text-xs text-[#687E6C] mt-10">
          * Seluruh pesanan sudah termasuk kemasan ramah lingkungan bagasse dan sendok kayu.
        </p>
      </div>
    </section>
  );
}
