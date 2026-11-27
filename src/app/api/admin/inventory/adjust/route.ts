import { NextRequest, NextResponse } from "next/server";
import { adjustMaterialStock } from "@/lib/admin-store";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      materialId?: string;
      quantityChange?: number;
      notes?: string;
    };
    if (!body.materialId || typeof body.quantityChange !== "number" || body.quantityChange === 0) {
      return NextResponse.json(
        { error: "materialId dan quantityChange (!= 0) wajib diisi." },
        { status: 400 },
      );
    }

    const updated = await adjustMaterialStock({
      materialId: body.materialId,
      quantityChange: body.quantityChange,
      notes: body.notes,
    });
    if (!updated) {
      return NextResponse.json({ error: "Bahan baku tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, material: updated });
  } catch {
    return NextResponse.json(
      { error: "Gagal menyesuaikan stok bahan baku." },
      { status: 500 },
    );
  }
}
