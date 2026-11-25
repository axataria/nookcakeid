import { NextRequest, NextResponse } from "next/server";
import {
  addEquityRecord,
  addOpexRecord,
  createQuickOrder,
  recordMaterialRestock,
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

    if (action.type === "OPEX") {
      const opex = await addOpexRecord({
        name: action.name,
        category: "OTHER",
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
