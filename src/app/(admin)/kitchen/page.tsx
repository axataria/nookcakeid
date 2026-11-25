'use client';

import React, { useState } from 'react';
import {
  ChefHat,
  Clock,
  Flame,
  CheckSquare,
  Square,
  AlertTriangle,
  Sparkles,
  Calendar,
  Utensils,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { calculateOvenBatches } from '@/lib/mrp-calculator';

export default function KitchenPage() {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    step1: true,
    step2: true,
    step3: true,
    step4: false,
    step5: false,
    step6: false,
  });

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Sample orders aggregated for Tomorrow's Slot (24 Nov 2026)
  const tomorrowOrders = [
    { variant: 'BENTO', quantity: 12 },
    { variant: 'SLICE', quantity: 10 },
    { variant: 'WHOLE', quantity: 1 },
  ];

  const batchSummary = calculateOvenBatches(tomorrowOrders);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E1D5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-semibold">
              Jadwal Panggangan Besok
            </span>
            <span className="text-xs text-[#78716C]">
              Slot: <strong>Selasa, 24 November 2026</strong>
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
            Kitchen Oven Schedule &amp; Prep
          </h1>
        </div>

        {/* 16:00 Cut-off Banner */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#E8E1D5] shadow-subtle">
          <Clock className="w-5 h-5 text-[#D97706]" />
          <div>
            <span className="text-[11px] font-semibold text-[#78716C] block">
              Cut-off Pre-Order Harian:
            </span>
            <span className="text-xs font-bold text-[#1C1917]">
              16:00 WIB (Kunci Otomatis)
            </span>
          </div>
        </div>
      </div>

      {/* Batch Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-1">
          <span className="text-xs text-[#78716C] font-semibold">Target Produksi Bento</span>
          <p className="font-serif text-3xl font-bold text-[#1C1917]">
            {batchSummary.totalBento}{' '}
            <span className="text-xs text-[#78716C] font-sans font-normal">pcs</span>
          </p>
          <span className="text-[11px] text-[#15803D] font-medium block">
            Optimal Solo Baker (Max 16)
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-1">
          <span className="text-xs text-[#78716C] font-semibold">Target Slice Cake</span>
          <p className="font-serif text-3xl font-bold text-[#1C1917]">
            {batchSummary.totalSlice}{' '}
            <span className="text-xs text-[#78716C] font-sans font-normal">slice</span>
          </p>
          <span className="text-[11px] text-[#78716C] block">Setara 2 Loyang Besar</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-1">
          <span className="text-xs text-[#78716C] font-semibold">Celebration Whole</span>
          <p className="font-serif text-3xl font-bold text-[#1C1917]">
            {batchSummary.totalWhole}{' '}
            <span className="text-xs text-[#78716C] font-sans font-normal">loyang</span>
          </p>
          <span className="text-[11px] text-[#B45309] block">Dus Kraft + Pita Linen</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#FEF3C7] border border-[#FDE68A] shadow-card space-y-1 text-[#B45309]">
          <span className="text-xs font-semibold">Estimasi Putaran Oven</span>
          <p className="font-serif text-3xl font-bold">
            {batchSummary.recommendedOvenBatches}{' '}
            <span className="text-xs font-sans font-normal">Batch</span>
          </p>
          <span className="text-[11px] block">
            Kapasitas oven deck: 4 loyang / bake
          </span>
        </div>
      </div>

      {/* Oven Batching Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#D97706]" />
            <h2 className="font-serif text-xl font-bold text-[#1C1917]">
              Rencana Panggangan Subuh (Subuh Bake Plan)
            </h2>
          </div>
          <span className="text-xs text-[#78716C]">Suhu Oven: 240°C Deck</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
              <span>Batch 1 (05:00 - 05:35)</span>
              <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10px]">
                Ready
              </span>
            </div>
            <p className="text-xs text-[#78716C]">
              4 Loyang Besar (8 Bento Cake) · Waktu panggangan 32 menit untuk crust caramelized gelap.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
              <span>Batch 2 (05:45 - 06:20)</span>
              <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-[10px]">
                Antrean
              </span>
            </div>
            <p className="text-xs text-[#78716C]">
              2 Loyang (4 Bento) + 2 Loyang (10 Slice Cake).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
              <span>Batch 3 (06:30 - 07:10)</span>
              <span className="px-2 py-0.5 rounded-full bg-[#F3EFEA] text-[#78716C] text-[10px]">
                Antrean
              </span>
            </div>
            <p className="text-xs text-[#78716C]">
              1 Celebration Whole Basque (16 cm) · Api bawah 210°C, api atas 245°C.
            </p>
          </div>
        </div>
      </div>

      {/* Digital Baker Prep Checklist */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#15803D]" />
            <h2 className="font-serif text-xl font-bold text-[#1C1917]">
              Daftar Periksa Persiapan Dapur (Baker Checklist)
            </h2>
          </div>
          <span className="text-xs text-[#78716C]">
            Langkah Tercentang:{' '}
            <strong>
              {Object.values(checklist).filter(Boolean).length} / 6
            </strong>
          </span>
        </div>

        <div className="space-y-3">
          {[
            {
              id: 'step1',
              title: 'Timbang Bahan Mentah (Calf Cheese, Anchor Cream, Telur)',
              desc: 'Sesuai kalkulasi MRP di halaman Inventory & MRP.',
            },
            {
              id: 'step2',
              title: 'Alasi Loyang dengan Kertas Roti Crinkled Kraft',
              desc: 'Bentuk kerutan kertas roti khas San Sebastián.',
            },
            {
              id: 'step3',
              title: 'Pre-heat Oven Deck ke 240°C (30 Menit Sebelum Panggang)',
              desc: 'Pastikan temperatur stabil sebelum adonan masuk.',
            },
            {
              id: 'step4',
              title: 'Eksekusi Panggangan Batch 1 & 2',
              desc: 'Pantau warna mahogany crust; jangan overbake agar bagian tengah tetap molten.',
            },
            {
              id: 'step5',
              title: 'Proses Resting & Chilling (Minimal 2 Jam di Chiller)',
              desc: 'Resting suhu ruang 45 menit, lalu dinginkan di chiller pada suhu 4°C.',
            },
            {
              id: 'step6',
              title: 'Packaging Bagasse Box, Pita Linen, & Stiker Segel',
              desc: 'Sertakan sendok kayu dan Care Card sebelum kurir tiba.',
            },
          ].map((item) => {
            const isChecked = checklist[item.id];
            return (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`flex items-start gap-4 p-4 rounded-2xl border text-left w-full transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-[#FAF8F5] border-[#E8E1D5] opacity-80'
                    : 'bg-white border-[#E8E1D5] hover:border-[#D97706]/40'
                }`}
              >
                <div className="pt-0.5 text-[#D97706]">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-[#15803D]" />
                  ) : (
                    <Square className="w-5 h-5 text-[#78716C]" />
                  )}
                </div>
                <div>
                  <h3
                    className={`text-sm font-bold ${
                      isChecked ? 'line-through text-[#78716C]' : 'text-[#1C1917]'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#78716C] mt-0.5">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
