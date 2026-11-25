"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Move3d } from "lucide-react";
const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((module) => module.HeroCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="fallback-label" role="status">
        Menyiapkan pratinjau kue
      </div>
    ),
  },
);
import { useCartStore } from "@/store/useCartStore";

export function CheesecakeHero3D() {
  const [view, setView] = useState<"scroll" | "whole" | "slice">("scroll");
  const open = useCartStore((s) => s.setIsCartDrawerOpen);
  const totalCount = useCartStore((s) => s.getTotalCount());

  return (
    <section className="hero hero-parallax" aria-labelledby="hero-title">
      <header className="site-header wrap">
        <Link className="wordmark hover:opacity-90 transition-opacity" href="/" aria-label="nook and cake, beranda">
          nook & cake.
        </Link>
        <nav aria-label="Navigasi utama" className="flex items-center gap-6">
          <a href="#menu" className="text-sm font-medium hover:text-amber-800 transition-colors">
            Menu
          </a>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => open(true)}
            className="relative px-4 py-2 rounded-full border border-stone-300 bg-white/70 backdrop-blur-sm text-sm font-medium hover:border-amber-700 hover:text-amber-800 transition-colors"
          >
            Keranjang
            {totalCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-amber-800 text-white rounded-full font-bold">
                {totalCount}
              </span>
            )}
          </motion.button>
        </nav>
      </header>
      <div className="hero-sticky">
        <div className="hero-grid wrap">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              The Burnt Corner / Basque cheesecake
            </p>
            <h1 id="hero-title">
              Sedikit gosong.
              <br />
              Banyak dirindukan.
            </h1>
            <p className="hero-description">
              Mahkota karamel panggang, bagian tengah yang lembut. Cheesecake
              dari dapur kecil nook & cake., dibuat sesuai pesanan.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button asChild className="shadow-md hover:shadow-lg transition-shadow">
                  <a href="#menu">
                    Pilih pesanan sekarang <span aria-hidden="true">↗</span>
                  </a>
                </Button>
              </motion.div>
            </div>
            <p className="hero-meta">
              Bento mulai Rp 52.000 · Kemasan bagasse termasuk
            </p>
          </motion.div>
          <figure className="cake-stage">
            <HeroCanvas view={view} />
            <figcaption>
              <span className="inline-flex items-center gap-1.5 text-stone-600">
                <Move3d className="w-3.5 h-3.5 text-amber-700" /> Geser untuk memutar
              </span>
              <div
                className="view-controls"
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
                  <motion.button
                    key={mode}
                    whileTap={{ scale: 0.92 }}
                    aria-pressed={view === mode}
                    onClick={() => setView(mode)}
                    className="transition-colors"
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </figcaption>
          </figure>
        </div>
        <div className="hero-foot wrap">
          <span>your sweetest little escape.</span>
          <span>Dibuat per pesanan, dinikmati pelan.</span>
        </div>
      </div>
    </section>
  );
}
