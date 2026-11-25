import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, type OrderStatus } from "@/lib/admin-store";

const ALLOWED_STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED_SLOT",
  "BAKING",
  "READY_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = (await req.json()) as { status?: OrderStatus };
    if (!body.status || !ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: "Status pesanan tidak valid." },
        { status: 400 },
      );
    }

    const updated = await updateOrderStatus(id, body.status);
    if (!updated) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, order: updated });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui status pesanan." },
      { status: 500 },
    );
  }
}
