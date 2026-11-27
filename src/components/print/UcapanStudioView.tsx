"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, Palette, RotateCcw, Sparkles } from "lucide-react";
import { InkTheme, STICKER_OPTIONS } from "./templateTypes";

type CardSize = "bento" | "square" | "a6";
type NoteFont = "mono" | "handwriting";

interface GreetingCardEntry {
  header: string;
  to: string;
  from: string;
  message: string;
}

const OCCASION_PRESETS: {
  id: string;
  label: string;
  header: string;
  message: string;
}[] = [
  {
    id: "blank",
    label: "Kosong (Tulis Tangan)",
    header: "A SWEET LITTLE NOTE",
    message: "",
  },
  {
    id: "birthday",
    label: "Ulang Tahun",
    header: "HAPPY BIRTHDAY",
    message:
      "Selamat ulang tahun! Semoga tahun barumu penuh kebahagiaan, kesehatan, dan momen manis.",
  },
  {
    id: "thanks",
    label: "Terima Kasih",
    header: "THANK YOU SO MUCH",
    message:
      "Terima kasih banyak atas kebaikan dan bantuannya. Semoga harimu selalu menyenangkan!",
  },
  {
    id: "congrats",
    label: "Selamat / Wisuda",
    header: "CONGRATULATIONS",
    message:
      "Selamat atas pencapaiannya! Bangga sekali dan semoga sukses terus untuk langkah berikutnya.",
  },
  {
    id: "getwell",
    label: "Lekas Sembuh",
    header: "GET WELL SOON",
    message:
      "Semoga lekas pulih dan kembali beraktivitas. Istirahat yang cukup dan tetap semangat ya!",
  },
];

const DEFAULT_ENTRY: GreetingCardEntry = {
  header: "A SWEET LITTLE NOTE",
  to: "",
  from: "",
  message: "",
};

const SIZE_META: Record<
  CardSize,
  { label: string; dimensions: string; count: number }
> = {
  bento: { label: "Bento Tag", dimensions: "90 × 48 mm", count: 8 },
  square: { label: "Square Bento", dimensions: "90 × 90 mm", count: 6 },
  a6: { label: "A6 Hampers", dimensions: "95 × 135 mm", count: 4 },
};

