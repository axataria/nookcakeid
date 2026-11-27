"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Check,
  X,
  ShoppingBag,
  PackagePlus,
  TrendingUp,
  AlertTriangle,
  Wand2,
} from "lucide-react";
import { formatRupiah } from "@/lib/format";
import type { ParsedAction } from "@/lib/smart-parser";

interface QuerySnapshot {
  kpis: {
    totalRevenue: number;
    grossProfit: number;
    grossMarginPct: number;
    netProfit: number;
    roePct: number;
    totalUnitsSold: number;
    bepTargetUnits: number;
    bepProgressPct: number;
    todayBookedUnits: number;
    dailySlotCapacity: number;
  };
  lowStockMaterials: {
    id: string;
    name: string;
    currentStock: number;
    minimumBuffer: number;
    baseUnit: string;
  }[];
  upcomingOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    slotDate: string;
    totalAmount: number;
    status: string;
  }[];
  prepSummary?: {
    ovenBatches: {
      totalBento: number;
      totalSlice: number;
      totalWhole: number;
      loyangBesarEquivalent: number;
      recommendedOvenBatches: number;
    };
    mrpRequirements: {
      materialCode: string;
      name: string;
      totalQuantity: number;
      unit: string;
    }[];
  };
}

interface ChatMessage {
  id: string;
  sender: "owner" | "bot";
  text?: string;
  parsed?: ParsedAction;
  queryResult?: QuerySnapshot;
  status?: "pending" | "saved" | "cancelled";
}

const SHORTCUTS = [
  { label: "+ Order", template: "order Budi 2 bento 1 matcha besok" },
  { label: "+ Stok", template: "masuk calf 200g 24rb, fibercreme 100g 16rb" },
  { label: "+ OPEX", template: "opex listrik 350rb" },
  { label: "Cek Laba", template: "cek laba", autoSend: true },
  { label: "Cek BEP", template: "cek bep", autoSend: true },
  { label: "Cek Prep", template: "cek prep", autoSend: true },
  { label: "Cek Stok", template: "cek stok", autoSend: true },
  { label: "Rekap Besok", template: "rekap besok", autoSend: true },
];

