import { NextRequest, NextResponse } from "next/server";
import {
  addEquityRecord,
  addOpexRecord,
  type EquityRecord,
  type OpexRecord,
} from "@/lib/admin-store";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      kind: "EQUITY" | "OPEX";
      name: string;
      category: string;
      amount: number;
      notes?: string;
    };

    if (!body.name?.trim() || !body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: "Nama dan nominal (> 0) wajib diisi." },
        { status: 400 },
      );
    }

    if (body.kind === "EQUITY") {
      const record = await addEquityRecord({
        name: body.name.trim(),
        category: (body.category as EquityRecord["category"]) || "OTHER",
        amount: Math.round(body.amount),
        notes: body.notes,
      });
      return NextResponse.json({ ok: true, record });
    }

    const record = await addOpexRecord({
      name: body.name.trim(),
      category: (body.category as OpexRecord["category"]) || "OTHER",
      amount: Math.round(body.amount),
      notes: body.notes,
    });
    return NextResponse.json({ ok: true, record });
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan catatan keuangan." },
      { status: 500 },
    );
  }
}