export function UcapanStudioView({ showCropMarks }: { showCropMarks: boolean }) {
  const [cardSize, setCardSize] = useState<CardSize>("bento");
  const [theme, setTheme] = useState<InkTheme>("cream");
  const [noteFont, setNoteFont] = useState<NoteFont>("mono");
  const [stickerUrl, setStickerUrl] = useState<string>(
    "/stickers/sticker-slice-classic.png"
  );
  const [footerHandle, setFooterHandle] = useState("@nookcakeid");
  const [batchPerSlot, setBatchPerSlot] = useState(false);

  const [singleEntry, setSingleEntry] = useState<GreetingCardEntry>(DEFAULT_ENTRY);
  const [slotEntries, setSlotEntries] = useState<GreetingCardEntry[]>(() =>
    Array.from({ length: 8 }, () => ({ ...DEFAULT_ENTRY }))
  );
  const [activeSlot, setActiveSlot] = useState(0);

  const slotCount = SIZE_META[cardSize].count;
  const activeEntry = batchPerSlot
    ? slotEntries[activeSlot] ?? DEFAULT_ENTRY
    : singleEntry;

  function updateActiveEntry(patch: Partial<GreetingCardEntry>) {
    if (batchPerSlot) {
      setSlotEntries((prev) =>
        prev.map((item, idx) => (idx === activeSlot ? { ...item, ...patch } : item))
      );
    } else {
      setSingleEntry((prev) => ({ ...prev, ...patch }));
    }
  }

  function resetAll() {
    setSingleEntry(DEFAULT_ENTRY);
    setSlotEntries(Array.from({ length: 8 }, () => ({ ...DEFAULT_ENTRY })));
  }

  const cardsToRender = batchPerSlot
    ? slotEntries.slice(0, slotCount)
    : Array.from({ length: slotCount }, () => singleEntry);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 print:p-0 grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 items-start">
      {/* LEFT CONTROLS */}
      <aside className="print:hidden bg-[#F4F1E8] border border-[#D9D3C5] rounded-2xl p-4 space-y-5 xl:sticky xl:top-20 max-h-[calc(100vh-104px)] overflow-y-auto">
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#0E5B44]">
              1. Ukuran Kartu
            </label>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#687E6C] hover:text-[#00332A]"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(SIZE_META) as CardSize[]).map((sizeKey) => {
              const meta = SIZE_META[sizeKey];
              return (
                <button
                  key={sizeKey}
                  type="button"
                  onClick={() => {
                    setCardSize(sizeKey);
                    if (activeSlot >= meta.count) setActiveSlot(0);
                  }}
                  className={`p-2 rounded-xl text-left transition-colors border ${
                    cardSize === sizeKey
                      ? "bg-[#00332A] text-[#C4DE6E] border-[#00332A]"
                      : "bg-white text-[#2E4732] border-[#D9D3C5] hover:border-[#0E5B44]"
                  }`}
                >
                  <p className="font-display font-bold text-xs leading-tight">
                    {meta.label}
                  </p>
                  <p className="font-mono text-[9.5px] opacity-80 mt-0.5">
                    {meta.dimensions}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-2">
          <label className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider font-bold text-[#0E5B44]">
            <Palette className="w-3.5 h-3.5" />
            2. Warna &amp; Gaya Tulisan
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                ["cream", "Cream"],
                ["forest", "Forest Green"],
                ["eco", "Kraft / Eco"],
              ] as [InkTheme, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key)}
                className={`font-mono text-[11px] font-bold px-2 py-1.5 rounded-lg border transition-colors ${
                  theme === key
                    ? "bg-[#C4DE6E]/45 border-[#0E5B44] text-[#00332A]"
                    : "bg-white border-[#D9D3C5] text-[#2E4732]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setNoteFont("mono")}
              className={`font-mono text-[11px] font-bold px-2.5 py-1.5 rounded-lg border ${
                noteFont === "mono"
                  ? "bg-[#00332A] text-[#C4DE6E] border-[#00332A]"
                  : "bg-white text-[#2E4732] border-[#D9D3C5]"
              }`}
            >
              Rapi (Space Mono)
            </button>
            <button
              type="button"
              onClick={() => setNoteFont("handwriting")}
              className={`font-mono text-[11px] font-bold px-2.5 py-1.5 rounded-lg border ${
                noteFont === "handwriting"
                  ? "bg-[#00332A] text-[#C4DE6E] border-[#00332A]"
                  : "bg-white text-[#2E4732] border-[#D9D3C5]"
              }`}
            >
              Tulisan Tangan
            </button>
          </div>

          <div>
            <span className="block font-mono text-[10px] font-bold text-[#2E4732] mb-1">
              Stiker Hiasan (Square / A6)
            </span>
            <select
              value={stickerUrl}
              onChange={(e) => setStickerUrl(e.target.value)}
              className="w-full font-mono text-[11px] bg-white px-2.5 py-1.5 rounded-lg border border-[#D9D3C5] outline-none focus:border-[#0E5B44]"
            >
              {STICKER_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.url}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="space-y-2 pt-2 border-t border-[#00332A]/10">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#0E5B44]">
              3. Mode Cetak A4
            </label>
            {!batchPerSlot && (
              <button
                type="button"
                onClick={() => {
                  setSlotEntries(Array.from({ length: 8 }, () => ({ ...singleEntry })));
                  setBatchPerSlot(true);
                }}
                className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#0E5B44] hover:underline"
              >
                <Copy className="w-3 h-3" />
                Beda-beda per order
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setBatchPerSlot(false)}
              className={`font-mono text-[11px] font-bold px-2.5 py-1.5 rounded-lg border ${
                !batchPerSlot
                  ? "bg-[#00332A] text-[#C4DE6E] border-[#00332A]"
                  : "bg-white text-[#2E4732] border-[#D9D3C5]"
              }`}
            >
              Semua Sama ({slotCount}×)
            </button>
            <button
              type="button"
              onClick={() => setBatchPerSlot(true)}
              className={`font-mono text-[11px] font-bold px-2.5 py-1.5 rounded-lg border ${
                batchPerSlot
                  ? "bg-[#00332A] text-[#C4DE6E] border-[#00332A]"
                  : "bg-white text-[#2E4732] border-[#D9D3C5]"
              }`}
            >
              Isi Per Slot ({slotCount} Order)
            </button>
          </div>

          {batchPerSlot && (
            <div className="flex flex-wrap gap-1 pt-1">
              {Array.from({ length: slotCount }).map((_, idx) => {
                const hasText = Boolean(
                  slotEntries[idx]?.to || slotEntries[idx]?.message
                );
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlot(idx)}
                    className={`font-mono text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                      activeSlot === idx
                        ? "bg-[#0E5B44] text-[#C4DE6E] border-[#0E5B44]"
                        : hasText
                        ? "bg-[#C4DE6E]/40 text-[#00332A] border-[#0E5B44]/40"
                        : "bg-white text-[#687E6C] border-[#D9D3C5]"
                    }`}
                  >
                    #{idx + 1}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-2.5 pt-2 border-t border-[#00332A]/10">
          <label className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider font-bold text-[#0E5B44]">
            <Sparkles className="w-3.5 h-3.5" />
            4. Isi Kartu {batchPerSlot ? `(Slot #${activeSlot + 1})` : ""}
          </label>

          <div className="flex flex-wrap gap-1">
            {OCCASION_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() =>
                  updateActiveEntry({ header: p.header, message: p.message })
                }
                className="font-mono text-[10px] font-bold bg-white border border-[#D9D3C5] hover:border-[#0E5B44] text-[#2E4732] px-2 py-1 rounded-md"
              >
                {p.label}
              </button>
            ))}
          </div>

          <label className="block">
            <span className="block font-mono text-[10px] font-bold text-[#2E4732] mb-0.5">
              Header Ucapan
            </span>
            <input
              type="text"
              value={activeEntry.header}
              onChange={(e) => updateActiveEntry({ header: e.target.value })}
              className="w-full font-mono text-[11px] bg-white px-2.5 py-1.5 rounded-lg border border-[#D9D3C5] outline-none focus:border-[#0E5B44]"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="block font-mono text-[10px] font-bold text-[#2E4732] mb-0.5">
                Untuk
              </span>
              <input
                type="text"
                value={activeEntry.to}
                placeholder="Kosong = tulis tangan"
                onChange={(e) => updateActiveEntry({ to: e.target.value })}
                className="w-full font-mono text-[11px] bg-white px-2.5 py-1.5 rounded-lg border border-[#D9D3C5] outline-none focus:border-[#0E5B44]"
              />
            </label>

            <label className="block">
              <span className="block font-mono text-[10px] font-bold text-[#2E4732] mb-0.5">
                Dari
              </span>
              <input
                type="text"
                value={activeEntry.from}
                placeholder="Kosong = tulis tangan"
                onChange={(e) => updateActiveEntry({ from: e.target.value })}
                className="w-full font-mono text-[11px] bg-white px-2.5 py-1.5 rounded-lg border border-[#D9D3C5] outline-none focus:border-[#0E5B44]"
              />
            </label>
          </div>

          <label className="block">
            <span className="block font-mono text-[10px] font-bold text-[#2E4732] mb-0.5">
              Pesan Ucapan
            </span>
            <textarea
              rows={3}
              value={activeEntry.message}
              placeholder="Kosongkan jika ingin ditulis manual dengan pulpen..."
              onChange={(e) => updateActiveEntry({ message: e.target.value })}
              className="w-full font-mono text-[11px] bg-white px-2.5 py-1.5 rounded-lg border border-[#D9D3C5] outline-none focus:border-[#0E5B44] resize-y"
            />
          </label>

          <label className="block">
            <span className="block font-mono text-[10px] font-bold text-[#2E4732] mb-0.5">
              Footer Handle
            </span>
            <input
              type="text"
              value={footerHandle}
              onChange={(e) => setFooterHandle(e.target.value)}
              className="w-full font-mono text-[11px] bg-white px-2.5 py-1.5 rounded-lg border border-[#D9D3C5] outline-none focus:border-[#0E5B44]"
            />
          </label>
        </section>
      </aside>

      {/* RIGHT: A4 PRINT SHEET */}
      <main className="flex flex-col items-center overflow-x-auto pb-8 print:p-0 print:overflow-visible">
        <div
          data-sheet="a4-ucapan"
          className="w-[210mm] min-h-[297mm] bg-white shadow-xl print:shadow-none p-[8mm] print:p-0 mx-auto shrink-0"
        >
          <div className="grid grid-cols-2 gap-4 justify-items-center">
            {cardsToRender.map((entry, idx) => (
              <UcapanCard
                key={idx}
                entry={entry}
                size={cardSize}
                theme={theme}
                noteFont={noteFont}
                stickerUrl={stickerUrl}
                footerHandle={footerHandle}
                crop={showCropMarks}
              />
            ))}
          </div>
        </div>

        <p className="print:hidden font-mono text-xs text-[#2E4732] mt-4 text-center max-w-xl">
          Tip: Untuk kartu ucapan yang mudah ditulis dengan pulpen, gunakan kertas{" "}
          <strong className="text-[#00332A]">Linen / Jasmine / Kraft 250 gsm</strong>{" "}
          (tanpa laminasi glossy).
        </p>
      </main>
    </div>
  );
}

