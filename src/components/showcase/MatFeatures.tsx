"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function MatFeatures() {
  const features = [
    {
      sticker: "/stickers/digicam.png",
      alt: "Vintage Digicam",
      width: 76,
      height: 76,
      rotate: -8,
      title: "Dipanggang Harian, Dari Nol",
      description:
        "Tanpa pengawet, tanpa batch pabrik. Keju Calf premium, Anchor cream, dan telur segar dipanggang setiap pagi untuk aroma karamel panggang yang harum.",
    },
    {
      sticker: "/stickers/orange-slice.png",
      alt: "Clementine Slice",
      width: 68,
      height: 88,
      rotate: 12,
      title: "Satu Kue, Dua Tekstur",
      description:
        "Nikmati langsung dari chiller untuk custard padat yang kokoh, atau diamkan 15 menit di suhu ruang untuk lelehan molten center yang lembut dan creamy.",
    },
    {
      sticker: "/stickers/hibiscus-flower.png",
      alt: "Hibiscus Flower",
      width: 72,
      height: 70,
      rotate: -6,
      title: "Pesan Cepat 1-Ketuk",
      description:
        "Pilih bento atau loyang besar, tambahkan saus cocolan artisan, lalu kirim ringkasan langsung ke WhatsApp baker dalam satu sentuhan tanpa registrasi rumit.",
    },
  ];

  return (
    <section className="py-20 bg-[#F4F1E8] border-t border-[#00332A]/10">
      <div className="w-[min(1240px,calc(100%-48px))] mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-[#0E5B44] font-bold mb-3">
            01 / Seni Membuat Kue Rumahan
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#00332A] tracking-tight">
            Kue yang dibuat pelan, dinikmati tanpa tergesa.
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
