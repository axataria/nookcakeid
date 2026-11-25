'use client';

import React from 'react';
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
import {
  FINANCIAL_MASTER,
  MONTHLY_FIXED_OPEX,
  BEP_MONTHLY_BENTO_UNITS,
  calculateDailyProfit,
} from '@/lib/finance';
import { formatRupiah } from '@/lib/format';

export default function AnalyticsPage() {
  // Sample month-to-date sales data
  const sampleSales = [
    { sku: 'CAKE-BENTO-10X7', quantity: 180, unitPrice: 59000 },
    { sku: 'CAKE-SLICE-CLASSIC', quantity: 95, unitPrice: 40000 },
    { sku: 'CAKE-WHOLE-16CM', quantity: 14, unitPrice: 195000 },
    { sku: 'CAKE-BENTO-MATCHA', quantity: 35, unitPrice: 65000 },
  ];

  const monthlyProfit = calculateDailyProfit(sampleSales, MONTHLY_FIXED_OPEX);

  const currentBentoSold = 180 + 35;
  const bepPercent = Math.min(100, Math.round((currentBentoSold / BEP_MONTHLY_BENTO_UNITS) * 100));

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
            <strong className="text-[#1C1917]">{formatRupiah(MONTHLY_FIXED_OPEX)}</strong>
          </span>
        </div>
      </div>

      {/* High-Level Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-1">
          <span className="text-xs text-[#78716C] font-semibold">Total Pendapatan Kotor</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
            {formatRupiah(monthlyProfit.grossRevenue)}
          </p>
          <span className="text-[11px] text-[#15803D] flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>324 pesanan bulan ini</span>
          </span>
        </div>

        {/* Total COGS / HPP */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-1">
          <span className="text-xs text-[#78716C] font-semibold">Total HPP Bahan Baku</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#78716C]">
            {formatRupiah(monthlyProfit.totalHpp)}
          </p>
          <span className="text-[11px] text-[#78716C] block">
            Food cost + kemasan eco bagasse
          </span>
        </div>

        {/* Gross Profit & Margin */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-1">
          <span className="text-xs text-[#78716C] font-semibold">Laba Kotor (Gross Margin)</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#D97706]">
            {formatRupiah(monthlyProfit.grossProfit)}
          </p>
          <span className="text-[11px] text-[#B45309] font-bold block">
            Margin Rata-rata: {monthlyProfit.grossMarginPct}%
          </span>
        </div>

        {/* Net Profit to Solo Baker */}
        <div className="p-5 rounded-3xl bg-[#FEF3C7] border border-[#FDE68A] shadow-card space-y-1 text-[#B45309]">
          <span className="text-xs font-semibold">Take-Home Pay Solo Baker</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold">
            {formatRupiah(monthlyProfit.netProfit)}
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
              Cukup <strong>41 Bento / bulan (~2 bento/hari)</strong> untuk menutup seluruh beban operasional tetap Rp 1.250.000.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold w-fit">
            <Award className="w-4 h-4" />
            <span>BEP Terlampaui ({bepPercent}%)</span>
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
            <span>BEP: 41 Bento (Tercapai)</span>
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
          <span className="text-xs text-[#78716C]">Data Tervalidasi PRD v3.2</span>
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
              {Object.values(FINANCIAL_MASTER).map((prod) => (
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
