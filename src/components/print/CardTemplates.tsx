import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import {
  BoxSealConfig,
  CareCardConfig,
  GiftNoteConfig,
  InkTheme,
  SauceLabelConfig,
  ThankYouCardConfig,
} from "./templateTypes";

function cropClass(crop: boolean) {
  return crop ? "border border-dashed border-[#687E6C]/60" : "";
}

function getLightSurface(theme: InkTheme) {
  if (theme === "eco") return "bg-white text-[#00332A]";
  if (theme === "forest") return "bg-[#0E5B44] text-[#F4F1E8]";
  return "bg-[#F4F1E8] text-[#00332A]";
}

function getDarkSurface(theme: InkTheme) {
  if (theme === "eco") return "bg-white text-[#00332A]";
  if (theme === "cream") return "bg-[#F4F1E8] text-[#00332A]";
  return "bg-[#0E5B44] text-[#F4F1E8]";
}

export function CareCard({
  config,
  theme,
  crop,
}: {
  config: CareCardConfig;
  theme: InkTheme;
  crop: boolean;
}) {
  const isEco = theme === "eco";
  const isDark = theme === "forest";

  return (
    <article
      data-asset="care-card"
      className={`w-[90mm] h-[90mm] p-4 flex flex-col justify-between relative overflow-hidden ${cropClass(
        crop
      )} ${getLightSurface(theme)}`}
    >
      <div
        className={`flex items-start justify-between gap-2 border-b pb-2 ${
          isDark ? "border-[#C4DE6E]/25" : "border-[#00332A]/15"
        }`}
      >
        <div>
          <span
            className={`inline-block font-mono text-[8px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded ${
              isEco
                ? "border border-[#00332A] text-[#00332A]"
                : isDark
                ? "bg-[#C4DE6E] text-[#00332A]"
                : "bg-[#0E5B44] text-[#C4DE6E]"
            }`}
          >
            {config.badge}
          </span>
          <h2
            className={`font-display font-black text-base leading-tight mt-1 ${
              isDark ? "text-[#F4F1E8]" : "text-[#00332A]"
            }`}
          >
            {config.title}
          </h2>
        </div>
        {config.stickerUrl && (
          <Image
            src={config.stickerUrl}
            alt="Sticker"
            width={38}
            height={32}
            className="object-contain shrink-0"
          />
        )}
      </div>

      <div className="space-y-2 my-auto py-1">
        <div
          className={`p-2 rounded-lg border ${
            isEco
              ? "border-[#00332A]/25 bg-white"
              : isDark
              ? "border-[#C4DE6E]/25 bg-[#00332A]/50"
              : "border-[#D9D3C5] bg-white/90"
          }`}
        >
          <p
            className={`font-display font-extrabold text-[11px] ${
              isDark ? "text-[#C4DE6E]" : "text-[#0E5B44]"
            }`}
          >
            {config.step1Title}
          </p>
          <p
            className={`font-mono text-[9.5px] leading-snug mt-0.5 ${
              isDark ? "text-[#F4F1E8]/90" : "text-[#2E4732]"
            }`}
          >
            {config.step1Desc}
          </p>
        </div>

        <div
          className={`p-2 rounded-lg border ${
            isEco
              ? "border-[#00332A]/25 bg-white"
              : isDark
              ? "border-[#C4DE6E]/25 bg-[#00332A]/50"
              : "border-[#D9D3C5] bg-white/90"
          }`}
        >
          <p
            className={`font-display font-extrabold text-[11px] ${
              isDark ? "text-[#C4DE6E]" : "text-[#0E5B44]"
            }`}
          >
            {config.step2Title}
          </p>
          <p
            className={`font-mono text-[9.5px] leading-snug mt-0.5 ${
              isDark ? "text-[#F4F1E8]/90" : "text-[#2E4732]"
            }`}
          >
            {config.step2Desc}
          </p>
        </div>
      </div>

      <div
        className={`border-t pt-2 flex items-end justify-between gap-2 ${
          isDark ? "border-[#C4DE6E]/25" : "border-[#00332A]/15"
        }`}
      >
        <div
          className={`font-mono text-[8.5px] leading-tight ${
            isDark ? "text-[#F4F1E8]/85" : "text-[#2E4732]"
          }`}
        >
          <p className={`font-bold ${isDark ? "text-[#F4F1E8]" : "text-[#00332A]"}`}>
            {config.storageNote}
          </p>
          <p
            className={`mt-1 flex items-end gap-1 ${
              isDark ? "text-[#C4DE6E]/90" : "text-[#687E6C]"
            }`}
          >
            <span>{config.manualLabel}</span>
            <span
              className={`inline-block w-24 border-b border-dotted ${
                isDark ? "border-[#C4DE6E]/70" : "border-[#687E6C]/80"
              }`}
            />
          </p>
        </div>
        <span
          className={`font-holiday text-xl leading-none shrink-0 ${
            isDark ? "text-[#C4DE6E]" : "text-[#0E5B44]"
          }`}
        >
          nook cake
        </span>
      </div>
    </article>
  );
}

