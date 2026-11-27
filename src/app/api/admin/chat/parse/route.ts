import { NextRequest, NextResponse } from "next/server";
import { parseQuickChatCommand } from "@/lib/smart-parser";
import { getDashboardSummary } from "@/lib/admin-store";
import { calculateMRPRequirements, calculateOvenBatches } from "@/lib/mrp-calculator";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { message?: string };
    const parsed = parseQuickChatCommand(body.message || "");

    if (parsed.type === "QUERY") {
      const summary = await getDashboardSummary();
      const upcomingOrders = summary.orders.filter(
        (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED",
      );

      const stockLedger: Record<string, number> = {};
      for (const m of summary.rawMaterials) {
        stockLedger[m.code] = m.currentStock;
      }
      const orderItems = upcomingOrders.flatMap((o) =>
        o.items.map((it) => ({ sku: it.sku, quantity: it.quantity })),
      );
      const ovenItems = orderItems.map((it) => ({
        variant: (it.sku.includes("WHOLE")
          ? "WHOLE"
          : it.sku.includes("SLICE")
          ? "SLICE"
          : "BENTO") as "BENTO" | "SLICE" | "WHOLE",
        quantity: it.quantity,
      }));
      const ovenBatches = calculateOvenBatches(ovenItems);
      const mrpRequirements = calculateMRPRequirements(orderItems, stockLedger).slice(0, 6);

      return NextResponse.json({
        parsed,
        queryResult: {
          kpis: summary.kpis,
          lowStockMaterials: summary.rawMaterials.filter(
            (m) => m.currentStock <= m.minimumBuffer,
          ),
          upcomingOrders,
          prepSummary: {
            ovenBatches,
            mrpRequirements,
          },
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
