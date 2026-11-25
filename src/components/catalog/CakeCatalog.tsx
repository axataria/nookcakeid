"use client";
import { PRODUCTS } from "@/data/catalogData";
import { CakeCard } from "./CakeCard";

export function CakeCatalog() {
  return (
    <section id="menu" className="py-24 bg-[#F4F1E8] border-t border-[#00332A]/10">
      <div className="w-[min(1240px,calc(100%-48px))] mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-[#0E5B44] font-bold mb-3">
            03 / Menu Meja Kerja Kami
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#00332A] tracking-tight">
            Pilih rehat manismu.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-[#2E4732] mt-4 leading-relaxed">
            Bento untuk sendiri atau berdua. Satu slice untuk jeda sore. Satu
            loyang besar untuk dibagi. Dibuat hangat sesuai pesanan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