export function ThankYouCard({
  config,
  theme,
  crop,
}: {
  config: ThankYouCardConfig;
  theme: InkTheme;
  crop: boolean;
}) {
  const isEco = theme === "eco";
  const isCream = theme === "cream";
  const isDark = !isEco && !isCream;

  return (
    <article
      data-asset="thank-you-card"
      className={`w-[90mm] h-[90mm] p-4 flex flex-col justify-between relative overflow-hidden ${cropClass(
        crop
      )} ${getDarkSurface(theme)}`}
    >
      {config.showGrid && isDark && (
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
              : isCream
              ? "bg-[#0E5B44] text-[#C4DE6E]"
              : "bg-[#C4DE6E] text-[#00332A]"
          }`}
        >
          {config.badge}
        </span>
        <Sparkles className={`w-3.5 h-3.5 ${isDark ? "text-[#C4DE6E]" : "text-[#0E5B44]"}`} />
      </div>

      <div className="relative z-10 text-center my-auto px-2">
        <p
          className={`font-holiday text-4xl leading-none ${
            isDark ? "text-[#C4DE6E]" : "text-[#0E5B44]"
          }`}
        >
          {config.brandName}
        </p>
        <p
          className={`font-mono text-[9.5px] italic mt-1 ${
            isDark ? "text-[#F4F1E8]/80" : "text-[#687E6C]"
          }`}
        >
          {config.tagline}
        </p>

        <p
          className={`font-display font-bold text-xs leading-relaxed mt-3 ${
            isDark ? "text-[#F4F1E8]" : "text-[#00332A]"
          }`}
        >
          {config.message}
        </p>
      </div>

      <div
        className={`relative z-10 border-t pt-2 flex items-center justify-between font-mono text-[8.5px] ${
          isDark
            ? "border-[#C4DE6E]/30 text-[#F4F1E8]/90"
            : "border-[#00332A]/20 text-[#2E4732]"
        }`}
      >
        <div>
          <p className="font-bold">{config.igHandle}</p>
          <p>{config.waNumber}</p>
        </div>
        <div className="text-right">
          <p className={`font-bold ${isDark ? "text-[#C4DE6E]" : "text-[#0E5B44]"}`}>
            {config.ctaText}
          </p>
          <p className="opacity-80">{config.subFooter}</p>
        </div>
      </div>
    </article>
  );
}

export function GiftNoteCard({
  config,
  theme,
  crop,
}: {
  config: GiftNoteConfig;
  theme: InkTheme;
  crop: boolean;
}) {
  const isEco = theme === "eco";
  const isDark = theme === "forest";

  return (
    <article
      data-asset="gift-note-card"
      className={`w-[90mm] h-[48mm] p-3.5 flex flex-col justify-between relative ${cropClass(
        crop
      )} ${
        isEco
          ? "bg-white text-[#00332A]"
          : isDark
          ? "bg-[#00332A] text-[#F4F1E8]"
          : "bg-[#FAF7F0] text-[#00332A]"
      }`}
    >
      <div
        className={`flex items-center justify-between border-b pb-1.5 ${
          isDark ? "border-[#C4DE6E]/25" : "border-[#00332A]/15"
        }`}
      >
        <span
          className={`font-mono text-[8px] uppercase tracking-widest font-bold ${
            isDark ? "text-[#C4DE6E]" : "text-[#0E5B44]"
          }`}
        >
          {config.header}
        </span>
        <span
          className={`font-holiday text-base leading-none ${
            isDark ? "text-[#C4DE6E]" : "text-[#0E5B44]"
          }`}
        >
          nook cake
        </span>
      </div>

      <div className="space-y-1.5 my-auto py-1 font-mono text-[9.5px]">
        <div
          className={`flex items-baseline gap-1.5 border-b border-dotted pb-0.5 ${
            isDark ? "border-[#C4DE6E]/40" : "border-[#687E6C]/60"
          }`}
        >
          <span className={`font-bold shrink-0 ${isDark ? "text-[#C4DE6E]" : "text-[#687E6C]"}`}>
            {config.toLabel}
          </span>
          <span className="font-bold truncate">{config.toValue}</span>
        </div>

        <div
          className={`min-h-[12mm] border-b border-dotted flex items-start pt-0.5 ${
            isDark ? "border-[#C4DE6E]/40" : "border-[#687E6C]/60"
          }`}
        >
          <p
            className={`text-[10px] leading-snug line-clamp-2 ${
              isDark ? "text-[#F4F1E8]/90" : "text-[#2E4732]"
            }`}
          >
            {config.messageValue || "\u00A0"}
          </p>
        </div>

        <div className="flex items-baseline justify-between gap-2 pt-0.5">
          <div
            className={`flex items-baseline gap-1.5 flex-1 border-b border-dotted pb-0.5 ${
              isDark ? "border-[#C4DE6E]/40" : "border-[#687E6C]/60"
            }`}
          >
            <span
              className={`font-bold shrink-0 ${isDark ? "text-[#C4DE6E]" : "text-[#687E6C]"}`}
            >
              {config.fromLabel}
            </span>
            <span className="font-bold truncate">{config.fromValue}</span>
          </div>
          <span className={`text-[8px] shrink-0 ${isDark ? "text-[#C4DE6E]/80" : "text-[#687E6C]"}`}>
            {config.footerHandle}
          </span>
        </div>
      </div>
    </article>
  );
}

export function BoxSealSticker({
  config,
  theme,
  crop,
}: {
  config: BoxSealConfig;
  theme: InkTheme;
  crop: boolean;
}) {
  const isEco = theme === "eco";
  const isCream = theme === "cream";
  const isDark = !isEco && !isCream;

  return (
    <article
      data-asset="box-seal-sticker"
      className={`w-[90mm] h-[32mm] px-3.5 py-2.5 flex items-center justify-between gap-3 ${cropClass(
        crop
      )} ${
        isEco
          ? "bg-white text-[#00332A]"
          : isCream
          ? "bg-[#F4F1E8] text-[#00332A]"
          : "bg-[#00332A] text-[#F4F1E8]"
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`font-holiday text-xl leading-none ${
              isDark ? "text-[#C4DE6E]" : "text-[#0E5B44]"
            }`}
          >
            {config.brandName}
          </span>
          <span
            className={`font-mono text-[7.5px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold ${
              isEco
                ? "border border-[#00332A] text-[#00332A]"
                : isCream
                ? "bg-[#0E5B44] text-[#C4DE6E]"
                : "bg-[#0E5B44] text-[#C4DE6E]"
            }`}
          >
            {config.badge}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 font-mono text-[8px] mt-1.5 opacity-90">
          {config.options.filter(Boolean).map((opt, idx) => (
            <span key={idx}>[ ] {opt}</span>
          ))}
        </div>
      </div>

      <div
        className={`text-right shrink-0 border-l pl-2.5 font-mono text-[8px] leading-tight ${
          isDark ? "border-[#C4DE6E]/25" : "border-[#00332A]/20"
        }`}
      >
        <p className="uppercase tracking-wider opacity-75">{config.rightLabel}</p>
        <div
          className={`w-16 h-3.5 mt-0.5 ml-auto border-b border-dotted ${
            isDark ? "border-[#F4F1E8]/60" : "border-[#00332A]/60"
          }`}
        />
        <p className={`mt-1.5 ${isDark ? "text-[#C4DE6E]" : "text-[#0E5B44]"}`}>
          {config.rightSub}
        </p>
      </div>
    </article>
  );
}

export function SauceCupLabel({
  config,
  theme,
  crop,
}: {
  config: SauceLabelConfig;
  theme: InkTheme;
  crop: boolean;
}) {
  const isEco = theme === "eco";
  const isDark = theme === "forest";

  return (
    <article
      data-asset="sauce-cup-label"
      className={`w-[38mm] h-[38mm] p-2.5 rounded-full flex flex-col items-center justify-center text-center ${
        crop ? "border border-dashed border-[#687E6C]/70" : ""
      } ${
        isEco
          ? "bg-white text-[#00332A]"
          : isDark
          ? "bg-[#00332A] text-[#F4F1E8]"
          : "bg-[#F4F1E8] text-[#00332A]"
      }`}
    >
      <span
        className={`font-holiday text-base leading-none ${
          isDark ? "text-[#C4DE6E]" : "text-[#0E5B44]"
        }`}
      >
        {config.brandName}
      </span>
      <div className="font-mono text-[7.5px] leading-snug mt-1.5 space-y-0.5 text-left">
        <p>[ ] {config.flavor1}</p>
        <p>[ ] {config.flavor2}</p>
      </div>
      <p
        className={`font-mono text-[6.5px] mt-1.5 ${
          isDark ? "text-[#C4DE6E]/90" : "text-[#687E6C]"
        }`}
      >
        {config.note}
      </p>
    </article>
  );
}
