"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Palette,
  Printer,
  RotateCcw,
  Save,
  Scissors,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  BoxSealSticker,
  CareCard,
  GiftNoteCard,
  SauceCupLabel,
  ThankYouCard,
} from "@/components/print/CardTemplates";
import { UcapanStudioView } from "@/components/print/UcapanStudioView";
import {
  DEFAULT_TEMPLATE_CONFIG,
  InkTheme,
  PrintTemplateConfig,
  STICKER_OPTIONS,
  TEMPLATE_PRESETS,
  TemplateKind,
} from "@/components/print/templateTypes";

const STORAGE_KEY = "nook-print-saved-presets-v1";

interface SavedPreset {
  id: string;
  name: string;
  config: PrintTemplateConfig;
}

export default function PrintTemplateGeneratorPage() {
  const [studioMode, setStudioMode] = useState<"kemasan" | "ucapan">("kemasan");
  const [config, setConfig] = useState<PrintTemplateConfig>(DEFAULT_TEMPLATE_CONFIG);
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [activeEditorTab, setActiveEditorTab] = useState<
    "care" | "thanks" | "gift" | "seal" | "sauce"
  >("care");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "ucapan") {
        setStudioMode("ucapan");
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSavedPresets(JSON.parse(raw));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Sync editor tab when switching single-template sheet
  useEffect(() => {
    if (config.templateKind !== "combo") {
      setActiveEditorTab(config.templateKind);
    }
  }, [config.templateKind]);

  function applyBuiltInPreset(patch: Partial<PrintTemplateConfig>) {
    setConfig((prev) => ({
      ...prev,
      ...patch,
      care: { ...prev.care, ...(patch.care ?? {}) },
      thanks: { ...prev.thanks, ...(patch.thanks ?? {}) },
      gift: { ...prev.gift, ...(patch.gift ?? {}) },
      seal: { ...prev.seal, ...(patch.seal ?? {}) },
      sauce: { ...prev.sauce, ...(patch.sauce ?? {}) },
    }));
  }

  function saveCustomPreset() {
    const trimmed = newPresetName.trim();
    if (!trimmed) return;
    const next: SavedPreset[] = [
      { id: `${Date.now()}`, name: trimmed, config },
      ...savedPresets,
    ].slice(0, 8);
    setSavedPresets(next);
    setNewPresetName("");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  function deleteSavedPreset(id: string) {
    const next = savedPresets.filter((p) => p.id !== id);
    setSavedPresets(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nook-template-${config.templateKind}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

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

      {/* TOP BAR */}
      <header className="print:hidden sticky top-0 z-30 bg-[#F4F1E8]/95 backdrop-blur border-b border-[#00332A]/15">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#0E5B44] hover:underline px-2.5 py-1.5 rounded-lg bg-white border border-[#D9D3C5]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <div>
              <h1 className="font-display font-extrabold text-lg text-[#00332A] leading-tight">
                Print &amp; Ucapan Studio
              </h1>
              <p className="font-mono text-[11px] text-[#687E6C]">
                Template kemasan A4 &amp; kartu ucapan pesanan dalam 1 halaman
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Unified Mode Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-[#EAE5D8] border border-[#D9D3C5]">
              <button
                type="button"
                onClick={() => setStudioMode("kemasan")}
                className={`font-mono text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  studioMode === "kemasan"
                    ? "bg-[#00332A] text-[#C4DE6E] shadow-xs"
                    : "text-[#2E4732] hover:text-[#00332A]"
                }`}
              >
                Kemasan &amp; Care Card
              </button>
              <button
                type="button"
                onClick={() => setStudioMode("ucapan")}
                className={`font-mono text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  studioMode === "ucapan"
                    ? "bg-[#00332A] text-[#C4DE6E] shadow-xs"
                    : "text-[#2E4732] hover:text-[#00332A]"
                }`}
              >
                Kartu Ucapan
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                setConfig((p) => ({ ...p, showCropMarks: !p.showCropMarks }))
              }
              className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-2 rounded-xl border transition-colors ${
                config.showCropMarks
                  ? "bg-white border-[#0E5B44] text-[#0E5B44]"
                  : "bg-white border-[#D9D3C5] text-[#687E6C]"
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              Garis Potong
            </button>

            {studioMode === "kemasan" && (
              <>
                <button
                  type="button"
                  onClick={exportJson}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold bg-white border border-[#D9D3C5] hover:border-[#0E5B44] text-[#2E4732] px-3 py-2 rounded-xl transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export JSON
                </button>

                <button
                  type="button"
                  onClick={() => setConfig(DEFAULT_TEMPLATE_CONFIG)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold bg-white border border-[#D9D3C5] hover:border-[#0E5B44] text-[#2E4732] px-3 py-2 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </>
            )}

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
      </header>

      {/* WORKSPACE: GENERATOR CONTROLS (LEFT) + LIVE A4 SHEET (RIGHT) */}
      {studioMode === "ucapan" ? (
        <UcapanStudioView showCropMarks={config.showCropMarks} />
      ) : (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 print:p-0 grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 items-start">
        {/* LEFT SIDEBAR: GENERATOR CONTROLS */}
        <aside className="print:hidden bg-[#F4F1E8] border border-[#D9D3C5] rounded-2xl p-4 space-y-5 xl:sticky xl:top-20 max-h-[calc(100vh-104px)] overflow-y-auto">
          {/* 1. Sheet Layout */}
          <section className="space-y-2">
            <label className="block font-mono text-[11px] uppercase tracking-wider font-bold text-[#0E5B44]">
              1. Pilih Layout Kertas A4
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  ["combo", "Combo A4 (All-in-One)"],
                  ["care", "Care Card (6×)"],
                  ["thanks", "Thank You (6×)"],
                  ["gift", "Gift Note (8×)"],
                  ["seal", "Segel Box (10×)"],
                  ["sauce", "Label Saus (20×)"],
                ] as [TemplateKind, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setConfig((p) => ({ ...p, templateKind: key }))}
                  className={`font-mono text-[11px] font-bold px-2.5 py-2 rounded-xl text-left transition-colors ${
                    config.templateKind === key
                      ? "bg-[#00332A] text-[#C4DE6E]"
                      : "bg-white text-[#2E4732] border border-[#D9D3C5] hover:border-[#0E5B44]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* 2. Theme */}
          <section className="space-y-2">
            <label className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider font-bold text-[#0E5B44]">
              <Palette className="w-3.5 h-3.5" />
              2. Tema Warna Cetak
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  ["brand", "Brand Mix (Default)"],
                  ["eco", "Kraft / Hemat Tinta"],
                  ["forest", "Full Forest Green"],
                  ["cream", "Warm Cream"],
                ] as [InkTheme, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setConfig((p) => ({ ...p, inkTheme: key }))}
                  className={`font-mono text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-colors ${
                    config.inkTheme === key
                      ? "bg-[#C4DE6E]/45 border-[#0E5B44] text-[#00332A]"
                      : "bg-white border-[#D9D3C5] text-[#2E4732] hover:border-[#0E5B44]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* 3. Presets */}
          <section className="space-y-2">
            <label className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider font-bold text-[#0E5B44]">
              <Sparkles className="w-3.5 h-3.5" />
              3. Preset Cepat
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {TEMPLATE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyBuiltInPreset(preset.patch)}
                  title={preset.description}
                  className="bg-white border border-[#D9D3C5] hover:border-[#0E5B44] rounded-lg px-2.5 py-1.5 text-left transition-colors"
                >
                  <p className="font-display font-bold text-xs text-[#00332A]">
                    {preset.name}
                  </p>
                  <p className="font-mono text-[9.5px] text-[#687E6C] truncate">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Save Custom Preset */}
            <div className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="Simpan preset baru..."
                className="flex-1 font-mono text-[11px] bg-white px-2.5 py-1.5 rounded-lg border border-[#D9D3C5] outline-none focus:border-[#0E5B44]"
              />
              <button
                type="button"
                onClick={saveCustomPreset}
                className="inline-flex items-center gap-1 font-mono text-[11px] font-bold bg-[#0E5B44] text-[#F4F1E8] px-2.5 py-1.5 rounded-lg hover:bg-[#0B4A37]"
              >
                <Save className="w-3 h-3" />
                Simpan
              </button>
            </div>

            {savedPresets.length > 0 && (
              <div className="space-y-1 pt-1">
                {savedPresets.map((sp) => (
                  <div
                    key={sp.id}
                    className="flex items-center justify-between gap-2 bg-white border border-[#D9D3C5] rounded-lg px-2.5 py-1"
                  >
                    <button
                      type="button"
                      onClick={() => setConfig(sp.config)}
                      className="font-mono text-[11px] font-bold text-[#00332A] hover:text-[#0E5B44] truncate text-left flex-1"
                    >
                      {sp.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSavedPreset(sp.id)}
                      className="text-[#687E6C] hover:text-[#E11D48]"
                      aria-label={`Hapus ${sp.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 4. Card Content Editor */}
          <section className="space-y-3 pt-2 border-t border-[#00332A]/10">
            <label className="block font-mono text-[11px] uppercase tracking-wider font-bold text-[#0E5B44]">
              4. Edit Konten Kartu
            </label>

            <div className="flex flex-wrap gap-1">
              {(
                [
                  ["care", "Care"],
                  ["thanks", "Thank You"],
                  ["gift", "Gift"],
                  ["seal", "Segel"],
                  ["sauce", "Saus"],
                ] as const
              ).map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveEditorTab(tab)}
                  className={`font-mono text-[10.5px] font-bold px-2.5 py-1 rounded-md ${
                    activeEditorTab === tab
                      ? "bg-[#00332A] text-[#C4DE6E]"
                      : "bg-white text-[#2E4732] border border-[#D9D3C5]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeEditorTab === "care" && (
              <div className="space-y-2">
                <Field
                  label="Badge"
                  value={config.care.badge}
                  onChange={(v) =>
                    setConfig((p) => ({ ...p, care: { ...p.care, badge: v } }))
                  }
                />
                <Field
                  label="Judul"
                  value={config.care.title}
                  onChange={(v) =>
                    setConfig((p) => ({ ...p, care: { ...p.care, title: v } }))
                  }
                />
                <div>
                  <span className="block font-mono text-[10px] font-bold text-[#2E4732] mb-1">
                    Stiker Ilustrasi
                  </span>
                  <select
                    value={config.care.stickerUrl}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        care: { ...p.care, stickerUrl: e.target.value },
                      }))
                    }
                    className="w-full font-mono text-[11px] bg-white px-2.5 py-1.5 rounded-lg border border-[#D9D3C5] outline-none focus:border-[#0E5B44]"
                  >
                    {STICKER_OPTIONS.map((opt) => (
                      <option key={opt.label} value={opt.url}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Field
                  label="Opsi 1 Judul"
                  value={config.care.step1Title}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      care: { ...p.care, step1Title: v },
                    }))
                  }
                />
                <TextAreaField
                  label="Opsi 1 Deskripsi"
                  value={config.care.step1Desc}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      care: { ...p.care, step1Desc: v },
                    }))
                  }
                />
                <Field
                  label="Opsi 2 Judul"
                  value={config.care.step2Title}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      care: { ...p.care, step2Title: v },
                    }))
                  }
                />
                <TextAreaField
                  label="Opsi 2 Deskripsi"
                  value={config.care.step2Desc}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      care: { ...p.care, step2Desc: v },
                    }))
                  }
                />
                <Field
                  label="Catatan Simpan"
                  value={config.care.storageNote}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      care: { ...p.care, storageNote: v },
                    }))
                  }
                />
                <Field
                  label="Label Tulis Manual"
                  value={config.care.manualLabel}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      care: { ...p.care, manualLabel: v },
                    }))
                  }
                />
              </div>
            )}

            {activeEditorTab === "thanks" && (
              <div className="space-y-2">
                <Field
                  label="Badge Atas"
                  value={config.thanks.badge}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      thanks: { ...p.thanks, badge: v },
                    }))
                  }
                />
                <Field
                  label="Nama Brand"
                  value={config.thanks.brandName}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      thanks: { ...p.thanks, brandName: v },
                    }))
                  }
                />
                <Field
                  label="Tagline"
                  value={config.thanks.tagline}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      thanks: { ...p.thanks, tagline: v },
                    }))
                  }
                />
                <TextAreaField
                  label="Pesan Utama"
                  value={config.thanks.message}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      thanks: { ...p.thanks, message: v },
                    }))
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Field
                    label="Instagram"
                    value={config.thanks.igHandle}
                    onChange={(v) =>
                      setConfig((p) => ({
                        ...p,
                        thanks: { ...p.thanks, igHandle: v },
                      }))
                    }
                  />
                  <Field
                    label="WhatsApp"
                    value={config.thanks.waNumber}
                    onChange={(v) =>
                      setConfig((p) => ({
                        ...p,
                        thanks: { ...p.thanks, waNumber: v },
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field
                    label="CTA Kanan"
                    value={config.thanks.ctaText}
                    onChange={(v) =>
                      setConfig((p) => ({
                        ...p,
                        thanks: { ...p.thanks, ctaText: v },
                      }))
                    }
                  />
                  <Field
                    label="Sub-footer"
                    value={config.thanks.subFooter}
                    onChange={(v) =>
                      setConfig((p) => ({
                        ...p,
                        thanks: { ...p.thanks, subFooter: v },
                      }))
                    }
                  />
                </div>
                <label className="flex items-center gap-2 font-mono text-[11px] text-[#2E4732] pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.thanks.showGrid}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        thanks: { ...p.thanks, showGrid: e.target.checked },
                      }))
                    }
                  />
                  Tampilkan grid cutting mat
                </label>
              </div>
            )}

            {activeEditorTab === "gift" && (
              <div className="space-y-2">
                <Field
                  label="Header"
                  value={config.gift.header}
                  onChange={(v) =>
                    setConfig((p) => ({ ...p, gift: { ...p.gift, header: v } }))
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Field
                    label="Untuk"
                    value={config.gift.toValue}
                    placeholder="Kosong = tulis manual"
                    onChange={(v) =>
                      setConfig((p) => ({
                        ...p,
                        gift: { ...p.gift, toValue: v },
                      }))
                    }
                  />
                  <Field
                    label="Dari"
                    value={config.gift.fromValue}
                    placeholder="Kosong = tulis manual"
                    onChange={(v) =>
                      setConfig((p) => ({
                        ...p,
                        gift: { ...p.gift, fromValue: v },
                      }))
                    }
                  />
                </div>
                <TextAreaField
                  label="Isi Pesan"
                  value={config.gift.messageValue}
                  placeholder="Kosongkan jika ingin ditulis tangan"
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      gift: { ...p.gift, messageValue: v },
                    }))
                  }
                />
                <Field
                  label="Footer Handle"
                  value={config.gift.footerHandle}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      gift: { ...p.gift, footerHandle: v },
                    }))
                  }
                />
              </div>
            )}

            {activeEditorTab === "seal" && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Field
                    label="Brand"
                    value={config.seal.brandName}
                    onChange={(v) =>
                      setConfig((p) => ({
                        ...p,
                        seal: { ...p.seal, brandName: v },
                      }))
                    }
                  />
                  <Field
                    label="Badge"
                    value={config.seal.badge}
                    onChange={(v) =>
                      setConfig((p) => ({
                        ...p,
                        seal: { ...p.seal, badge: v },
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {config.seal.options.map((opt, idx) => (
                    <Field
                      key={idx}
                      label={`Varian ${idx + 1}`}
                      value={opt}
                      onChange={(v) => {
                        const next = [...config.seal.options] as [
                          string,
                          string,
                          string,
                          string
                        ];
                        next[idx] = v;
                        setConfig((p) => ({
                          ...p,
                          seal: { ...p.seal, options: next },
                        }));
                      }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field
                    label="Label Kanan"
                    value={config.seal.rightLabel}
                    onChange={(v) =>
                      setConfig((p) => ({
                        ...p,
                        seal: { ...p.seal, rightLabel: v },
                      }))
                    }
                  />
                  <Field
                    label="Catatan Kanan"
                    value={config.seal.rightSub}
                    onChange={(v) =>
                      setConfig((p) => ({
                        ...p,
                        seal: { ...p.seal, rightSub: v },
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {activeEditorTab === "sauce" && (
              <div className="space-y-2">
                <Field
                  label="Brand"
                  value={config.sauce.brandName}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      sauce: { ...p.sauce, brandName: v },
                    }))
                  }
                />
                <Field
                  label="Rasa 1"
                  value={config.sauce.flavor1}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      sauce: { ...p.sauce, flavor1: v },
                    }))
                  }
                />
                <Field
                  label="Rasa 2"
                  value={config.sauce.flavor2}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      sauce: { ...p.sauce, flavor2: v },
                    }))
                  }
                />
                <Field
                  label="Catatan"
                  value={config.sauce.note}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      sauce: { ...p.sauce, note: v },
                    }))
                  }
                />
              </div>
            )}
          </section>
        </aside>

        {/* RIGHT: LIVE A4 PRINT SHEET */}
        <main className="flex flex-col items-center overflow-x-auto pb-8 print:p-0 print:overflow-visible">
          <div
            data-sheet="a4"
            className="w-[210mm] min-h-[297mm] bg-white shadow-xl print:shadow-none p-[8mm] print:p-0 mx-auto shrink-0"
          >
            {config.templateKind === "combo" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 justify-items-center">
                  <CareCard
                    config={config.care}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                  <CareCard
                    config={config.care}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 justify-items-center">
                  <ThankYouCard
                    config={config.thanks}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                  <ThankYouCard
                    config={config.thanks}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 justify-items-center">
                  <GiftNoteCard
                    config={config.gift}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                  <GiftNoteCard
                    config={config.gift}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 justify-items-center">
                  <BoxSealSticker
                    config={config.seal}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                  <BoxSealSticker
                    config={config.seal}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                  <BoxSealSticker
                    config={config.seal}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                  <BoxSealSticker
                    config={config.seal}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                </div>
              </div>
            )}

            {config.templateKind === "care" && (
              <div className="grid grid-cols-2 gap-4 justify-items-center">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CareCard
                    key={i}
                    config={config.care}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                ))}
              </div>
            )}

            {config.templateKind === "thanks" && (
              <div className="grid grid-cols-2 gap-4 justify-items-center">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ThankYouCard
                    key={i}
                    config={config.thanks}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                ))}
              </div>
            )}

            {config.templateKind === "gift" && (
              <div className="grid grid-cols-2 gap-4 justify-items-center">
                {Array.from({ length: 8 }).map((_, i) => (
                  <GiftNoteCard
                    key={i}
                    config={config.gift}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                ))}
              </div>
            )}

            {config.templateKind === "seal" && (
              <div className="grid grid-cols-2 gap-3 justify-items-center">
                {Array.from({ length: 10 }).map((_, i) => (
                  <BoxSealSticker
                    key={i}
                    config={config.seal}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                ))}
              </div>
            )}

            {config.templateKind === "sauce" && (
              <div className="grid grid-cols-4 gap-5 justify-items-center pt-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <SauceCupLabel
                    key={i}
                    config={config.sauce}
                    theme={config.inkTheme}
                    crop={config.showCropMarks}
                  />
                ))}
              </div>
            )}
          </div>

          <p className="print:hidden font-mono text-xs text-[#2E4732] mt-4 text-center max-w-xl">
            Tip cetak: Saat dialog Print terbuka, aktifkan{" "}
            <strong className="text-[#00332A]">Background graphics</strong> dan set{" "}
            <strong className="text-[#00332A]">Scale: 100%</strong>. Gunakan kertas Art Carton
            260–310 gsm (kartu) atau Sticker Chromo/Vinyl (segel &amp; label saus).
          </p>
        </main>
      </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] font-bold text-[#2E4732] mb-0.5">
        {label}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full font-mono text-[11px] bg-white px-2.5 py-1.5 rounded-lg border border-[#D9D3C5] outline-none focus:border-[#0E5B44] text-[#00332A]"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] font-bold text-[#2E4732] mb-0.5">
        {label}
      </span>
      <textarea
        rows={2}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full font-mono text-[11px] bg-white px-2.5 py-1.5 rounded-lg border border-[#D9D3C5] outline-none focus:border-[#0E5B44] text-[#00332A] resize-y"
      />
    </label>
  );
}
