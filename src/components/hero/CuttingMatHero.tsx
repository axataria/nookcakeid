"use client";
import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, Move3d } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((module) => module.HeroCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-full text-emerald-100 font-mono text-xs gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-300 border-t-transparent animate-spin" />
        <span>Menyiapkan loyang di atas cutting mat...</span>
      </div>
    ),
  },
);

const STICKERS = [
  {
    id: "slice-classic",
    src: "/stickers/sticker-slice-classic.png",
    alt: "The Burnt Corner Classic Slice",
    width: 122,
    height: 98,
    initial: { top: "6%", left: "5%", rotate: -12 },
  },
  {
    id: "slice-matcha",
    src: "/stickers/sticker-slice-matcha.png",
    alt: "Uji Matcha Basque Slice",
    width: 120,
    height: 96,
    initial: { top: "5%", right: "6%", rotate: 16 },
  },
  {
    id: "slice-biscoff",
    src: "/stickers/sticker-slice-biscoff.png",
    alt: "Lotus Biscoff Crunch Slice",
    width: 122,
    height: 98,
    initial: { bottom: "13%", left: "6%", rotate: 10 },
  },
  {
    id: "slice-berry",
    src: "/stickers/sticker-slice-berry.png",
    alt: "Wild Berry Compote Slice",
    width: 120,
    height: 96,
    initial: { bottom: "11%", right: "5%", rotate: -14 },
  },
  {
    id: "slice-caramel",
    src: "/stickers/sticker-slice-caramel.png",
    alt: "Sea Salt Caramel Lava Slice",
    width: 118,
    height: 94,
    initial: { top: "42%", left: "3%", rotate: 20 },
  },
  {
    id: "slice-chocolate",
    src: "/stickers/sticker-slice-chocolate.png",
    alt: "Dark Chocolate 70% Slice",
    width: 120,
    height: 96,
    initial: { top: "40%", right: "3%", rotate: -18 },
  },
  {
    id: "slice-pistachio",
    src: "/stickers/sticker-slice-pistachio.png",
    alt: "Pistachio Velvet Slice",
    width: 118,
    height: 94,
    initial: { bottom: "8%", left: "42%", rotate: 4 },
  },
  {
    id: "slice-chiller",
    src: "/stickers/sticker-slice-chiller.png",
    alt: "Firm Chiller 2°C Custard Slice",
    width: 118,
    height: 94,
    initial: { top: "4%", left: "46%", rotate: -6 },
  },
];

