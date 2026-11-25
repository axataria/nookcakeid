import { NextRequest, NextResponse } from "next/server";
import { parseQuickChatCommand } from "@/lib/smart-parser";
import { getDashboardSummary } from "@/lib/admin-store";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { message?: string };
    const parsed = parseQuickChatCommand(body.message || "");

    if (parsed.type === "QUERY") {
      const summary = await getDashboardSummary();
      return NextResponse.json({
        parsed,
        queryResult: {
          kpis: summary.kpis,
          lowStockMaterials: summary.rawMaterials.filter(
            (m) => m.currentStock <= m.minimumBuffer,
          ),
          upcomingOrders: summary.orders.filter(
            (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED",
          ),
        },
      });
    }

    return NextResponse.json({ parsed });
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses pesan chat." },
      { status: 400 },
    );
  }
}
