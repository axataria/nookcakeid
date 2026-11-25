'use client';

import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  ArrowDownRight,
  ArrowUpRight,
  History,
  FileSpreadsheet,
} from 'lucide-react';
import { calculateMRPRequirements } from '@/lib/mrp-calculator';

export default function InventoryPage() {
  // Current stock ledger values
  const [stockLedger, setStockLedger] = useState<Record<string, number>>({
    'RAW-KEJU-CALF': 3200, // 3.2 kg
    'RAW-CREAM-ANCHOR': 1800, // 1.8 kg
    'RAW-TELUR': 24, // 24 butir
    'RAW-PONDAN': 2500, // 2.5 kg
    'RAW-BUTTER': 1200, // 1.2 kg
    'RAW-GULA': 2000, // 2.0 kg
    'PKG-BOX-BAGASSE': 45,
    'PKG-SENDOK-KAYU': 60,
    'PKG-MIKA-TRIANGLE': 30,
    'PKG-CARE-CARD': 80,
    'PKG-SEAL-STICKER': 90,
  });

  // Tomorrow's aggregated demand
  const tomorrowOrders = [
    { sku: 'CAKE-BENTO-10X7', quantity: 12 },
    { sku: 'CAKE-SLICE-CLASSIC', quantity: 10 },
    { sku: 'CAKE-WHOLE-16CM', quantity: 1 },
  ];

  const mrpList = calculateMRPRequirements(tomorrowOrders, stockLedger);

  // Sample stock ledger transactions
  const transactions = [
    {
      id: 'tx-001',
      date: '23 Nov 2026, 16:00',
      type: 'ORDER_DEDUCTION',
      material: 'Keju Calf Cream Cheese',
      change: -2350,
      unit: 'gram',
      balance: 3200,
      ref: 'Batch Slot 24 Nov',
    },
    {
      id: 'tx-002',
      date: '23 Nov 2026, 16:00',
      type: 'ORDER_DEDUCTION',
      material: 'Anchor Whipping Cream',
      change: -1300,
      unit: 'gram',
      balance: 1800,
      ref: 'Batch Slot 24 Nov',
    },
    {
      id: 'tx-003',
      date: '22 Nov 2026, 11:30',
      type: 'GOODS_RECEIPT',
      material: 'Keju Calf Cream Cheese',
      change: +5000,
      unit: 'gram',
      balance: 5550,
      ref: 'PO-202611-04 (CV Prima)',
    },
    {
      id: 'tx-004',
      date: '22 Nov 2026, 11:30',
      type: 'GOODS_RECEIPT',
      material: 'Bagasse Eco Box Bento',
      change: +50,
      unit: 'pcs',
      balance: 65,
      ref: 'PO-202611-05 (EcoPack)',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E1D5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-xs font-semibold">
              BOM Engine
            </span>
            <span className="text-xs text-[#78716C]">
              Material Requirements Planning (MRP)
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
            Raw Materials &amp; Stock Ledger
          </h1>
        </div>
      </div>

      {/* MRP Requirements Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-[#1C1917]">
              Kebutuhan Bahan Mentah (Batch 24 Nov)
            </h2>
            <p className="text-xs text-[#78716C]">
              Dihitung otomatis dari total 12 Bento, 10 Slice, dan 1 Whole Cake.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-semibold">
            Status Stok: Semua Bahan Aman
          </span>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E1D5] text-[#78716C]">
                <th className="pb-3 font-semibold">Kode &amp; Nama Bahan</th>
                <th className="pb-3 font-semibold text-right">Kebutuhan Besok</th>
                <th className="pb-3 font-semibold text-right">Stok di Chiller</th>
                <th className="pb-3 font-semibold text-right">Sisa Setelah Bake</th>
                <th className="pb-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E1D5]">
              {mrpList.map((item) => {
                const balanceAfter = item.currentStock - item.totalQuantity;
                const isSafe = balanceAfter >= 0;

                return (
                  <tr key={item.materialCode} className="hover:bg-[#FAF8F5]">
                    <td className="py-3">
                      <span className="font-bold text-[#1C1917] block">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-[#78716C] font-mono">
                        {item.materialCode}
                      </span>
                    </td>
                    <td className="py-3 text-right font-serif font-bold text-[#1C1917]">
                      {item.totalQuantity.toLocaleString('id-ID')}{' '}
                      <span className="font-sans text-[10px] text-[#78716C] font-normal">
                        {item.unit.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right font-serif text-[#78716C]">
                      {item.currentStock.toLocaleString('id-ID')}{' '}
                      <span className="font-sans text-[10px] font-normal">
                        {item.unit.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right font-serif font-bold text-[#B45309]">
                      {balanceAfter.toLocaleString('id-ID')}{' '}
                      <span className="font-sans text-[10px] text-[#78716C] font-normal">
                        {item.unit.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      {isSafe ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Cukup</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-[10px] font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Kurang</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Ledger History */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#D97706]" />
          <h2 className="font-serif text-xl font-bold text-[#1C1917]">
            Audit Trail Stock Ledger (Mutasi Terkini)
          </h2>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    tx.change > 0
                      ? 'bg-[#DCFCE7] text-[#15803D]'
                      : 'bg-[#FEF3C7] text-[#B45309]'
                  }`}
                >
                  {tx.change > 0 ? (
                    <ArrowDownRight className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-[#1C1917] block">
                    {tx.material}
                  </span>
                  <span className="text-[11px] text-[#78716C]">
                    {tx.ref} · {tx.date}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-serif font-bold text-sm block ${
                    tx.change > 0 ? 'text-[#15803D]' : 'text-[#B45309]'
                  }`}
                >
                  {tx.change > 0 ? `+${tx.change}` : tx.change} {tx.unit}
                </span>
                <span className="text-[10px] text-[#78716C]">
                  Sisa: {tx.balance} {tx.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
