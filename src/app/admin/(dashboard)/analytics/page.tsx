'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Target,
  Award,
} from 'lucide-react';
import { ACTIVE_CATALOG_SKUS, FINANCIAL_MASTER } from '@/lib/finance';
import { formatRupiah } from '@/lib/format';
import { RoeAndFinanceSection } from '@/components/admin/RoeAndFinanceSection';

interface DashboardKpis {
  totalRevenue: number;
  totalHpp: number;
  grossProfit: number;
  grossMarginPct: number;
  monthlyOpex: number;
  netProfit: number;
  totalUnitsSold: number;
  bepTargetUnits: number;
  bepProgressPct: number;
  totalOrders: number;
}

export default function AnalyticsPage() {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);

  const loadKpis = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dashboard', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data?.kpis) setKpis(data.kpis as DashboardKpis);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    void loadKpis();
  }, [loadKpis]);

  const totalRevenue = kpis?.totalRevenue ?? 0;
  const totalHpp = kpis?.totalHpp ?? 0;
  const grossProfit = kpis?.grossProfit ?? 0;
  const grossMarginPct = kpis?.grossMarginPct ?? 0;
  const monthlyOpex = kpis?.monthlyOpex ?? 0;
  const netProfit = kpis?.netProfit ?? 0;
  const totalOrders = kpis?.totalOrders ?? 0;
  const currentBentoSold = kpis?.totalUnitsSold ?? 0;
  const bepTargetUnits = kpis?.bepTargetUnits ?? 41;
  const bepPercent = kpis?.bepProgressPct ?? 0;
  const bepReached = currentBentoSold >= bepTargetUnits;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E1D5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-semibold">
              Master Finansial &amp; HPP
            </span>
            <span className="text-xs text-[#78716C]">
              Unit Economics &amp; Profit Engine
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
            Laba Bersih &amp; Break-Even Point (BEP)
          </h1>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[#E8E1D5] shadow-subtle text-xs">
          <ShieldCheck className="w-4 h-4 text-[#15803D]" />
          <span>
            Fixed OPEX Bulanan:{' '}
            <strong className="text-[#1C1917]">{formatRupiah(monthlyOpex)}</strong>
          </span>
        </div>
      </div>

      <RoeAndFinanceSection onUpdated={() => void loadKpis()} />

      {/* High-Level Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-1">
          <span className="text-xs text-[#78716C] font-semibold">Total Pendapatan Kotor</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
            {formatRupiah(totalRevenue)}
          </p>
          <span className="text-[11px] text-[#15803D] flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{totalOrders} pesanan bulan ini</span>
          </span>
        </div>

        {/* Total COGS / HPP */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-1">
          <span className="text-xs text-[#78716C] font-semibold">Total HPP Bahan Baku</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#78716C]">
            {formatRupiah(totalHpp)}
          </p>
          <span className="text-[11px] text-[#78716C] block">
            Food cost + kemasan eco bagasse
          </span>
        </div>

        {/* Gross Profit & Margin */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-1">
          <span className="text-xs text-[#78716C] font-semibold">Laba Kotor (Gross Margin)</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#D97706]">
            {formatRupiah(grossProfit)}
          </p>
          <span className="text-[11px] text-[#B45309] font-bold block">
            Margin Rata-rata: {grossMarginPct}%
          </span>
        </div>

        {/* Net Profit to Solo Baker */}
        <div className="p-5 rounded-3xl bg-[#FEF3C7] border border-[#FDE68A] shadow-card space-y-1 text-[#B45309]">
          <span className="text-xs font-semibold">Take-Home Pay Solo Baker</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold">
            {formatRupiah(netProfit)}
          </p>
          <span className="text-[11px] block">
            Laba bersih setelah OPEX bulanan
          </span>
        </div>
      </div>

      {/* Break-Even Point (BEP) Progress Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#D97706]" />
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Status Titik Impas (Break-Even Point)
              </h2>
            </div>
            <p className="text-xs text-[#78716C]">
              Cukup <strong>{bepTargetUnits} Bento / bulan (~2 bento/hari)</strong> untuk menutup seluruh beban operasional tetap {formatRupiah(monthlyOpex)}.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold w-fit">
            <Award className="w-4 h-4" />
            <span>{bepReached ? `BEP Terlampaui (${bepPercent}%)` : `Progress BEP (${bepPercent}%)`}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-[#FAF8F5] h-3 rounded-full border border-[#E8E1D5] overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#D97706] to-[#15803D] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, bepPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#78716C]">
            <span>0 Bento</span>
            <span>BEP: {bepTargetUnits} Bento ({bepReached ? 'Tercapai' : 'Belum Tercapai'})</span>
            <span className="font-bold text-[#1C1917]">Realisasi: {currentBentoSold} Bento</span>
          </div>
        </div>
      </div>

      {/* Unit Economics Master Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#D97706]" />
            <h2 className="font-serif text-xl font-bold text-[#1C1917]">
              Master HPP &amp; Gross Margin per Produk
            </h2>
          </div>
          <span className="text-xs text-[#78716C]">Sesuai Katalog &amp; Resep Aktif</span>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E1D5] text-[#78716C]">
                <th className="pb-3 font-semibold">Produk</th>
                <th className="pb-3 font-semibold text-right">Harga Jual</th>
                <th className="pb-3 font-semibold text-right">Food Cost</th>
                <th className="pb-3 font-semibold text-right">Kemasan &amp; Ovh</th>
                <th className="pb-3 font-semibold text-right">Total HPP</th>
                <th className="pb-3 font-semibold text-right">Laba Kotor</th>
                <th className="pb-3 font-semibold text-center">Gross Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E1D5]">
              {ACTIVE_CATALOG_SKUS.map((sku) => FINANCIAL_MASTER[sku]).map((prod) => (
                <tr key={prod.sku} className="hover:bg-[#FAF8F5]">
                  <td className="py-3.5">
                    <span className="font-bold text-[#1C1917] block">
                      {prod.name}
                    </span>
                    <span className="text-[10px] text-[#78716C] font-mono">
                      {prod.sku}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-serif font-bold text-[#1C1917]">
                    {formatRupiah(prod.sellingPrice)}
                  </td>
                  <td className="py-3.5 text-right font-serif text-[#78716C]">
                    {formatRupiah(prod.foodCost)}
                  </td>
                  <td className="py-3.5 text-right font-serif text-[#78716C]">
                    {formatRupiah(prod.packagingCost + prod.overheadCost)}
                  </td>
                  <td className="py-3.5 text-right font-serif font-bold text-[#78716C]">
                    {formatRupiah(prod.totalHpp)}
                  </td>
                  <td className="py-3.5 text-right font-serif font-bold text-[#15803D]">
                    +{formatRupiah(prod.grossProfit)}
                  </td>
                  <td className="py-3.5 text-center">
                    <span className="px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] font-bold text-[11px]">
                      {prod.grossMarginPct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 Operational Scenarios Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#E8E1D5] shadow-subtle space-y-2">
          <span className="text-xs font-semibold text-[#78716C]">Skenario 1: Santai / Pesimis</span>
          <h3 className="font-serif text-lg font-bold text-[#1C1917]">8 Bento / Hari</h3>
          <p className="text-xs text-[#78716C]">
            Waktu kerja ~2 jam/hari. Menghasilkan laba bersih <strong>Rp 6,09 Juta / bulan</strong>.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#FAF8F5] border-2 border-[#D97706] shadow-card space-y-2 relative">
          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#D97706] text-white text-[10px] font-bold">
            Optimal Sweet Spot
          </div>
          <span className="text-xs font-semibold text-[#B45309]">Skenario 2: Solo Baker Sweet Spot</span>
          <h3 className="font-serif text-lg font-bold text-[#1C1917]">14 Bento / Hari</h3>
          <p className="text-xs text-[#78716C]">
            Waktu kerja ~4 jam/hari. Menghasilkan laba bersih langsung ke kantong sebesar <strong>Rp 12,58 Juta / bulan</strong>.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E8E1D5] shadow-subtle space-y-2">
          <span className="text-xs font-semibold text-[#78716C]">Skenario 3: Peak Weekend</span>
          <h3 className="font-serif text-lg font-bold text-[#1C1917]">20 Bento / Hari</h3>
          <p className="text-xs text-[#78716C]">
            Batas atas kapasitas oven mandiri. Menghasilkan laba bersih <strong>Rp 19,34 Juta / bulan</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
