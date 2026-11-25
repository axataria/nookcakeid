import Link from "next/link";
import { CuttingMatHero } from "@/components/hero/CuttingMatHero";
import { MatFeatures } from "@/components/showcase/MatFeatures";
import { WidgetMarquee } from "@/components/showcase/WidgetMarquee";
import { CakeCatalog } from "@/components/catalog/CakeCatalog";
import { BakerManifesto } from "@/components/showcase/BakerManifesto";
import { CartBottomBar } from "@/components/checkout/CartBottomBar";
import { CartDrawer } from "@/components/checkout/CartDrawer";

export default function HomePage() {
  return (
    <>
      <a className="skip-link font-mono" href="#main">
        Lewati ke konten
      </a>
      <main id="main" className="min-h-screen bg-[#F4F1E8] text-[#00332A]">
        {/* 1. HERO WITH CUTTING MAT & DRAGGABLE STICKERS */}
        <CuttingMatHero />

        {/* 2. THREE-COLUMN FEATURES WITH STICKER TOPPERS */}
        <MatFeatures />

        {/* 3. DUAL-ROW CONTINUOUS MARQUEE GALLERY */}
        <WidgetMarquee />

        {/* 4. BAKERY DESK CATALOG */}
        <CakeCatalog />

        {/* 5. BAKER'S MANIFESTO & SIGNATURE */}
        <BakerManifesto />

        {/* 6. FAQ & FOOTER */}
        <footer className="bg-[#EAE5D8] py-16 border-t border-[#00332A]/10">
          <div className="w-[min(1240px,calc(100%-48px))] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <Link
                  href="/"
                  className="font-display font-extrabold text-3xl tracking-tight text-[#00332A]"
                >
                  nook & cake.
                </Link>
                <p className="font-mono text-xs sm:text-sm text-[#2E4732] mt-4 leading-relaxed max-w-sm">
                  Basque cheesecake & brownies.
                  <br />
                  your sweetest little escape.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <a
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#0E5B44] hover:underline"
                    href="https://www.instagram.com/nookandcake.id/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @nookandcake.id ↗
                  </a>
                  <a
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#0E5B44] hover:underline"
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp Baker ↗
                  </a>
                </div>
              </div>

              <div className="faq space-y-4">
                <h3 className="font-display font-extrabold text-xl text-[#00332A] mb-4">
                  Sebelum memesan
                </h3>
                {[
                  [
                    "Bagaimana cara memesan?",
                    "Pilih varian bento atau loyang besar, tambahkan saus cocolan, lalu klik tombol 'Pesan via WhatsApp'. Ringkasan pesanan akan langsung terbuka otomatis di chat baker.",
                  ],
                  [
                    "Bisa dikirim atau diambil sendiri?",
                    "Bisa keduanya! Tanyakan estimasi ongkos kirim instant/sameday atau konfirmasi lokasi pick-up langsung kepada baker melalui WhatsApp.",
                  ],
                  [
                    "Apakah kemasan sudah termasuk?",
                    "Ya, seluruh produk sudah termasuk kemasan bagasse ramah lingkungan, sendok kayu, care card, dan segel pita.",
                  ],
                  [
                    "Bagaimana cara penyimpanan?",
                    "Simpan di chiller/kulkas suhu 2–6°C. Tahan hingga 4–5 hari dalam wadah tertutup. Keluarkan sebentar sebelum disantap jika ingin tekstur molten yang lumer.",
                  ],
                ].map(([q, a]) => (
                  <details
                    key={q}
                    className="group border-b border-[#00332A]/15 pb-4 cursor-pointer"
                  >
                    <summary className="font-display font-bold text-sm text-[#00332A] flex items-center justify-between">
                      <span>{q}</span>
                      <span className="font-mono text-xs text-[#0E5B44] group-open:rotate-45 transition-transform">
                        +
                      </span>
                    </summary>
                    <p className="font-mono text-xs text-[#2E4732] mt-2 leading-relaxed">
                      {a}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-[#00332A]/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#687E6C]">
              <span>© {new Date().getFullYear()} nook & cake. Crafted with care.</span>
              <div className="flex gap-6">
                <a href="/privacy" className="hover:text-[#00332A]">
                  Privasi
                </a>
                <a href="/terms" className="hover:text-[#00332A]">
                  Ketentuan
                </a>
                <a href="#menu" className="hover:text-[#00332A]">
                  Pilih menu ↗
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* 7. FLOATING BOTTOM CART BAR & SLIDE-OUT DRAWER */}
        <CartBottomBar />
        <CartDrawer />
      </main>
    </>
  );
}
