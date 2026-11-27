'use client';

import React, { useEffect, useState } from 'react';
import {
  FileText,
  Calculator,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { calculateMovingAverageCost } from '@/lib/finance';
import { formatRupiah } from '@/lib/format';

interface MaterialOption {
  id: string;
  name: string;
  baseUnit: string;
  currentStock: number;
  movingAvgCost: number;
}

export default function ProcurementPage() {
  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [selectedMatId, setSelectedMatId] = useState<string>('');
  // Moving Average Simulation State
  const [currentQty, setCurrentQty] = useState<number>(3200);
  const [oldCost, setOldCost] = useState<number>(120);
  const [receivedQty, setReceivedQty] = useState<number>(200);
  const [vendorPrice, setVendorPrice] = useState<number>(120);
  const [freightCost, setFreightCost] = useState<number>(0);
  const [savingGrn, setSavingGrn] = useState(false);
  const [grnMessage, setGrnMessage] = useState<string>('');

  useEffect(() => {
    fetch('/api/admin/dashboard', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data?.rawMaterials) && data.rawMaterials.length > 0) {
          const mats = data.rawMaterials as MaterialOption[];
          setMaterials(mats);
          setSelectedMatId(mats[0].id);
          setCurrentQty(mats[0].currentStock);
          setOldCost(mats[0].movingAvgCost);
          setVendorPrice(mats[0].movingAvgCost);
        }
      })
      .catch(() => {});
  }, []);

  const selectedMat = materials.find((m) => m.id === selectedMatId);

  const handleSaveGrn = async () => {
    if (!selectedMat || receivedQty <= 0) return;
    setSavingGrn(true);
    setGrnMessage('');
    try {
      const totalPrice = Math.round(receivedQty * vendorPrice + freightCost);
      const res = await fetch('/api/admin/chat/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: {
            type: 'RESTOCK',
            materialId: selectedMat.id,
            materialName: selectedMat.name,
            baseUnit: selectedMat.baseUnit,
            packSize: receivedQty,
            packCount: 1,
            quantityAdded: receivedQty,
            totalPrice,
            unitCost: Math.round((totalPrice / receivedQty) * 100) / 100,
            corrections: [],
          },
        }),
      });
      if (res.ok) {
        setGrnMessage(`Stok ${selectedMat.name} (+${receivedQty}) tersimpan ke database!`);
        setCurrentQty((prev) => prev + receivedQty);
      }
    } finally {
      setSavingGrn(false);
    }
  };

  const newMovingAverage = calculateMovingAverageCost(
    currentQty,
    oldCost,
    receivedQty,
    vendorPrice,
    freightCost
  );

  const purchaseOrders: {
    id: string;
    supplier: string;
    orderDate: string;
    totalAmount: number;
    status: string;
    items: string;
  }[] = [];

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

        {materials.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
            <label className="text-xs font-semibold text-[#78716C]">
              Pilih Bahan Baku:
            </label>
            <select
              value={selectedMatId}
              onChange={(e) => {
                const mat = materials.find((m) => m.id === e.target.value);
                setSelectedMatId(e.target.value);
                if (mat) {
                  setCurrentQty(mat.currentStock);
                  setOldCost(mat.movingAvgCost);
                  setVendorPrice(mat.movingAvgCost);
                }
              }}
              className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] text-xs font-semibold text-[#1C1917]"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.currentStock} {m.baseUnit.toLowerCase()})
                </option>
              ))}
            </select>
          </div>
        )}

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

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="font-serif text-2xl font-bold">
              Rp {newMovingAverage.toFixed(2)} / unit
            </div>
            {selectedMat && (
              <button
                type="button"
                disabled={savingGrn || receivedQty <= 0}
                onClick={() => void handleSaveGrn()}
                className="px-4 py-2 rounded-xl bg-[#1C1917] hover:bg-[#D97706] text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {savingGrn ? 'Menyimpan...' : 'Simpan Penerimaan (GRN)'}
              </button>
            )}
          </div>
        </div>
        {grnMessage && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#15803D]">
            <CheckCircle2 className="w-4 h-4" />
            <span>{grnMessage}</span>
          </div>
        )}
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
          {purchaseOrders.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#E8E1D5] text-center text-xs text-[#78716C]">
              Belum ada Purchase Order.
            </div>
          ) : (
            purchaseOrders.map((po) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
