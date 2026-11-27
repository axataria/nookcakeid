"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Wallet,
  Target,
  Percent,
  ChefHat,
  ArrowRight,
  Package,
  RefreshCw,
  Printer,
} from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { QuickChatPanel } from "@/components/admin/QuickChatPanel";
import type { OrderStatus } from "@/lib/admin-store";

interface DashboardData {
  storageEngine?: "MYSQL" | "FALLBACK";
  kpis: {
    totalRevenue: number;
    totalHpp: number;
    grossProfit: number;
    grossMarginPct: number;
    monthlyOpex: number;
    netProfit: number;
    totalEquity: number;
    roePct: number;
    totalUnitsSold: number;
    bepTargetUnits: number;
    bepProgressPct: number;
    todayBookedUnits: number;
    dailySlotCapacity: number;
    lowStockCount: number;
    totalOrders: number;
  };
  chartSeries: {
    date: string;
    label: string;
    revenue: number;
    hpp: number;
    profit: number;
  }[];
  productMix: {
    sku: string;
    name: string;
    qty: number;
    revenue: number;
  }[];
  orders: {
    id: string;
    orderNumber: string;
    customerName: string;
    slotDate: string;
    totalAmount: number;
    status: OrderStatus;
    items: { productName: string; quantity: number }[];
  }[];
  rawMaterials: {
    id: string;
    name: string;
    baseUnit: string;
    currentStock: number;
    minimumBuffer: number;
  }[];
}

const NEXT_STATUS: Partial<Record<OrderStatus, { next: OrderStatus; label: string }>> = {
  PENDING_PAYMENT: { next: "CONFIRMED_SLOT", label: "Konfirmasi" },
  CONFIRMED_SLOT: { next: "BAKING", label: "Mulai Oven" },
  BAKING: { next: "READY_FOR_DELIVERY", label: "Siap Kirim" },
  READY_FOR_DELIVERY: { next: "DELIVERED", label: "Selesai" },
};

