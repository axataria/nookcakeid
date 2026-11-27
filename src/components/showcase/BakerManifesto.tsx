"use client";
import React from "react";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  text: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "ADC",
    text: "Enak banget, teksturnya pas dan nggak bikin enek. Sudah pesan dua kali buat acara di rumah.",
  },
  {
    name: "Mumut",
    text: "Baru pertama kali coba yang burnt corner, ternyata cocok banget sama kopi. Packaging-nya juga rapi.",
  },
  {
    name: "Tiara",
    text: "Manisnya pas, nggak kemanisan. Yang matcha juga berasa banget tapi tetap lembut.",
  },
  {
    name: "Riki",
    text: "Pesan yang whole 18cm buat ulang tahun, semua pada suka. Pengiriman aman sampai tujuan.",
  },
  {
    name: "Pelanggan",
    text: "Bento-nya pas banget buat dimakan sendiri. Saus cokelatnya juga enak, nggak terlalu manis.",
  },
  {
    name: "Pelanggan",
    text: "Simpan di kulkas besoknya masih enak dan lembut. Pasti bakal repeat order lagi.",
  },
];

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 bg-white rounded-2xl border-2 border-[#D9D3C5] p-5 shadow-sm flex flex-col justify-between gap-4">
      <div className="flex items-center gap-1 text-[#D97706]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>
      <p className="font-mono text-xs sm:text-sm text-[#2E4732] leading-relaxed">
        &ldquo;{item.text}&rdquo;
      </p>
      <div className="font-display font-bold text-sm text-[#00332A] pt-2 border-t border-[#D9D3C5]/60">
        {item.name}
      </div>
    </div>
  );
}

export function BakerManifesto() {
  const loopItems = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-20 bg-[#EAE5D8] border-t border-[#00332A]/10 overflow-hidden">
      <div className="w-[min(1240px,calc(100%-48px))] mx-auto text-center mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-[#0E5B44] font-bold mb-3">
          03 / Kata Mereka
        </p>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#00332A] tracking-tight">
          Ulasan pelanggan kami.
        </h2>
      </div>

      <div className="relative w-full overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-24 z-10 bg-gradient-to-r from-[#EAE5D8] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-24 z-10 bg-gradient-to-l from-[#EAE5D8] to-transparent"
        />
        <div className="flex gap-6 w-max animate-marquee-left hover:[animation-play-state:paused] px-3">
          {loopItems.map((item, idx) => (
            <TestimonialCard key={`${item.name}-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