function UcapanCard({
  entry,
  size,
  theme,
  noteFont,
  stickerUrl,
  footerHandle,
  crop,
}: {
  entry: GreetingCardEntry;
  size: CardSize;
  theme: InkTheme;
  noteFont: NoteFont;
  stickerUrl: string;
  footerHandle: string;
  crop: boolean;
}) {
  const isEco = theme === "eco";
  const isDark = theme === "forest";

  const sizeClass =
    size === "bento"
      ? "w-[90mm] h-[48mm] p-3.5"
      : size === "square"
      ? "w-[90mm] h-[90mm] p-4"
      : "w-[95mm] h-[135mm] p-5";

  const bgClass = isEco
    ? "bg-white text-[#00332A]"
    : isDark
    ? "bg-[#00332A] text-[#F4F1E8]"
    : "bg-[#FAF7F0] text-[#00332A]";

  const lineBorder = isDark ? "border-[#C4DE6E]/40" : "border-[#687E6C]/60";
  const labelColor = isDark ? "text-[#C4DE6E]" : "text-[#687E6C]";

  const messageStyle =
    noteFont === "handwriting"
      ? { fontFamily: "'Caveat', cursive", fontSize: size === "bento" ? "15px" : "18px" }
      : undefined;

  return (
    <article
      className={`${sizeClass} ${bgClass} ${
        crop ? "border border-dashed border-[#687E6C]/60" : ""
      } flex flex-col justify-between relative overflow-hidden`}
    >
      <div
        className={`flex items-center justify-between gap-2 border-b pb-1.5 ${
          isDark ? "border-[#C4DE6E]/25" : "border-[#00332A]/15"
        }`}
      >
        <span
          className={`font-mono text-[8.5px] uppercase tracking-widest font-bold ${
            isDark ? "text-[#C4DE6E]" : "text-[#0E5B44]"
          }`}
        >
          {entry.header || "A SWEET LITTLE NOTE"}
        </span>
        <span
          className={`font-holiday leading-none ${
            size === "bento" ? "text-base" : "text-xl"
          } ${isDark ? "text-[#C4DE6E]" : "text-[#0E5B44]"}`}
        >
          nook cake
        </span>
      </div>

      <div
        className={`my-auto py-1 font-mono ${
          size === "bento" ? "space-y-1.5 text-[9.5px]" : "space-y-3 text-[11px]"
        }`}
      >
        <div className={`flex items-baseline gap-1.5 border-b border-dotted pb-0.5 ${lineBorder}`}>
          <span className={`font-bold shrink-0 ${labelColor}`}>Untuk:</span>
          <span className="font-bold truncate" style={messageStyle}>
            {entry.to}
          </span>
        </div>

        <div
          className={`border-b border-dotted flex items-start pt-0.5 ${lineBorder} ${
            size === "bento"
              ? "min-h-[12mm]"
              : size === "square"
              ? "min-h-[34mm]"
              : "min-h-[64mm]"
          }`}
        >
          <p
            style={messageStyle}
            className={`leading-snug ${
              size === "bento" ? "text-[10px] line-clamp-2" : "text-xs"
            } ${isDark ? "text-[#F4F1E8]/90" : "text-[#2E4732]"}`}
          >
            {entry.message || "\u00A0"}
          </p>
        </div>

        <div className="flex items-baseline justify-between gap-2 pt-0.5">
          <div
            className={`flex items-baseline gap-1.5 flex-1 border-b border-dotted pb-0.5 ${lineBorder}`}
          >
            <span className={`font-bold shrink-0 ${labelColor}`}>Dari:</span>
            <span className="font-bold truncate" style={messageStyle}>
              {entry.from}
            </span>
          </div>
          {stickerUrl && size !== "bento" && (
            <Image
              src={stickerUrl}
              alt="Sticker"
              width={size === "a6" ? 40 : 30}
              height={size === "a6" ? 34 : 26}
              className="object-contain shrink-0 -mt-2"
            />
          )}
          <span className={`text-[8px] shrink-0 ${labelColor}`}>{footerHandle}</span>
        </div>
      </div>
    </article>
  );
}
