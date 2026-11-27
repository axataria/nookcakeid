'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  History,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { calculateMRPRequirements } from '@/lib/mrp-calculator';

interface RawMaterialItem {
  id: string;
  code: string;
  name: string;
  baseUnit: string;
  currentStock: number;
  minimumBuffer: number;
  movingAvgCost: number;
}

interface StockLedgerItem {
  id: string;
  rawMaterialId: string;
  materialName: string;
  transactionType: string;
  quantityChange: number;
  balanceAfter: number;
  notes?: string;
  createdAt: string;
}

interface DashboardOrder {
  id: string;
  status: string;
  items: { sku: string; quantity: number }[];
}

const CODE_TO_BOM_MAP: Record<string, string> = {
  'RM-CALF': 'RAW-KEJU-CALF',
  'RM-FIBERCREME': 'RAW-FIBERCREME',
  'RM-ANCHOR': 'RAW-CREAM-ANCHOR',
  'RM-EGG': 'RAW-TELUR',
  'RM-PONDAN': 'RAW-PONDAN',
  'RM-GULA': 'RAW-GULA',
  'RM-MAIZENA': 'RAW-MAIZENA',
  'RM-VANILLA': 'RAW-VANILLA',
  'RM-GARAM': 'RAW-GARAM',
  'RM-MATCHA': 'RAW-ZENLATTE-MATCHA',
  'RM-CHOCOLATOS': 'RAW-CHOCOLATOS',
  'PK-BENTO': 'PKG-BOX-BAGASSE',
  'PK-SENDOK': 'PKG-SENDOK-KAYU',
};

