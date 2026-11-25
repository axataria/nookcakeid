"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Printer, ArrowLeft, Scissors, Sparkles, Leaf } from "lucide-react";

type SheetMode = "combo" | "care" | "thanks" | "gift" | "seal";
type InkMode = "full" | "eco";

export default function PrintStudioPage() {
  const [sheetMode, setSheetMode] = useState<SheetMode>("combo");
  const [inkMode, setInkMode] = useState<InkMode>("full");
  const [showCropMarks, setShowCropMarks] = useState(true);
  const [giftTo, setGiftTo] = useState("");
  const [giftFrom, setGiftFrom] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  const isEco = inkMode === "eco";

  return (
    <div className="min-h-screen bg-[#EAE5D8] text-[#00332A] print:bg-white print:min-h-0">
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          html,
          body {
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* SCREEN-ONLY CONTROL BAR */}
      <header className="print:hidden sticky top-0 z-30 bg-[#F4F1E8]/95 backdrop-blur border-b border-[#00332A]/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#0E5B44] hover:underline px-2.5 py-1.5 rounded-lg bg-white border border-[#D9D3C5]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Storefront
              </Link>
              <div>
                <h1 className="font-display font-extrabold text-lg sm:text-xl text-[#00332A] leading-tight">
                  Print Studio — Package Inserts
                </h1>
                <p className="font-mono text-[11px] text-[#687E6C]">
                  Layout siap cetak A4 untuk kemasan Bento 10 cm &amp; Whole 18 cm
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInkMode(isEco ? "full" : "eco")}
                className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-2 rounded-xl border transition-colors ${
                  isEco
                    ? "bg-[#C4DE6E]/40 border-[#0E5B44] text-[#00332A]"
                    : "bg-white border-[#D9D3C5] text-[#2E4732] hover:border-[#0E5B44]"
                }`}
                title="Mode hemat tinta untuk kertas Kraft/karton krem"
              >
                <Leaf className="w-3.5 h-3.5 text-[#0E5B44]" />
                {isEco ? "Mode Kraft / Hemat Tinta" : "Mode Full Color"}
              </button>

              <button
                type="button"
                onClick={() => setShowCropMarks((v) => !v)}
                className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-2 rounded-xl border transition-colors ${
                  showCropMarks
                    ? "bg-white border-[#0E5B44] text-[#0E5B44]"
                    : "bg-white border-[#D9D3C5] text-[#687E6C]"
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                Garis Potong
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 font-mono text-xs font-bold bg-[#0E5B44] hover:bg-[#0B4A37] text-[#F4F1E8] px-4 py-2 rounded-xl shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4 text-[#C4DE6E]" />
                Cetak / Save PDF
              </button>
            </div>
          </div>

          {/* SHEET TABS & LIVE FIELDS */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#00332A]/10">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["combo", "Combo A4 (Hemat)"],
                  ["care", "Care Card (6×)"],
                  ["thanks", "Thank You (6×)"],
                  ["gift", "Gift Note (8×)"],
                  ["seal", "Segel Box (10×)"],
                ] as [SheetMode, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSheetMode(key)}
                  className={`font-mono text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    sheetMode === key
                      ? "bg-[#00332A] text-[#C4DE6E]"
                      : "bg-white/80 text-[#2E4732] hover:bg-white border border-[#D9D3C5]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {(sheetMode === "combo" || sheetMode === "gift") && (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={giftTo}
                  onChange={(e) => setGiftTo(e.target.value)}
                  placeholder="Untuk: (opsional)"
                  className="font-mono text-[11px] bg-white px-2.5 py-1 rounded-lg border border-[#D9D3C5] w-32 outline-none focus:border-[#0E5B44]"
                />
                <input
                  type="text"
                  value={giftFrom}
                  onChange={(e) => setGiftFrom(e.target.value)}
                  placeholder="Dari: (opsional)"
                  className="font-mono text-[11px] bg-white px-2.5 py-1 rounded-lg border border-[#D9D3C5] w-28 outline-none focus:border-[#0E5B44]"
                />
                <input
                  type="text"
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Pesan singkat gift..."
                  className="font-mono text-[11px] bg-white px-2.5 py-1 rounded-lg border border-[#D9D3C5] w-44 outline-none focus:border-[#0E5B44]"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* A4 PRINT SHEET PREVIEW */}
      <main className="py-8 px-4 print:p-0 flex flex-col items-center">
        <div
          data-sheet="a4"
          className="w-[210mm] min-h-[297mm] bg-white shadow-xl print:shadow-none p-[8mm] print:p-0 mx-auto"
        >
          {sheetMode === "combo" && (
            <div className="space-y-4">
              {/* Row 1: 2x Care Card (9x9 cm) */}
              <div className="grid grid-cols-2 gap-3 justify-items-center">
                <CareCard isEco={isEco} crop={showCropMarks} />
                <CareCard isEco={isEco} crop={showCropMarks} />
              </div>

              {/* Row 2: 2x Thank You Card (9x9 cm) */}
              <div className="grid grid-cols-2 gap-3 justify-items-center">
                <ThankYouCard isEco={isEco} crop={showCropMarks} />
                <ThankYouCard isEco={isEco} crop={showCropMarks} />
              </div>

              {/* Row 3: 4x Gift Note Card (9x4.8 cm) */}
              <div className="grid grid-cols-2 gap-3 justify-items-center">
                <GiftNoteCard
                  to={giftTo}
                  from={giftFrom}
                  message={giftMessage}
                  isEco={isEco}
                  crop={showCropMarks}
                />
                <GiftNoteCard
                  to={giftTo}
                  from={giftFrom}
                  message={giftMessage}
                  isEco={isEco}
                  crop={showCropMarks}
                />
              </div>

              {/* Row 4: 4x Box Seal Stickers */}
              <div className="grid grid-cols-2 gap-3 justify-items-center">
                <BoxSealSticker isEco={isEco} crop={showCropMarks} />
                <BoxSealSticker isEco={isEco} crop={showCropMarks} />
                <BoxSealSticker isEco={isEco} crop={showCropMarks} />
                <BoxSealSticker isEco={isEco} crop={showCropMarks} />
              </div>
            </div>
          )}

          {sheetMode === "care" && (
            <div className="grid grid-cols-2 gap-4 justify-items-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <CareCard key={i} isEco={isEco} crop={showCropMarks} />
              ))}
            </div>
          )}

          {sheetMode === "thanks" && (
            <div className="grid grid-cols-2 gap-4 justify-items-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <ThankYouCard key={i} isEco={isEco} crop={showCropMarks} />
              ))}
            </div>
          )}

          {sheetMode === "gift" && (
            <div className="grid grid-cols-2 gap-4 justify-items-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <GiftNoteCard
                  key={i}
                  to={giftTo}
                  from={giftFrom}
                  message={giftMessage}
                  isEco={isEco}
                  crop={showCropMarks}
                />
              ))}
            </div>
          )}

          {sheetMode === "seal" && (
            <div className="grid grid-cols-2 gap-3 justify-items-center">
              {Array.from({ length: 10 }).map((_, i) => (
                <BoxSealSticker
                  key={i}
                  isEco={isEco}
                  crop={showCropMarks}
                />
              ))}
            </div>
          )}
        </div>

        {/* SCREEN-ONLY HELPER NOTE */}
        <p className="print:hidden font-mono text-xs text-[#2E4732] mt-4 text-center max-w-xl">
          Tip cetak: Saat dialog Print terbuka, aktifkan{" "}
          <strong className="text-[#00332A]">Background graphics</strong> dan set{" "}
          <strong className="text-[#00332A]">Scale: 100%</strong>. Gunakan kertas Art Carton
          260–310 gsm (kartu) atau Sticker Chromo/Vinyl (segel box).
        </p>
      </main>
    </div>
  );
}