export function QuickChatPanel({
  onExecuted,
  compact = false,
}: {
  onExecuted?: () => void;
  compact?: boolean;
}) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Halo Owner! Ketik perintah cepat untuk catat order, tambah stok bahan + harga, atau cek laba & ROE. Tanpa AI API—instan 100% lokal.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (textToSend: string) => {
    const clean = textToSend.trim();
    if (!clean || loading) return;

    const ownerMsg: ChatMessage = {
      id: `own-${Date.now()}`,
      sender: "owner",
      text: clean,
    };
    setMessages((prev) => [...prev, ownerMsg]);
    setHistory((prev) => (prev[0] === clean ? prev : [clean, ...prev].slice(0, 30)));
    setHistoryIdx(-1);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/chat/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean }),
      });
      const data = (await res.json()) as {
        parsed?: ParsedAction;
        queryResult?: QuerySnapshot;
        error?: string;
      };

      if (!res.ok || !data.parsed) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "bot",
            text: data.error || "Gagal membaca perintah.",
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          parsed: data.parsed,
          queryResult: data.queryResult,
          status:
            data.parsed &&
            ["ORDER", "RESTOCK", "OPEX", "EQUITY"].includes(data.parsed.type)
              ? "pending"
              : undefined,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "bot",
          text: "Terjadi kesalahan jaringan.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (msg: ChatMessage) => {
    if (!msg.parsed || msg.status !== "pending") return;
    setExecutingId(msg.id);
    try {
      const res = await fetch("/api/admin/chat/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: msg.parsed }),
      });
      if (!res.ok) throw new Error("Failed");

      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: "saved" } : m)),
      );
      onExecuted?.();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "bot",
          text: "Gagal menyimpan data. Silakan coba lagi.",
        },
      ]);
    } finally {
      setExecutingId(null);
    }
  };

  const handleCancel = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, status: "cancelled" } : m)),
    );
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-3xl border border-[#E8E1D5] shadow-sm overflow-hidden ${
        compact ? "h-[460px]" : "h-[calc(100vh-180px)] min-h-[500px]"
      }`}
    >
      {/* Header */}
      <div className="px-5 py-3.5 bg-[#00332A] text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#C4DE6E] text-[#00332A] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm leading-tight">
              Admin Quick Chat
            </h2>
            <p className="font-mono text-[10px] text-[#C4DE6E]/80">
              Smart Parser Lokal · Auto-Correction
            </p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[#0E5B44] text-[10px] font-mono text-[#C4DE6E] font-bold">
          0 API Cost
        </span>
      </div>

      {/* Shortcut Pills */}
      <div className="px-4 py-2.5 bg-[#FAF7F2] border-b border-[#E8E1D5] flex items-center gap-1.5 overflow-x-auto">
        {SHORTCUTS.map((sc) => (
          <button
            key={sc.label}
            type="button"
            onClick={() => {
              if (sc.autoSend) {
                void sendMessage(sc.template);
              } else {
                setInput(sc.template);
              }
            }}
            className="shrink-0 px-3 py-1 rounded-full bg-white border border-[#D9D3C5] hover:border-[#0E5B44] text-[11px] font-mono font-bold text-[#00332A] transition-colors"
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8F5]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "owner" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "owner" ? (
              <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-[#0E5B44] text-white text-xs sm:text-sm font-mono shadow-sm">
                {msg.text}
              </div>
            ) : (
              <div className="max-w-[92%] sm:max-w-[85%] space-y-2">
                {msg.text && (
                  <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-white border border-[#E8E1D5] text-xs sm:text-sm text-[#1C1917] shadow-sm">
                    {msg.text}
                  </div>
                )}

                {msg.parsed && msg.parsed.type === "UNKNOWN" && (
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <p className="font-bold">Perintah belum dikenali</p>
                    <p className="font-mono text-[11px]">{msg.parsed.hint}</p>
                  </div>
                )}

                {/* Confirmation Card for Mutations */}
                {msg.parsed &&
                  msg.parsed.type !== "UNKNOWN" &&
                  msg.parsed.type !== "QUERY" && (
                    <div className="rounded-2xl rounded-tl-sm bg-white border-2 border-[#D9D3C5] p-4 shadow-sm space-y-3">
                      {"corrections" in msg.parsed &&
                        msg.parsed.corrections.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {msg.parsed.corrections.map((c, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-mono text-amber-800"
                              >
                                <Wand2 className="w-3 h-3" />
                                {c.original} → {c.correctedTo}
                              </span>
                            ))}
                          </div>
                        )}

                      {msg.parsed.type === "ORDER" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5B44]">
                              <ShoppingBag className="w-3.5 h-3.5" />
                              Catat Pesanan Baru
                            </span>
                            <span className="text-[11px] font-mono text-[#78716C]">
                              Slot: {msg.parsed.slotLabel} ({msg.parsed.slotDate})
                            </span>
                          </div>
                          <div className="text-xs font-mono bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E1D5] space-y-1">
                            <div>
                              Pemesan:{" "}
                              <strong className="text-[#00332A]">
                                {msg.parsed.customerName}
                              </strong>
                            </div>
                            {msg.parsed.items.map((it) => (
                              <div
                                key={it.sku}
                                className="flex justify-between text-[#2E4732]"
                              >
                                <span>
                                  {it.quantity}× {it.productName}
                                </span>
                                <span>
                                  {formatRupiah(it.unitPrice * it.quantity)}
                                </span>
                              </div>
                            ))}
                            <div className="pt-1 border-t border-[#D9D3C5] flex justify-between font-bold text-[#00332A]">
                              <span>Total</span>
                              <span>{formatRupiah(msg.parsed.totalAmount)}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {msg.parsed.type === "RESTOCK" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5B44]">
                              <PackagePlus className="w-3.5 h-3.5" />
                              Tambah Stok Bahan (GRN)
                            </span>
                            <span className="text-[11px] font-mono text-[#78716C]">
                              {msg.parsed.baseUnit}
                            </span>
                          </div>
                          <div className="text-xs font-mono bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E1D5] space-y-1">
                            <div className="font-bold text-[#00332A]">
                              {msg.parsed.materialName}
                            </div>
                            <div className="flex justify-between text-[#2E4732]">
                              <span>
                                {msg.parsed.packSize}
                                {msg.parsed.baseUnit === "PIECE"
                                  ? "pcs"
                                  : msg.parsed.baseUnit.toLowerCase()}{" "}
                                × {msg.parsed.packCount}
                              </span>
                              <span className="font-bold text-[#0E5B44]">
                                +{msg.parsed.quantityAdded.toLocaleString("id-ID")}{" "}
                                {msg.parsed.baseUnit === "PIECE"
                                  ? "pcs"
                                  : msg.parsed.baseUnit.toLowerCase()}
                              </span>
                            </div>
                            {msg.parsed.totalPrice > 0 && (
                              <div className="pt-1 border-t border-[#D9D3C5] flex justify-between text-[#00332A]">
                                <span>
                                  Harga Beli ({formatRupiah(msg.parsed.unitCost)}/
                                  {msg.parsed.baseUnit === "PIECE"
                                    ? "pcs"
                                    : msg.parsed.baseUnit.toLowerCase()}
                                  )
                                </span>
                                <strong>
                                  {formatRupiah(msg.parsed.totalPrice)}
                                </strong>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {msg.parsed.type === "RESTOCK_BATCH" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5B44]">
                              <PackagePlus className="w-3.5 h-3.5" />
                              Tambah {msg.parsed.items.length} Stok Bahan (Batch)
                            </span>
                          </div>
                          <div className="text-xs font-mono bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E1D5] space-y-1.5">
                            {msg.parsed.items.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-[#2E4732]"
                              >
                                <span>
                                  {it.materialName} (+{it.quantityAdded.toLocaleString("id-ID")}{" "}
                                  {it.baseUnit === "PIECE"
                                    ? "pcs"
                                    : it.baseUnit.toLowerCase()}
                                  )
                                </span>
                                <span className="font-bold text-[#00332A]">
                                  {it.totalPrice > 0
                                    ? formatRupiah(it.totalPrice)
                                    : "-"}
                                </span>
                              </div>
                            ))}
                            {msg.parsed.totalPrice > 0 && (
                              <div className="pt-1 border-t border-[#D9D3C5] flex justify-between font-bold text-[#00332A]">
                                <span>Total Belanja</span>
                                <span>{formatRupiah(msg.parsed.totalPrice)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {msg.parsed.type === "ORDER_STATUS" && (
                        <div className="space-y-1.5 text-xs font-mono bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E1D5]">
                          <div className="font-bold text-[#0E5B44]">
                            Update Status Pesanan
                          </div>
                          <div className="flex justify-between text-[#00332A]">
                            <span>Target: {msg.parsed.target}</span>
                            <strong>→ {msg.parsed.statusLabel}</strong>
                          </div>
                        </div>
                      )}

                      {(msg.parsed.type === "OPEX" ||
                        msg.parsed.type === "EQUITY") && (
                        <div className="space-y-1.5 text-xs font-mono bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E1D5]">
                          <div className="font-bold text-[#0E5B44]">
                            {msg.parsed.type === "EQUITY"
                              ? "Catat Modal / Ekuitas"
                              : "Catat Biaya OPEX"}
                          </div>
                          <div className="flex justify-between text-[#00332A]">
                            <span>{msg.parsed.name}</span>
                            <strong>{formatRupiah(msg.parsed.amount)}</strong>
                          </div>
                        </div>
                      )}

                      {msg.status === "pending" ? (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            disabled={executingId === msg.id}
                            onClick={() => handleConfirm(msg)}
                            className="flex-1 py-2 px-3 rounded-xl bg-[#0E5B44] hover:bg-[#0B4A37] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>
                              {executingId === msg.id ? "Menyimpan..." : "Simpan"}
                            </span>
                          </button>
                          <button
                            type="button"
                            disabled={executingId === msg.id}
                            onClick={() => handleCancel(msg.id)}
                            className="py-2 px-3 rounded-xl border border-[#D9D3C5] hover:bg-[#FAF7F2] text-xs font-bold text-[#78716C] flex items-center justify-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Batal</span>
                          </button>
                        </div>
                      ) : msg.status === "saved" ? (
                        <div className="text-[11px] font-mono font-bold text-[#15803D] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Tersimpan ke database!
                        </div>
                      ) : (
                        <div className="text-[11px] font-mono text-[#78716C]">
                          Dibatalkan oleh Owner.
                        </div>
                      )}
                    </div>
                  )}

                {/* Query Result Card */}
                {msg.parsed?.type === "QUERY" && msg.queryResult && (
                  <div className="rounded-2xl rounded-tl-sm bg-white border border-[#D9D3C5] p-4 shadow-sm space-y-2 text-xs font-mono">
                    {msg.parsed.queryKind === "PROFIT" && (
                      <>
                        <div className="flex items-center gap-1.5 font-bold text-[#0E5B44]">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Ringkasan Laba & ROE
                        </div>
                        <div className="flex justify-between">
                          <span>Pendapatan:</span>
                          <strong>
                            {formatRupiah(msg.queryResult.kpis.totalRevenue)}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Laba Kotor:</span>
                          <strong>
                            {formatRupiah(msg.queryResult.kpis.grossProfit)}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Laba Bersih:</span>
                          <strong className="text-[#0E5B44]">
                            {formatRupiah(msg.queryResult.kpis.netProfit)}
                          </strong>
                        </div>
                        <div className="flex justify-between border-t border-[#E8E1D5] pt-1">
                          <span>ROE:</span>
                          <strong className="text-[#0E5B44]">
                            {msg.queryResult.kpis.roePct}%
                          </strong>
                        </div>
                      </>
                    )}

                    {msg.parsed.queryKind === "STOCK" && (
                      <>
                        <div className="flex items-center gap-1.5 font-bold text-amber-700">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Stok Menipis / Kritis ({msg.queryResult.lowStockMaterials.length})
                        </div>
                        {msg.queryResult.lowStockMaterials.length === 0 ? (
                          <p className="text-[#15803D]">
                            Semua stok bahan aman di atas batas minimum!
                          </p>
                        ) : (
                          msg.queryResult.lowStockMaterials.map((m) => (
                            <div key={m.id} className="flex justify-between">
                              <span>{m.name}</span>
                              <span className="text-[#BE123C] font-bold">
                                {m.currentStock} / {m.minimumBuffer}{" "}
                                {m.baseUnit.toLowerCase()}
                              </span>
                            </div>
                          ))
                        )}
                      </>
                    )}

                    {msg.parsed.queryKind === "BEP" && (
                      <>
                        <div className="flex items-center gap-1.5 font-bold text-[#0E5B44]">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Status BEP &amp; Margin
                        </div>
                        <div className="flex justify-between">
                          <span>Terjual Bulan Ini:</span>
                          <strong>
                            {msg.queryResult.kpis.totalUnitsSold} / {msg.queryResult.kpis.bepTargetUnits} loyang
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Progress BEP:</span>
                          <strong className="text-[#0E5B44]">
                            {msg.queryResult.kpis.bepProgressPct}%
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Sisa Target BEP:</span>
                          <strong>
                            {Math.max(
                              0,
                              msg.queryResult.kpis.bepTargetUnits -
                                msg.queryResult.kpis.totalUnitsSold,
                            )}{" "}
                            loyang
                          </strong>
                        </div>
                        <div className="flex justify-between border-t border-[#E8E1D5] pt-1">
                          <span>Gross Margin Rata-rata:</span>
                          <strong className="text-[#0E5B44]">
                            {msg.queryResult.kpis.grossMarginPct}%
                          </strong>
                        </div>
                      </>
                    )}

                    {msg.parsed.queryKind === "PREP" && msg.queryResult.prepSummary && (
                      <>
                        <div className="font-bold text-[#0E5B44]">
                          Prep Dapur &amp; Kebutuhan Oven
                        </div>
                        <div className="flex justify-between">
                          <span>Bento / Whole / Slice:</span>
                          <strong>
                            {msg.queryResult.prepSummary.ovenBatches.totalBento} /{" "}
                            {msg.queryResult.prepSummary.ovenBatches.totalWhole} /{" "}
                            {msg.queryResult.prepSummary.ovenBatches.totalSlice}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Batch Oven (max 4 loyang):</span>
                          <strong className="text-[#0E5B44]">
                            {msg.queryResult.prepSummary.ovenBatches.recommendedOvenBatches} batch
                          </strong>
                        </div>
                        {msg.queryResult.prepSummary.mrpRequirements.length > 0 && (
                          <div className="pt-1 border-t border-[#E8E1D5] space-y-1">
                            <div className="text-[11px] text-[#78716C]">
                              Kebutuhan Bahan Utama:
                            </div>
                            {msg.queryResult.prepSummary.mrpRequirements.map((r) => (
                              <div key={r.materialCode} className="flex justify-between">
                                <span>{r.name}</span>
                                <strong>
                                  {r.totalQuantity.toLocaleString("id-ID")}{" "}
                                  {r.unit.toLowerCase()}
                                </strong>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {msg.parsed.queryKind === "TOMORROW" && (
                      <>
                        <div className="font-bold text-[#00332A]">
                          Antrean Pesanan Aktif ({msg.queryResult.upcomingOrders.length})
                        </div>
                        {msg.queryResult.upcomingOrders.slice(0, 5).map((o) => (
                          <div key={o.id} className="flex justify-between">
                            <span>
                              {o.orderNumber} · {o.customerName}
                            </span>
                            <span>{o.slotDate}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(input);
        }}
        className="p-3 bg-white border-t border-[#E8E1D5] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" && history.length > 0) {
              e.preventDefault();
              const nextIdx = Math.min(historyIdx + 1, history.length - 1);
              setHistoryIdx(nextIdx);
              setInput(history[nextIdx]);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const nextIdx = historyIdx - 1;
              if (nextIdx < 0) {
                setHistoryIdx(-1);
                setInput("");
              } else {
                setHistoryIdx(nextIdx);
                setInput(history[nextIdx]);
              }
            }
          }}
          placeholder="Ketik: order Budi 2 bento 1 matcha besok..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9D3C5] text-xs sm:text-sm font-mono text-[#00332A] placeholder:text-[#687E6C]/70 focus:outline-none focus:border-[#0E5B44]"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          aria-label="Kirim perintah"
          className="p-2.5 rounded-xl bg-[#0E5B44] hover:bg-[#0B4A37] text-white transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
