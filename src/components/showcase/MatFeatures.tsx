"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function MatFeatures() {
  const features = [
    {
      sticker: "/stickers/sticker-slice-classic.png",
      alt: "Classic Burnt Basque Cheesecake",
      width: 112,
      height: 90,
      rotate: -6,
      title: "Dipanggang Setiap Hari",
      description:
        "Tanpa pengawet, tanpa stok lama. Setiap loyang dipanggang baru setiap pagi supaya aromanya tetap wangi dan teksturnya pas.",
    },
    {
      sticker: "/stickers/sticker-slice-matcha.png",
      alt: "Uji Matcha Basque Cheesecake",
      width: 112,
      height: 90,
      rotate: 7,
      title: "Satu Kue, Dua Tekstur",
      description:
        "Langsung makan dari kulkas kalau suka tekstur yang padat, atau diamkan 15 menit di suhu ruang buat tengahnya yang lebih lumer.",
    },
    {
      sticker: "/stickers/sticker-slice-chocolate.png",
      alt: "Dark Chocolate Basque Cheesecake",
      width: 112,
      height: 90,
      rotate: -5,
      title: "Pesan Langsung via WhatsApp",
      description:
        "Pilih ukuran bento atau loyang utuh, tambah saus kalau mau, lalu kirim ringkasannya ke WhatsApp tanpa perlu daftar akun.",
    },
  ];

  return (
    <section className="py-20 bg-[#F4F1E8] border-t border-[#00332A]/10">
      <div className="w-[min(1240px,calc(100%-48px))] mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-[#0E5B44] font-bold mb-3">
            01 / Cara Kami Bikin Kue
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#00332A] tracking-tight">
            Dibuat dalam jumlah terbatas, dipanggang setiap hari.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center group"
            >
              <div className="h-28 flex items-center justify-center mb-6">
                <motion.div
                  initial={{ rotate: f.rotate }}
                  whileHover={{ scale: 1.15, rotate: f.rotate * 1.5 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  className="drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)] cursor-pointer"
                >
                  <Image
                    src={f.sticker}
                    alt={f.alt}
                    width={f.width}
                    height={f.height}
                    className="select-none pointer-events-none"
                  />
                </motion.div>
              </div>

              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#00332A] mb-3 group-hover:text-[#0E5B44] transition-colors">
                {f.title}
              </h3>
              <p className="font-mono text-xs sm:text-sm text-[#2E4732] leading-relaxed max-w-xs">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