/* ============================================================================
   1. CARE CARD (90mm x 90mm — Pas di dalam Box Bento 10 cm)
   ============================================================================ */
function CareCard({
  isEco,
  crop,
}: {
  isEco: boolean;
  crop: boolean;
}) {
  return (
    <article
      data-asset="care-card"
      className={`w-[90mm] h-[90mm] p-4 flex flex-col justify-between relative overflow-hidden ${
        crop ? "border border-dashed border-[#687E6C]/60" : ""
      } ${isEco ? "bg-white text-[#00332A]" : "bg-[#F4F1E8] text-[#00332A]"}`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 border-b border-[#00332A]/15 pb-2">
        <div>
          <span
            className={`inline-block font-mono text-[8px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded ${
              isEco
                ? "border border-[#00332A] text-[#00332A]"
                : "bg-[#0E5B44] text-[#C4DE6E]"
            }`}
          >
            CARE CARD · BENTO &amp; WHOLE
          </span>
          <h2 className="font-display font-black text-base leading-tight mt-1 text-[#00332A]">
            Satu Kue, Dua Tekstur.
          </h2>
        </div>
        <Image
          src="/stickers/sticker-slice-classic.png"
          alt="Basque slice"
          width={38}
          height={32}
          className="object-contain shrink-0"
        />
      </div>

      {/* 2 Texture Modes */}
      <div className="space-y-2 my-auto py-1">
        <div
          className={`p-2 rounded-lg border ${
            isEco
              ? "border-[#00332A]/25 bg-white"
              : "border-[#D9D3C5] bg-white/90"
          }`}
        >
          <p className="font-display font-extrabold text-[11px] text-[#0E5B44]">
            1. Langsung dari Kulkas (2–6°C)
          </p>
          <p className="font-mono text-[9.5px] text-[#2E4732] leading-snug mt-0.5">
            Untuk tekstur <strong>padat, dingin &amp; creamy</strong>. Cocok dipotong rapi dengan garpu.
          </p>
        </div>

        <div
          className={`p-2 rounded-lg border ${
            isEco
              ? "border-[#00332A]/25 bg-white"
              : "border-[#D9D3C5] bg-white/90"
          }`}
        >
          <p className="font-display font-extrabold text-[11px] text-[#0E5B44]">
            2. Diamkan 15 Menit di Suhu Ruang
          </p>
          <p className="font-mono text-[9.5px] text-[#2E4732] leading-snug mt-0.5">
            Untuk bagian tengah yang lebih <strong>lumer &amp; molten</strong> di setiap suapan.
          </p>
        </div>
      </div>

      {/* Storage & Footer */}
      <div className="border-t border-[#00332A]/15 pt-2 flex items-end justify-between gap-2">
        <div className="font-mono text-[8.5px] text-[#2E4732] leading-tight">
          <p className="font-bold text-[#00332A]">
            Tanpa pengawet · Tahan 4–5 hari di chiller
          </p>
          <p className="text-[#687E6C] mt-1 flex items-end gap-1">
            <span>Dipanggang:</span>
            <span className="inline-block w-24 border-b border-dotted border-[#687E6C]/80" />
          </p>
        </div>
        <span className="font-holiday text-xl leading-none text-[#0E5B44] shrink-0">
          nook cake
        </span>
      </div>
    </article>
  );
}

/* ============================================================================
   2. THANK YOU & SOCIAL CARD (90mm x 90mm)
   ============================================================================ */
function ThankYouCard({ isEco, crop }: { isEco: boolean; crop: boolean }) {
  return (
    <article
      data-asset="thank-you-card"
      className={`w-[90mm] h-[90mm] p-4 flex flex-col justify-between relative overflow-hidden ${
        crop ? "border border-dashed border-[#687E6C]/60" : ""
      } ${isEco ? "bg-white text-[#00332A]" : "bg-[#0E5B44] text-[#F4F1E8]"}`}
    >
      {/* Subtle Cutting Mat Grid on Full Color */}
      {!isEco && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(to right, #C4DE6E 1px, transparent 1px), linear-gradient(to bottom, #C4DE6E 1px, transparent 1px)",
            backgroundSize: "10mm 10mm",
          }}
        />
      )}

      <div className="relative z-10 flex items-center justify-between">
        <span
          className={`font-mono text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
            isEco
              ? "border border-[#00332A] text-[#00332A]"
              : "bg-[#C4DE6E] text-[#00332A]"
          }`}
        >
          HANDCRAFTED IN SMALL BATCHES
        </span>
        <Sparkles className={`w-3.5 h-3.5 ${isEco ? "text-[#0E5B44]" : "text-[#C4DE6E]"}`} />
      </div>

      <div className="relative z-10 text-center my-auto px-2">
        <p
          className={`font-holiday text-4xl leading-none ${
            isEco ? "text-[#0E5B44]" : "text-[#C4DE6E]"
          }`}
        >
          nook cake
        </p>
        <p
          className={`font-mono text-[9.5px] italic mt-1 ${
            isEco ? "text-[#687E6C]" : "text-[#F4F1E8]/80"
          }`}
        >
          your sweetest little escape.
        </p>

        <p
          className={`font-display font-bold text-xs leading-relaxed mt-3 ${
            isEco ? "text-[#00332A]" : "text-[#F4F1E8]"
          }`}
        >
          Terima kasih sudah memesan dari dapur kecil kami. Semoga potongan kue ini
          membuat harimu sedikit lebih manis.
        </p>
      </div>

      <div
        className={`relative z-10 border-t pt-2 flex items-center justify-between font-mono text-[8.5px] ${
          isEco
            ? "border-[#00332A]/20 text-[#2E4732]"
            : "border-[#C4DE6E]/30 text-[#F4F1E8]/90"
        }`}
      >
        <div>
          <p className="font-bold">IG: @nookcakeid</p>
          <p>WA: 0851-5662-2944</p>
        </div>
        <div className="text-right">
          <p className={isEco ? "text-[#0E5B44] font-bold" : "text-[#C4DE6E] font-bold"}>
            Tag cerita manismu ↗
          </p>
          <p className="opacity-80">Fresh baked daily</p>
        </div>
      </div>
    </article>
  );
}

