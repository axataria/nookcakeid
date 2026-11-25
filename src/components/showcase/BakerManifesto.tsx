"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function BakerManifesto() {
  return (
    <section className="py-24 bg-[#EAE5D8] border-t border-[#00332A]/10">
      <div className="w-[min(960px,calc(100%-48px))] mx-auto text-center flex flex-col items-center">
        {/* Baker Avatar with Die-cut sticker shadow */}
        <motion.div
          whileHover={{ scale: 1.08, rotate: 4 }}
          className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] mb-8"
        >
          <Image
            src="/stickers/baker-avatar.jpg"
            alt="Baker Avatar"
            fill
            className="object-cover"
          />
        </motion.div>

        <p className="font-mono text-xs uppercase tracking-widest text-[#0E5B44] font-bold mb-4">
          04 / Catatan Dari Baker
        </p>

        <blockquote className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#00332A] leading-snug tracking-tight max-w-2xl mx-auto italic">
          &ldquo;Kue bukan sekadar makanan manis, melainkan meja kecil tempat kamu
          diizinkan sejenak beristirahat dan menikmati hari.&rdquo;
        </blockquote>

        <p className="font-mono text-xs sm:text-sm text-[#2E4732] max-w-xl mx-auto mt-6 leading-relaxed">
          Kami memanggang dalam jumlah yang bisa ditangani satu pasang tangan dengan
          sungguh-sungguh. Setiap loyang punya waktu untuk matang, mendingin perlahan,
          dan dikemas rapi untuk menemani secangkir kopi soremu.
        </p>

        {/* Cursive Handwritten Signature */}
        <div className="mt-8 font-hand text-4xl sm:text-5xl text-[#0E5B44] rotate-[-2deg] select-none">
          nook & cake.
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#687E6C] mt-1">
          Solo Founder & Baker · @nookandcake.id
        </span>
      </div>
    </section>
  );
}
