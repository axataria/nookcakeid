import { NextRequest, NextResponse } from "next/server";
import {
  addEquityRecord,
  addOpexRecord,
  createQuickOrder,
  getFullStoreState,
  recordMaterialRestock,
  updateOrderStatus,
} from "@/lib/admin-store";
import type { ParsedAction } from "@/lib/smart-parser";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { action?: ParsedAction };
    const action = body.action;
    if (!action) {
      return NextResponse.json({ error: "Action wajib diisi." }, { status: 400 });
    }

    if (action.type === "ORDER") {
      const order = await createQuickOrder({
        customerName: action.customerName,
        slotDate: action.slotDate,
        items: action.items,
        notes: "Dicatat via Admin Quick Chat",
      });
      return NextResponse.json({ ok: true, type: "ORDER", data: order });
    }

    if (action.type === "RESTOCK") {
      const result = await recordMaterialRestock({
        materialId: action.materialId,
        materialName: action.materialName,
        baseUnit: action.baseUnit,
        quantityAdded: action.quantityAdded,
        totalPrice: action.totalPrice,
        notes: `${action.packSize}${action.baseUnit === "PIECE" ? "pcs" : action.baseUnit.toLowerCase()} × ${action.packCount}`,
      });
      return NextResponse.json({ ok: true, type: "RESTOCK", data: result });
    }

    if (action.type === "RESTOCK_BATCH") {
      const results = [];
      for (const item of action.items) {
        const res = await recordMaterialRestock({
          materialId: item.materialId,
          materialName: item.materialName,
          baseUnit: item.baseUnit,
          quantityAdded: item.quantityAdded,
          totalPrice: item.totalPrice,
          notes: `${item.packSize}${item.baseUnit === "PIECE" ? "pcs" : item.baseUnit.toLowerCase()} × ${item.packCount} (Batch)`,
        });
        results.push(res);
      }
      return NextResponse.json({ ok: true, type: "RESTOCK_BATCH", data: results });
    }

    if (action.type === "ORDER_STATUS") {
      const state = await getFullStoreState();
      const needle = action.target.toLowerCase().replace(/^#/, "");
      const matches = state.orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(needle) ||
          o.customerName.toLowerCase().includes(needle),
      );
      const matched =
        matches.find((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED") ||
        matches[0];
      if (!matched) {
        return NextResponse.json(
          { error: `Pesanan "${action.target}" tidak ditemukan.` },
          { status: 404 },
        );
      }
      const updated = await updateOrderStatus(matched.id, action.nextStatus);
      return NextResponse.json({ ok: true, type: "ORDER_STATUS", data: updated });
    }

    if (action.type === "OPEX") {
      const lowerName = action.name.toLowerCase();
      const category = /listrik|air|gas|wifi|internet|kuota/.test(lowerName)
        ? "UTILITIES"
        : /iklan|ads|promo|endorse|ig|tiktok/.test(lowerName)
        ? "MARKETING"
        : /sewa|kontrak|tempat/.test(lowerName)
        ? "RENT"
        : /gaji|karyawan|helper|upah/.test(lowerName)
        ? "LABOR"
        : /box|kemasan|sendok|plastik|pack/.test(lowerName)
        ? "PACKAGING_MISC"
        : "OTHER";
      const opex = await addOpexRecord({
        name: action.name,
        category,
        amount: action.amount,
        notes: "Dicatat via Admin Quick Chat",
      });
      return NextResponse.json({ ok: true, type: "OPEX", data: opex });
    }

    if (action.type === "EQUITY") {
      const equity = await addEquityRecord({
        name: action.name,
        category: "WORKING_CAPITAL",
        amount: action.amount,
        notes: "Dicatat via Admin Quick Chat",
      });
      return NextResponse.json({ ok: true, type: "EQUITY", data: equity });
    }

    return NextResponse.json(
      { error: "Tipe aksi tidak dapat disimpan." },
      { status: 400 },
    );
  } catch (err) {
    console.error("Execute quick chat error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan data ke database." },
      { status: 500 },
    );
  }
}
