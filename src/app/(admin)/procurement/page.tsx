'use client';

import React, { useState } from 'react';
import {
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  Calculator,
  ArrowRight,
  Plus,
  Building2,
} from 'lucide-react';
import { calculateMovingAverageCost } from '@/lib/finance';
import { formatRupiah } from '@/lib/format';

export default function ProcurementPage() {
  // Moving Average Simulation State
  const [currentQty, setCurrentQty] = useState<number>(3200); // 3200 grams
  const [oldCost, setOldCost] = useState<number>(121.65); // Rp 121.65 / gram
  const [receivedQty, setReceivedQty] = useState<number>(5000); // 5000 grams
  const [vendorPrice, setVendorPrice] = useState<number>(118.0); // Rp 118.00 / gram
  const [freightCost, setFreightCost] = useState<number>(25000); // Rp 25.000

  const newMovingAverage = calculateMovingAverageCost(
    currentQty,
    oldCost,
    receivedQty,
    vendorPrice,
    freightCost
  );

  const purchaseOrders = [
    {
      id: 'PO-202611-04',
      supplier: 'CV Prima Dairy (Keju Calf & Anchor)',
      orderDate: '22 Nov 2026',
      totalAmount: 950000,
      status: 'FULLY_RECEIVED',
      items: '5kg Keju Calf, 3kg Anchor Cream',
    },
    {
      id: 'PO-202611-05',
      supplier: 'EcoPack Indonesia (Bagasse Bento Box)',
      orderDate: '23 Nov 2026',
      totalAmount: 264000,
      status: 'SUBMITTED',
      items: '100 pcs Bagasse Box 10x7, 100 Sendok Kayu',
    },
    {
      id: 'PO-202611-06',
      supplier: 'Kyoto Tea Co. (Uji Matcha Powder)',
      orderDate: '23 Nov 2026',
      totalAmount: 380000,
      status: 'DRAFT',
      items: '500g Ceremonial Grade Uji Matcha',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E1D5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-xs font-semibold">
              Procurement ERP
            </span>
            <span className="text-xs text-[#78716C]">
              Supplier &amp; Open Purchase Orders
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
            Open PO &amp; Moving Average HPP
          </h1>
        </div>
      </div>

      {/* Moving Average Cost Calculator (GRN Simulator) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[#D97706]" />
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1C1917]">
              Kalkulator Moving Average HPP (Saat Penerimaan Barang GRN)
            </h2>
            <p className="text-xs text-[#78716C]">
              Formula moving average otomatis mencegah distorsi laba akibat fluktuasi harga bahan baku.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#78716C]">
              Stok Berjalan (Gram)
            </label>
            <input
              type="number"
              value={currentQty}
              onChange={(e) => setCurrentQty(Number(e.target.value))}
              className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] font-serif font-bold text-[#1C1917]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#78716C]">
              HPP Lama per Gram (Rp)
            </label>
            <input
              type="number"
              step="0.01"
              value={oldCost}
              onChange={(e) => setOldCost(Number(e.target.value))}
              className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] font-serif font-bold text-[#1C1917]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#78716C]">
              Qty Diterima (Gram)
            </label>
            <input
              type="number"
              value={receivedQty}
              onChange={(e) => setReceivedQty(Number(e.target.value))}
              className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] font-serif font-bold text-[#1C1917]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#78716C]">
              Harga Vendor / Gram (Rp)
            </label>
            <input
              type="number"
              step="0.01"
              value={vendorPrice}
              onChange={(e) => setVendorPrice(Number(e.target.value))}
              className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] font-serif font-bold text-[#1C1917]"
            />
          </div>
        </div>

        {/* Calculated Result Banner */}
        <div className="p-4 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#B45309]">
          <div className="space-y-0.5">
            <span className="font-bold block">
              Nilai HPP Moving Average Baru per Gram:
            </span>
            <span>
              Total Nilai Stok: {formatRupiah((currentQty + receivedQty) * newMovingAverage)} ({currentQty + receivedQty} gram)
            </span>
          </div>

          <div className="font-serif text-2xl font-bold">
            Rp {newMovingAverage.toFixed(2)} / gram
          </div>
        </div>
      </div>

      {/* Open Purchase Orders Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D97706]" />
            <h2 className="font-serif text-xl font-bold text-[#1C1917]">
              Daftar Purchase Order (Open PO Supplier)
            </h2>
          </div>

          <button className="px-3.5 py-2 rounded-xl bg-[#1C1917] hover:bg-[#D97706] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Buat PO Baru</span>
          </button>
        </div>

        <div className="space-y-3">
          {purchaseOrders.map((po) => (
            <div
              key={po.id}
              className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#1C1917]">
                    {po.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      po.status === 'FULLY_RECEIVED'
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : po.status === 'SUBMITTED'
                        ? 'bg-[#FEF3C7] text-[#B45309]'
                        : 'bg-[#F3EFEA] text-[#78716C]'
                    }`}
                  >
                    {po.status}
                  </span>
                </div>
                <h3 className="font-serif text-sm font-bold text-[#1C1917]">
                  {po.supplier}
                </h3>
                <p className="text-xs text-[#78716C]">{po.items}</p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                <span className="font-serif font-bold text-sm text-[#1C1917]">
                  {formatRupiah(po.totalAmount)}
                </span>
                <span className="text-[10px] text-[#78716C]">{po.orderDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