export default function InventoryPage() {
  const [rawMaterials, setRawMaterials] = useState<RawMaterialItem[]>([]);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [stockLedgerList, setStockLedgerList] = useState<StockLedgerItem[]>([]);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustQty, setAdjustQty] = useState<string>('');
  const [adjustNotes, setAdjustNotes] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dashboard', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.rawMaterials)) setRawMaterials(data.rawMaterials);
      if (Array.isArray(data.orders)) setOrders(data.orders);
      if (Array.isArray(data.stockLedger)) setStockLedgerList(data.stockLedger);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleAdjust = async (materialId: string, sign: 1 | -1) => {
    const qty = Number(adjustQty);
    if (!qty || qty <= 0) return;
    setAdjustingId(materialId);
    try {
      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId,
          quantityChange: sign * qty,
          notes: adjustNotes.trim() || (sign < 0 ? 'Waste / Susut' : 'Penyesuaian Tambah'),
        }),
      });
      if (res.ok) {
        setAdjustQty('');
        setAdjustNotes('');
        setAdjustingId(null);
        await loadData();
      }
    } finally {
      setAdjustingId(null);
    }
  };

  const stockLedger: Record<string, number> = {};
  for (const mat of rawMaterials) {
    stockLedger[mat.code] = mat.currentStock;
    const bomCode = CODE_TO_BOM_MAP[mat.code];
    if (bomCode) {
      stockLedger[bomCode] = mat.currentStock;
    }
  }

  const activeOrders = orders.filter(
    (o) => o.status !== 'CANCELLED' && o.status !== 'DELIVERED'
  );
  const aggregatedItems = activeOrders.flatMap((o) =>
    o.items.map((it) => ({ sku: it.sku, quantity: it.quantity }))
  );

  const mrpList = calculateMRPRequirements(aggregatedItems, stockLedger);
  const hasShortage = mrpList.some((item) => item.currentStock < item.totalQuantity);

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
              Kebutuhan Bahan Mentah (Pesanan Aktif)
            </h2>
            <p className="text-xs text-[#78716C]">
              Dihitung otomatis dari {activeOrders.length} pesanan aktif ({aggregatedItems.reduce((s, i) => s + i.quantity, 0)} item).
            </p>
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              hasShortage
                ? 'bg-[#FEE2E2] text-[#B91C1C]'
                : 'bg-[#DCFCE7] text-[#15803D]'
            }`}
          >
            {hasShortage ? 'Status Stok: Ada Bahan Kurang' : 'Status Stok: Semua Bahan Aman'}
          </span>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          {mrpList.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#E8E1D5] text-center text-xs text-[#78716C]">
              Belum ada pesanan aktif untuk dihitung kebutuhan bahannya.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E1D5] text-[#78716C]">
                  <th className="pb-3 font-semibold">Kode &amp; Nama Bahan</th>
                  <th className="pb-3 font-semibold text-right">Kebutuhan</th>
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
          )}
        </div>
      </div>

      {/* Live Raw Materials Stock */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E1D5] shadow-card space-y-6">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-[#D97706]" />
          <h2 className="font-serif text-xl font-bold text-[#1C1917]">
            Stok Bahan Baku Saat Ini
          </h2>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          {rawMaterials.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#E8E1D5] text-center text-xs text-[#78716C]">
              Belum ada data bahan baku.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E1D5] text-[#78716C]">
                  <th className="pb-3 font-semibold">Kode &amp; Nama Bahan</th>
                  <th className="pb-3 font-semibold text-right">Stok Tersedia</th>
                  <th className="pb-3 font-semibold text-right">Buffer Minimum</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                  <th className="pb-3 font-semibold text-right">Sesuaikan Stok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D5]">
                {rawMaterials.map((mat) => {
                  const isLow = mat.currentStock <= mat.minimumBuffer;
                  const isEditing = adjustingId === mat.id;
                  return (
                    <tr key={mat.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-3">
                        <span className="font-bold text-[#1C1917] block">{mat.name}</span>
                        <span className="text-[10px] text-[#78716C] font-mono">{mat.code}</span>
                      </td>
                      <td className="py-3 text-right font-serif font-bold text-[#1C1917]">
                        {mat.currentStock.toLocaleString('id-ID')}{' '}
                        <span className="font-sans text-[10px] text-[#78716C] font-normal">
                          {mat.baseUnit.toLowerCase()}
                        </span>
                      </td>
                      <td className="py-3 text-right font-serif text-[#78716C]">
                        {mat.minimumBuffer.toLocaleString('id-ID')}{' '}
                        <span className="font-sans text-[10px] font-normal">
                          {mat.baseUnit.toLowerCase()}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-[10px] font-semibold">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low Stock</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10px] font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Aman</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-1">
                            <input
                              type="number"
                              placeholder="Qty"
                              value={adjustQty}
                              onChange={(e) => setAdjustQty(e.target.value)}
                              className="w-16 px-2 py-1 rounded-lg border border-[#E8E1D5] text-[11px] font-mono"
                            />
                            <input
                              type="text"
                              placeholder="Catatan"
                              value={adjustNotes}
                              onChange={(e) => setAdjustNotes(e.target.value)}
                              className="w-24 px-2 py-1 rounded-lg border border-[#E8E1D5] text-[11px] font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => void handleAdjust(mat.id, 1)}
                              className="px-2 py-1 rounded-lg bg-[#15803D] text-white text-[10px] font-bold"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleAdjust(mat.id, -1)}
                              className="px-2 py-1 rounded-lg bg-[#B91C1C] text-white text-[10px] font-bold"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => setAdjustingId(null)}
                              className="px-1.5 py-1 text-[10px] text-[#78716C]"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setAdjustingId(mat.id);
                              setAdjustQty('');
                              setAdjustNotes('');
                            }}
                            className="px-2.5 py-1 rounded-lg border border-[#E8E1D5] hover:bg-[#FAF8F5] text-[11px] font-semibold text-[#1C1917]"
                          >
                            Sesuaikan
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
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

        {stockLedgerList.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#E8E1D5] text-center text-xs text-[#78716C]">
            Belum ada mutasi stok tercatat.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {stockLedgerList.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      tx.quantityChange > 0
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : 'bg-[#FEF3C7] text-[#B45309]'
                    }`}
                  >
                    {tx.quantityChange > 0 ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-[#1C1917] block">
                      {tx.materialName}
                    </span>
                    <span className="text-[11px] text-[#78716C]">
                      {tx.notes || tx.transactionType} ·{' '}
                      {new Date(tx.createdAt).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-serif font-bold text-sm block ${
                      tx.quantityChange > 0 ? 'text-[#15803D]' : 'text-[#B45309]'
                    }`}
                  >
                    {tx.quantityChange > 0 ? `+${tx.quantityChange}` : tx.quantityChange}
                  </span>
                  <span className="text-[10px] text-[#78716C]">
                    Sisa: {tx.balanceAfter}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
