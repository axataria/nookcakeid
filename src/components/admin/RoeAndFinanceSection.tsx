"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Percent, PlusCircle, Building2, Receipt } from "lucide-react";
import { formatRupiah } from "@/lib/format";

interface FinanceSnapshot {
  kpis: {
    netProfit: number;
    totalEquity: number;
    monthlyOpex: number;
    roePct: number;
  };
  equities: {
    id: string;
    name: string;
    category: string;
    amount: number;
    recordedDate: string;
  }[];
  opex: {
    id: string;
    name: string;
    category: string;
    amount: number;
    periodMonth: string;
  }[];
}

export function RoeAndFinanceSection() {
  const [snapshot, setSnapshot] = useState<FinanceSnapshot | null>(null);
  const [eqName, setEqName] = useState("");
  const [eqAmount, setEqAmount] = useState("");
  const [opexName, setOpexName] = useState("");
  const [opexAmount, setOpexAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
    if (res.ok) {
      setSnapshot((await res.json()) as FinanceSnapshot);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = async (
    e: React.FormEvent,
    kind: "EQUITY" | "OPEX",
  ) => {
    e.preventDefault();
    const name = kind === "EQUITY" ? eqName : opexName;
    const amount = Number(kind === "EQUITY" ? eqAmount : opexAmount);
    if (!name.trim() || !amount || amount <= 0) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name: name.trim(),
          category: kind === "EQUITY" ? "EQUIPMENT" : "UTILITIES",
          amount,
        }),
      });
      if (res.ok) {
        if (kind === "EQUITY") {
          setEqName("");
          setEqAmount("");
        } else {
          setOpexName("");
          setOpexAmount("");
        }
        await load();
      }
    } finally {
      setSaving(false);
    }
  };

  if (!snapshot) return null;

  return (
    <div className="space-y-6">
      {/* Live ROE Banner */}
      <div className="rounded-3xl bg-[#00332A] text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#C4DE6E] font-bold">
            <Percent className="w-4 h-4" />
            <span>RETURN ON EQUITY (ROE) LIVE</span>
          </div>
          <div className="font-display font-extrabold text-3xl sm:text-4xl text-[#C4DE6E]">
            {snapshot.kpis.roePct}%
          </div>
          <p className="font-mono text-xs text-emerald-100/80">
            ROE = (Laba Bersih {formatRupiah(snapshot.kpis.netProfit)} ÷ Total
            Ekuitas {formatRupiah(snapshot.kpis.totalEquity)}) × 100%
          </p>
        </div>

        <div className="flex gap-4 font-mono text-xs bg-[#0E5B44]/60 p-4 rounded-2xl border border-[#C4DE6E]/25">
          <div>
            <div className="text-emerald-100/70">Total Ekuitas</div>
            <div className="font-bold text-sm text-white">
              {formatRupiah(snapshot.kpis.totalEquity)}
            </div>
          </div>
          <div className="border-l border-white/15 pl-4">
            <div className="text-emerald-100/70">OPEX Bulan Ini</div>
            <div className="font-bold text-sm text-white">
              {formatRupiah(snapshot.kpis.monthlyOpex)}
            </div>
          </div>
        </div>
      </div>

      {/* Equity & OPEX Forms + Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equity Card */}
        <div className="bg-white rounded-3xl border border-[#E8E1D5] p-5 space-y-4">
          <h3 className="font-display font-bold text-base text-[#1C1917] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0E5B44]" />
            Modal Awal &amp; Ekuitas Pemilik
          </h3>

          <form
            onSubmit={(e) => void handleSubmit(e, "EQUITY")}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              placeholder="Nama aset / modal (mis. Mixer)"
              value={eqName}
              onChange={(e) => setEqName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9D3C5] text-xs font-mono"
            />
            <input
              type="number"
              placeholder="Nominal Rp"
              value={eqAmount}
              onChange={(e) => setEqAmount(e.target.value)}
              className="w-full sm:w-32 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9D3C5] text-xs font-mono"
            />
            <button
              type="submit"
              disabled={saving}
              className="px-3.5 py-2 rounded-xl bg-[#0E5B44] text-white text-xs font-bold inline-flex items-center justify-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </form>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {snapshot.equities.map((eq) => (
              <div
                key={eq.id}
                className="flex items-center justify-between text-xs font-mono py-2 px-3 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5]"
              >
                <span className="text-[#1C1917] font-semibold">{eq.name}</span>
                <span className="font-bold text-[#0E5B44]">
                  {formatRupiah(eq.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* OPEX Card */}
        <div className="bg-white rounded-3xl border border-[#E8E1D5] p-5 space-y-4">
          <h3 className="font-display font-bold text-base text-[#1C1917] flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-600" />
            Biaya Operasional (OPEX) Bulanan
          </h3>

          <form
            onSubmit={(e) => void handleSubmit(e, "OPEX")}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              placeholder="Nama biaya (mis. Listrik / Gas)"
              value={opexName}
              onChange={(e) => setOpexName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9D3C5] text-xs font-mono"
            />
            <input
              type="number"
              placeholder="Nominal Rp"
              value={opexAmount}
              onChange={(e) => setOpexAmount(e.target.value)}
              className="w-full sm:w-32 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9D3C5] text-xs font-mono"
            />
            <button
              type="submit"
              disabled={saving}
              className="px-3.5 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-bold inline-flex items-center justify-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </form>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {snapshot.opex.map((op) => (
              <div
                key={op.id}
                className="flex items-center justify-between text-xs font-mono py-2 px-3 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5]"
              >
                <span className="text-[#1C1917] font-semibold">
                  {op.name}{" "}
                  <span className="text-[#78716C] font-normal">
                    ({op.periodMonth})
                  </span>
                </span>
                <span className="font-bold text-[#BE123C]">
                  {formatRupiah(op.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
