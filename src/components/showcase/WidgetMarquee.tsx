"use client";
import React from "react";
import Image from "next/image";

interface CheesecakeSliceItem {
  id: string;
  title: string;
  tag: string;
  price: string;
  desc: string;
  sticker: string;
  image: string;
}

const ROW_1_ITEMS: CheesecakeSliceItem[] = [
  {
    id: "slice-classic",
    title: "THE BURNT CORNER",
    tag: "SLICE-01 · ORIGINAL",
    price: "Rp 48.000",
    desc: "Molten custard center & crust gosong",
    sticker: "/stickers/sticker-slice-classic.png",
    image: "/products/slice-classic.webp",
  },
  {
    id: "slice-matcha",
    title: "UJI MATCHA BASQUE",
    tag: "SLICE-02 · KYOTO TEA",
    price: "Rp 54.000",
    desc: "Earthy bittersweet & lava hijau lumer",
    sticker: "/stickers/sticker-slice-matcha.png",
    image: "/products/bento-matcha.webp",
  },
  {
    id: "slice-biscoff",
    title: "LOTUS BISCOFF CRUNCH",
    tag: "SLICE-03 · SPECULOOS",
    price: "Rp 54.000",
    desc: "Saus karamel leleh & remah biskuit",
    sticker: "/stickers/sticker-slice-biscoff.png",
    image: "/products/bento-biscoff.webp",
  },
  {
    id: "slice-berry",
    title: "WILD BERRY COMPOTE",
    tag: "SLICE-04 · RUBY RASPBERRY",
    price: "Rp 52.000",
    desc: "Segar asam manis selai buah liar",
    sticker: "/stickers/sticker-slice-berry.png",
    image: "/products/slice-classic.webp",
  },
  {
    id: "slice-pistachio",
    title: "PISTACHIO VELVET",
    tag: "SLICE-05 · SICILIAN NUT",
    price: "Rp 58.000",
    desc: "Kacang pistachio panggang & remah emas",
    sticker: "/stickers/sticker-slice-pistachio.png",
    image: "/products/bento-matcha.webp",
  },
  {
    id: "slice-chocolate",
    title: "DARK CHOCOLATE 70%",
    tag: "SLICE-06 · BELGIAN GANACHE",
    price: "Rp 54.000",
    desc: "Kakao pekat leleh & base brownie legit",
    sticker: "/stickers/sticker-slice-chocolate.png",
    image: "/products/bento-biscoff.webp",
  },
];

const ROW_2_ITEMS: CheesecakeSliceItem[] = [
  {
    id: "slice-caramel",
    title: "SEA SALT CARAMEL LAVA",
    tag: "SLICE-07 · MOLTEN OOZING",
    price: "Rp 52.000",
    desc: "Saus mentega karamel meleleh hangat",
    sticker: "/stickers/sticker-slice-caramel.png",
    image: "/products/slice-classic.webp",
  },
  {
    id: "slice-chiller",
    title: "FIRM CHILLER 2°C",
    tag: "SLICE-08 · COLD SILK CUT",
    price: "Rp 48.000",
    desc: "Tekstur padat dingin garpu potong rapi",
    sticker: "/stickers/sticker-slice-chiller.png",
    image: "/products/bento-classic.webp",
  },
  {
    id: "slice-espresso",
    title: "DARK ESPRESSO ROAST",
    tag: "SLICE-09 · ARABICA EXTRACT",
    price: "Rp 52.000",
    desc: "Kopi sangrai wangi & custard lembut",
    sticker: "/stickers/sticker-slice-chocolate.png",
    image: "/products/slice-classic.webp",
  },
  {
    id: "slice-yuzu",
    title: "HONEY YUZU CITRUS",
    tag: "SLICE-10 · KOCHI HARVEST",
    price: "Rp 55.000",
    desc: "Segar sitrus Jepang & madu manis",
    sticker: "/stickers/sticker-slice-caramel.png",
    image: "/products/bento-matcha.webp",
  },
  {
    id: "slice-vanilla",
    title: "MADAGASCAR VANILLA",
    tag: "SLICE-11 · BOURBON SEEDS",
    price: "Rp 50.000",
    desc: "Biji vanili hitam asli wangi semerbak",
    sticker: "/stickers/sticker-slice-classic.png",
    image: "/products/slice-classic.webp",
  },
  {
    id: "slice-redvelvet",
    title: "RED VELVET COCOA",
    tag: "SLICE-12 · WHITE CHOC CURLS",
    price: "Rp 54.000",
    desc: "Krim merah ruby & serutan cokelat putih",
    sticker: "/stickers/sticker-slice-berry.png",
    image: "/products/bento-biscoff.webp",
  },
];