const STATUS_BADGE: Record<OrderStatus, { label: string; cls: string }> = {
  PENDING_PAYMENT: { label: "Menunggu Bayar", cls: "bg-slate-100 text-slate-700" },
  CONFIRMED_SLOT: { label: "Slot Terkonfirmasi", cls: "bg-blue-50 text-blue-700" },
  BAKING: { label: "Di Oven", cls: "bg-amber-100 text-amber-800" },
  READY_FOR_DELIVERY: { label: "Siap Kirim", cls: "bg-emerald-100 text-emerald-800" },
  DELIVERED: { label: "Selesai", cls: "bg-[#0E5B44] text-white" },
  CANCELLED: { label: "Dibatalkan", cls: "bg-rose-100 text-rose-700" },
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as DashboardData;
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const advanceOrder = async (orderId: string, nextStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        await loadDashboard();
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-64 bg-[#E8E1D5] rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-[#E8E1D5]" />
          ))}
        </div>
      </div>
    );
  }

  const { kpis, chartSeries, productMix, orders, rawMaterials } = data;
  const maxChartRev = Math.max(1, ...chartSeries.map((c) => c.revenue));
  const maxMixRev = Math.max(1, ...productMix.map((p) => p.revenue));
  const slotPct = Math.min(
    100,
    Math.round((kpis.todayBookedUnits / Math.max(1, kpis.dailySlotCapacity)) * 100),
  );

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#00332A]">
            Dashboard Operasional &amp; Profit
          </h1>
          <p className="font-mono text-xs text-[#687E6C]">
            Pantau Laba Bersih, BEP, ROE, Pipeline Pesanan &amp; Stok Real-Time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/print"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0E5B44] hover:bg-[#0B4A37] text-xs font-mono font-bold text-[#F4F1E8] shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#C4DE6E]" />
            <span>Print &amp; Ucapan</span>
          </Link>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-mono font-bold border ${
              data.storageEngine === "MYSQL"
                ? "bg-emerald-50 border-emerald-200 text-[#0E5B44]"
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                data.storageEngine === "MYSQL" ? "bg-[#0E5B44]" : "bg-amber-500"
              }`}
            />
            {data.storageEngine === "MYSQL" ? "MySQL Connected" : "Local Fallback"}
          </span>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D9D3C5] hover:border-[#0E5B44] text-xs font-mono font-bold text-[#00332A]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang</span>
          </button>
        </div>
      </div>

      {/* 1. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-[#E8E1D5] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#687E6C] font-mono">
            <span>Pendapatan</span>
            <Wallet className="w-4 h-4 text-[#0E5B44]" />
          </div>
          <div className="font-display font-extrabold text-lg sm:text-xl text-[#00332A]">
            {formatRupiah(kpis.totalRevenue)}
          </div>
          <p className="font-mono text-[10px] text-[#687E6C]">
            {kpis.totalOrders} pesanan aktif
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E1D5] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#687E6C] font-mono">
            <span>Laba Kotor</span>
            <TrendingUp className="w-4 h-4 text-[#0E5B44]" />
          </div>
          <div className="font-display font-extrabold text-lg sm:text-xl text-[#00332A]">
            {formatRupiah(kpis.grossProfit)}
          </div>
          <p className="font-mono text-[10px] text-[#0E5B44] font-bold">
            Margin {kpis.grossMarginPct}%
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E1D5] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#687E6C] font-mono">
            <span>Laba Bersih</span>
            <Wallet className="w-4 h-4 text-amber-600" />
          </div>
          <div
            className={`font-display font-extrabold text-lg sm:text-xl ${
              kpis.netProfit >= 0 ? "text-[#0E5B44]" : "text-[#BE123C]"
            }`}
          >
            {formatRupiah(kpis.netProfit)}
          </div>
          <p className="font-mono text-[10px] text-[#687E6C]">
            OPEX bln ini: {formatRupiah(kpis.monthlyOpex)}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E1D5] p-4 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#687E6C] font-mono">
            <span>BEP Bulanan</span>
            <Target className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-display font-extrabold text-lg sm:text-xl text-[#00332A]">
            {kpis.bepProgressPct}%
          </div>
          <div className="w-full h-1.5 bg-[#EAE5D8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0E5B44] rounded-full transition-all"
              style={{ width: `${kpis.bepProgressPct}%` }}
            />
          </div>
          <p className="font-mono text-[10px] text-[#687E6C]">
            {kpis.totalUnitsSold} / {kpis.bepTargetUnits} unit bento eq.
          </p>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-[#00332A] text-white rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#C4DE6E] font-mono">
            <span>ROE (Ekuitas)</span>
            <Percent className="w-4 h-4" />
          </div>
          <div className="font-display font-extrabold text-xl sm:text-2xl text-[#C4DE6E]">
            {kpis.roePct}%
          </div>
          <p className="font-mono text-[10px] text-emerald-100/80">
            Modal: {formatRupiah(kpis.totalEquity)}
          </p>
        </div>
      </div>

      {/* 2. Charts + Quick Chat */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 cols: Financial Chart & Product Mix */}
        <div className="xl:col-span-7 space-y-6">
          {/* Revenue vs HPP vs Gross Profit Chart */}
          <div className="bg-white rounded-3xl border border-[#E8E1D5] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-base text-[#00332A]">
                  Tren Pendapatan vs HPP vs Laba Kotor
                </h2>
                <p className="font-mono text-[11px] text-[#687E6C]">
                  5 hari operasional terakhir
                </p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0E5B44]" /> Omzet
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#C4DE6E]" /> Laba
                </span>
              </div>
            </div>

            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-4 border-b border-[#E8E1D5]">
              {chartSeries.map((day) => {
                const revH = Math.max(4, Math.round((day.revenue / maxChartRev) * 100));
                const profH = Math.max(4, Math.round((day.profit / maxChartRev) * 100));
                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                  >
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      <div
                        title={`Omzet: ${formatRupiah(day.revenue)}`}
                        className="w-4 sm:w-6 bg-[#0E5B44] rounded-t-lg transition-all"
                        style={{ height: `${day.revenue > 0 ? revH : 4}%` }}
                      />
                      <div
                        title={`Laba Kotor: ${formatRupiah(day.profit)}`}
                        className="w-4 sm:w-6 bg-[#C4DE6E] rounded-t-lg transition-all"
                        style={{ height: `${day.profit > 0 ? profH : 4}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between gap-2 sm:gap-4 text-[10px] font-mono text-[#687E6C]">
              {chartSeries.map((day) => (
                <div key={day.date} className="flex-1 text-center">
                  <div className="font-bold text-[#00332A]">{day.label}</div>
                  <div>{day.revenue > 0 ? `${Math.round(day.revenue / 1000)}k` : "-"}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Mix */}
          <div className="bg-white rounded-3xl border border-[#E8E1D5] p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="font-display font-extrabold text-base text-[#00332A]">
              Komposisi Penjualan per Produk
            </h2>
            <div className="space-y-3">
              {productMix.map((prod) => {
                const pct = Math.round((prod.revenue / maxMixRev) * 100);
                return (
                  <div key={prod.sku} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-[#00332A]">
                        {prod.name}{" "}
                        <span className="text-[#687E6C] font-normal">
                          ({prod.qty} pcs)
                        </span>
                      </span>
                      <span className="font-bold text-[#0E5B44]">
                        {formatRupiah(prod.revenue)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E8E1D5]">
                      <div
                        className="h-full bg-[#0E5B44] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 cols: Embedded Quick Chat */}
        <div className="xl:col-span-5">
          <QuickChatPanel compact onExecuted={() => void loadDashboard()} />
        </div>
      </div>

      {/* 3. Order Pipeline & Raw Material Stock Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order Pipeline */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E1D5] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display font-extrabold text-base text-[#00332A] flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-[#0E5B44]" />
                Pipeline Pesanan &amp; Kuota Slot
              </h2>
              <p className="font-mono text-[11px] text-[#687E6C]">
                Kapasitas Solo Baker hari ini: {kpis.todayBookedUnits} /{" "}
                {kpis.dailySlotCapacity} Bento ({slotPct}%)
              </p>
            </div>
            <div className="w-32 h-2 bg-[#EAE5D8] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  slotPct >= 90 ? "bg-[#BE123C]" : "bg-[#0E5B44]"
                }`}
                style={{ width: `${slotPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {orders.map((ord) => {
              const badge = STATUS_BADGE[ord.status];
              const nextInfo = NEXT_STATUS[ord.status];
              return (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-[#00332A]">
                        {ord.orderNumber}
                      </span>
                      <span className="font-display font-bold text-sm text-[#00332A]">
                        {ord.customerName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-[#687E6C]">
                      Slot {ord.slotDate} ·{" "}
                      {ord.items.map((i) => `${i.quantity}× ${i.productName}`).join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="font-mono font-bold text-xs text-[#00332A]">
                      {formatRupiah(ord.totalAmount)}
                    </span>
                    {nextInfo && (
                      <button
                        type="button"
                        disabled={updatingOrderId === ord.id}
                        onClick={() => void advanceOrder(ord.id, nextInfo.next)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0E5B44] hover:bg-[#0B4A37] text-white text-[11px] font-bold transition-colors disabled:opacity-50"
                      >
                        <span>{nextInfo.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Raw Material Stock Bars */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E1D5] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-base text-[#00332A] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#0E5B44]" />
              Indikator Stok Bahan Baku
            </h2>
            {kpis.lowStockCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-[#BE123C] text-[10px] font-mono font-bold">
                {kpis.lowStockCount} Kritis/Menipis
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {rawMaterials.map((mat) => {
              const ratio =
                mat.minimumBuffer > 0 ? mat.currentStock / mat.minimumBuffer : 2;
              const pct = Math.min(100, Math.round((ratio / 2.5) * 100));
              const level =
                ratio <= 0.8
                  ? { label: "Kritis", bar: "bg-[#BE123C]", badge: "text-[#BE123C] bg-rose-50" }
                  : ratio <= 1.2
                    ? { label: "Menipis", bar: "bg-amber-500", badge: "text-amber-800 bg-amber-50" }
                    : { label: "Aman", bar: "bg-[#0E5B44]", badge: "text-[#0E5B44] bg-emerald-50" };

              return (
                <div key={mat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#00332A]">{mat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#687E6C]">
                        {mat.currentStock.toLocaleString("id-ID")}{" "}
                        {mat.baseUnit === "PIECE" ? "pcs" : mat.baseUnit.toLowerCase()}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${level.badge}`}
                      >
                        {level.label}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E8E1D5]">
                    <div
                      className={`h-full rounded-full transition-all ${level.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