/* ============================================================================
   3. GIFT / CUSTOM NOTE CARD (90mm x 48mm)
   ============================================================================ */
function GiftNoteCard({
  to,
  from,
  message,
  isEco,
  crop,
}: {
  to: string;
  from: string;
  message: string;
  isEco: boolean;
  crop: boolean;
}) {
  return (
    <article
      data-asset="gift-note-card"
      className={`w-[90mm] h-[48mm] p-3.5 flex flex-col justify-between relative ${
        crop ? "border border-dashed border-[#687E6C]/60" : ""
      } ${isEco ? "bg-white text-[#00332A]" : "bg-[#FAF7F0] text-[#00332A]"}`}
    >
      <div className="flex items-center justify-between border-b border-[#00332A]/15 pb-1.5">
        <span className="font-mono text-[8px] uppercase tracking-widest font-bold text-[#0E5B44]">
          A SWEET LITTLE NOTE
        </span>
        <span className="font-holiday text-base leading-none text-[#0E5B44]">
          nook cake
        </span>
      </div>

      <div className="space-y-1.5 my-auto py-1 font-mono text-[9.5px]">
        <div className="flex items-baseline gap-1.5 border-b border-dotted border-[#687E6C]/60 pb-0.5">
          <span className="text-[#687E6C] font-bold shrink-0">Untuk:</span>
          <span className="text-[#00332A] font-bold truncate">{to}</span>
        </div>

        <div className="min-h-[12mm] border-b border-dotted border-[#687E6C]/60 flex items-start pt-0.5">
          <p className="text-[10px] leading-snug text-[#2E4732] line-clamp-2">
            {message || "\u00A0"}
          </p>
        </div>

        <div className="flex items-baseline justify-between gap-2 pt-0.5">
          <div className="flex items-baseline gap-1.5 flex-1 border-b border-dotted border-[#687E6C]/60 pb-0.5">
            <span className="text-[#687E6C] font-bold shrink-0">Dari:</span>
            <span className="text-[#00332A] font-bold truncate">{from}</span>
          </div>
          <span className="text-[8px] text-[#687E6C] shrink-0">@nookcakeid</span>
        </div>
      </div>
    </article>
  );
}