export function WidgetMarquee() {
  return (
    <section className="py-20 bg-[#F4F1E8] overflow-hidden">
      <div className="w-[min(1240px,calc(100%-48px))] mx-auto text-center mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-[#0E5B44] font-bold mb-3">
          02 / Koleksi Meja Kerja Kami
        </p>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#00332A] tracking-tight">
          Varian Slice di Atas Cutting Mat.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-[#2E4732] max-w-xl mx-auto mt-2">
          Setiap potongan 1/5 loyang punya profil rasa, tekstur lelehan, dan stiker die-cut tersendiri.
        </p>
      </div>

      {/* Track 1: Leftward Infinite Marquee */}
      <div className="relative w-full flex overflow-hidden mb-6 group">
        <div className="flex gap-6 animate-marquee-left whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[...ROW_1_ITEMS, ...ROW_1_ITEMS].map((item, idx) => (
            <MarqueeCard key={`row1-${idx}`} item={item} />
          ))}
        </div>
      </div>

      {/* Track 2: Rightward Infinite Marquee */}
      <div className="relative w-full flex overflow-hidden group">
        <div className="flex gap-6 animate-marquee-right whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[...ROW_2_ITEMS, ...ROW_2_ITEMS].map((item, idx) => (
            <MarqueeCard key={`row2-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MarqueeCard({ item }: { item: CheesecakeSliceItem }) {
  return (
    <a
      href="#menu"
      className="w-56 h-72 shrink-0 rounded-2xl bg-[#0E5B44] border-2 border-[#0B4A37] p-3 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between overflow-hidden group/card cursor-pointer select-none text-left"
    >
      {/* Mini Cutting Mat Grid Background */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none bg-repeat bg-center"
        style={{
          backgroundImage: "url(/stickers/cutting-mat-grid.svg)",
          backgroundSize: "130px",
        }}
      />

      {/* Metric coordinates on top edge */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[8px] text-[#C4DE6E]/70 uppercase tracking-widest px-0.5">
        <span>{item.tag.split("·")[0].trim()}</span>
        <span>A2 MAT SWATCH</span>
      </div>

      {/* Inner Showcase Stage for Sliced Cheesecake Sticker & Photo */}
      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-[#FAF7F0] border border-[#0B4A37]/30 shadow-inner flex items-center justify-center p-2 group-hover/card:bg-white transition-colors mt-1">
        {/* Subtle grid on canvas */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none bg-repeat bg-center"
          style={{
            backgroundImage: "url(/stickers/cutting-mat-grid.svg)",
            backgroundSize: "75px",
          }}
        />

        {/* PROMINENT DIE-CUT SLICED CHEESECAKE STICKER */}
        <div className="relative z-10 w-36 h-32 flex items-center justify-center transform group-hover/card:scale-110 group-hover/card:-rotate-3 transition-transform duration-300">
          <Image
            src={item.sticker}
            alt={item.title}
            width={132}
            height={120}
            className="object-contain drop-shadow-[0_8px_14px_rgba(0,51,42,0.25)] select-none pointer-events-none"
          />
        </div>

        {/* Price Tag Badge */}
        <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-[#0E5B44] text-[#C4DE6E] font-mono text-[9px] font-bold tracking-wider shadow-sm border border-[#0B4A37]">
          {item.price}
        </div>

        {/* Real Baked Slice Photography Thumbnail */}
        <div className="absolute bottom-2 right-2 z-20 w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md bg-white shrink-0 group-hover/card:scale-110 transition-transform">
          <Image
            src={item.image}
            alt={`${item.title} photo`}
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Typewriter Label Footer */}
      <div className="relative z-10 pt-2 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#C4DE6E] font-bold">
            {item.tag}
          </span>
          <span className="font-mono text-[8px] text-emerald-200/60 uppercase">
            1/5 Cut
          </span>
        </div>
        <h4 className="font-display font-black text-sm text-[#FAF7F0] truncate tracking-tight mt-0.5">
          {item.title}
        </h4>
        <p className="font-mono text-[10px] text-emerald-100/75 truncate mt-0.5">
          {item.desc}
        </p>
      </div>
    </a>
  );
}