export function CuttingMatHero() {
  const [view, setView] = useState<"scroll" | "whole" | "slice">("scroll");
  const open = useCartStore((s) => s.setIsCartDrawerOpen);
  const totalCount = useCartStore((s) => s.getTotalCount());
  const matRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative pt-6 pb-20 overflow-hidden bg-[#F4F1E8]">
      {/* 1. TOP FLOATING BADGE & NAV */}
      <div className="w-[min(1240px,calc(100%-48px))] mx-auto flex flex-col items-center gap-6">
        <header className="w-full flex items-center justify-between py-2">
          <Link
            className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-[#00332A] hover:opacity-85 transition-opacity"
            href="/"
            aria-label="nook and cake, beranda"
          >
            nook & cake.
          </Link>
          <nav aria-label="Navigasi utama" className="flex items-center gap-5">
            <a
              href="#menu"
              className="text-sm font-display font-bold text-[#00332A] hover:text-[#0E5B44] transition-colors"
            >
              Menu
            </a>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => open(true)}
              className="relative px-4 py-2 rounded-full border border-[#00332A]/20 bg-white/80 backdrop-blur-sm text-sm font-display font-bold text-[#00332A] hover:border-[#0E5B44] hover:text-[#0E5B44] transition-colors shadow-sm"
            >
              Keranjang
              {totalCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-[#0E5B44] text-white rounded-full font-bold font-mono">
                  {totalCount}
                </span>
              )}
            </motion.button>
          </nav>
        </header>

        {/* Live Camera / Oven Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00332A]/20 bg-[#FAF7F0] text-xs font-mono text-[#00332A]/80 shadow-sm">
          <Camera className="w-3.5 h-3.5 text-[#0E5B44]" />
          <span>Live from our small-batch oven. Basque cheesecake & brownies.</span>
        </div>

        {/* 2. INLINE STICKER HEADLINE */}
        <div className="max-w-4xl text-center pt-2 pb-4">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.12] tracking-tight text-[#00332A] select-none">
            the warm{" "}
            <span className="inline-block align-middle mx-1.5 -translate-y-1">
              <Image
                src="/stickers/mat-icon.png"
                alt="Cutting mat icon"
                width={56}
                height={40}
                className="inline-block drop-shadow-md hover:scale-110 transition-transform cursor-pointer"
              />
            </span>{" "}
            where your sweetest{" "}
            <span className="inline-block align-middle mx-1 -translate-y-1">
              <Image
                src="/stickers/sticker-slice-matcha.png"
                alt="Matcha Basque Slice sticker"
                width={46}
                height={38}
                className="inline-block drop-shadow-md hover:rotate-6 hover:scale-115 transition-transform cursor-pointer"
              />
            </span>{" "}
            moments live on your{" "}
            <span className="inline-block align-middle mx-1 -translate-y-1">
              <Image
                src="/stickers/sticker-slice-classic.png"
                alt="Classic Basque Slice sticker"
                width={48}
                height={40}
                className="inline-block drop-shadow-md hover:-rotate-6 hover:scale-115 transition-transform cursor-pointer"
              />
            </span>{" "}
            table.
          </h1>

          <p className="font-mono text-sm sm:text-base text-[#2E4732] max-w-2xl mx-auto mt-6 leading-relaxed">
            Mahkota karamel panggang, bagian tengah yang lumer. Dibuat sesuai
            pesanan dari dapur kecil nook & cake., dinikmati pelan.
          </p>

          {/* 3. CTA BUTTON (EMERALD PILL WITH GRID OVERLAY) */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <motion.a
              href="#menu"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#0E5B44] text-[#FAF7F0] font-display font-bold text-base shadow-[0_10px_25px_-5px_rgba(14,91,68,0.4),0_4px_10px_-2px_rgba(14,91,68,0.2)] overflow-hidden group border border-[#0B4A37]"
            >
              {/* Subtle Grid texture overlay on button */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none bg-repeat bg-center"
                style={{
                  backgroundImage: "url(/stickers/cutting-mat-grid.svg)",
                  backgroundSize: "180px",
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Pilih Rehat Manismu <span aria-hidden="true">🍰</span>
              </span>
            </motion.a>

            <div className="flex items-center gap-2.5 text-xs font-mono text-[#687E6C] mt-1">
              <Image
                src="/stickers/fern-leaf.png"
                alt="Fern leaf"
                width={32}
                height={18}
                className="opacity-75 inline-block"
              />
              <span>Bento mulai Rp 52.000 · Kemasan eco bagasse termasuk</span>
              <Image
                src="/stickers/fern-leaf.png"
                alt="Fern leaf"
                width={32}
                height={18}
                className="opacity-75 inline-block -scale-x-100"
              />
            </div>
          </div>
        </div>

        {/* 4. THE INTERACTIVE CUTTING MAT PLAYGROUND CANVAS */}
        <div
          ref={matRef}
          className="w-full mt-6 rounded-[28px] sm:rounded-[36px] bg-[#0E5B44] border-4 border-[#0B4A37] shadow-[0_24px_50px_-12px_rgba(0,51,42,0.35)] relative overflow-hidden select-none"
          style={{ minHeight: "560px" }}
        >
          {/* Authentic Cutting Mat Metric Grid Vector */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 bg-cover bg-center"
            style={{
              backgroundImage: "url(/stickers/cutting-mat-grid.svg)",
            }}
          />

          {/* Metric Measurement Numbers along the border */}
          <div className="absolute top-2 left-6 right-6 flex justify-between font-mono text-[10px] text-[#C4DE6E]/60 pointer-events-none uppercase tracking-widest">
            <span>METRIC CUTTING MAT A2</span>
            <span>GRID SCALE 1:1</span>
            <span>NOOK & CAKE STUDIO</span>
          </div>

          {/* CENTERPIECE: 3D BASQUE CHEESECAKE STAGE */}
          <div className="relative w-full h-[540px] flex items-center justify-center z-10">
            <HeroCanvas view={view} />
          </div>

          {/* DRAGGABLE DIE-CUT STICKERS AROUND THE WORKBENCH */}
          {STICKERS.map((s) => (
            <motion.div
              key={s.id}
              drag
              dragConstraints={matRef}
              dragElastic={0.12}
              style={{
                position: "absolute",
                top: s.initial.top,
                bottom: s.initial.bottom,
                left: s.initial.left,
                right: s.initial.right,
                zIndex: 20,
              }}
              initial={{ rotate: s.initial.rotate }}
              whileHover={{ scale: 1.12, rotate: s.initial.rotate + 6, cursor: "grab" }}
              whileDrag={{
                scale: 1.25,
                rotate: s.initial.rotate - 10,
                cursor: "grabbing",
                zIndex: 50,
              }}
              className="drop-shadow-[0_12px_18px_rgba(0,0,0,0.32)] filter active:drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)] transition-shadow"
            >
              <Image
                src={s.src}
                alt={s.alt}
                width={s.width}
                height={s.height}
                className="pointer-events-none select-none"
                draggable={false}
              />
            </motion.div>
          ))}

          {/* Mat Bottom Status Bar & View Mode Controls */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-3 z-30 pointer-events-auto">
            <div className="inline-flex items-center gap-2 bg-[#0B4A37]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C4DE6E]/30 text-xs font-mono text-[#C4DE6E]">
              <Move3d className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Meja kerja bebas:</span> Geser stiker & putar kue 360°
            </div>

            <div
              className="inline-flex items-center gap-1 bg-[#0B4A37]/90 backdrop-blur-md p-1 rounded-xl border border-[#C4DE6E]/30"
              role="group"
              aria-label="Tampilan cheesecake"
            >
              {(
                [
                  ["scroll", "Gulir"],
                  ["whole", "Utuh"],
                  ["slice", "Potongan"],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  aria-pressed={view === mode}
                  onClick={() => setView(mode)}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-colors ${
                    view === mode
                      ? "bg-[#C4DE6E] text-[#00332A]"
                      : "text-emerald-100/80 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