/* ============================================================================
   4. BOX SEAL / BELLY BAND STICKER (90mm x 32mm)
   ============================================================================ */
function BoxSealSticker({
  isEco,
  crop,
}: {
  isEco: boolean;
  crop: boolean;
}) {
  return (
    <article
      data-asset="box-seal-sticker"
      className={`w-[90mm] h-[32mm] px-3.5 py-2.5 flex items-center justify-between gap-3 ${
        crop ? "border border-dashed border-[#687E6C]/60" : ""
      } ${isEco ? "bg-white text-[#00332A]" : "bg-[#00332A] text-[#F4F1E8]"}`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`font-holiday text-xl leading-none ${
              isEco ? "text-[#0E5B44]" : "text-[#C4DE6E]"
            }`}
          >
            nook cake
          </span>
          <span
            className={`font-mono text-[7.5px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold ${
              isEco
                ? "border border-[#00332A] text-[#00332A]"
                : "bg-[#0E5B44] text-[#C4DE6E]"
            }`}
          >
            FRESHLY BAKED
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 font-mono text-[8px] mt-1.5 opacity-90">
          <span>[ ] Original</span>
          <span>[ ] Matcha</span>
          <span>[ ] Choco</span>
          <span>[ ] Whole 18cm</span>
        </div>
      </div>

      <div
        className={`text-right shrink-0 border-l pl-2.5 font-mono text-[8px] leading-tight ${
          isEco ? "border-[#00332A]/20" : "border-[#C4DE6E]/25"
        }`}
      >
        <p className="uppercase tracking-wider opacity-75">Batch</p>
        <div
          className={`w-16 h-3.5 mt-0.5 ml-auto border-b border-dotted ${
            isEco ? "border-[#00332A]/60" : "border-[#F4F1E8]/60"
          }`}
        />
        <p className={`mt-1.5 ${isEco ? "text-[#0E5B44]" : "text-[#C4DE6E]"}`}>
          2–6°C Chiller
        </p>
      </div>
    </article>
  );
}
