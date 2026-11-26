import { NextResponse } from "next/server";
import { getDashboardSummary } from "@/lib/admin-store";

export async function GET() {
  try {
    const summary = await getDashboardSummary();
    return NextResponse.json(summary);
  } catch (err) {
    console.error("Dashboard API error:", err);
    const errObj = err as { code?: string; message?: string };
    return NextResponse.json(
      {
        error: "Gagal memuat data dashboard.",
        code: errObj?.code || "UNKNOWN",
        details: errObj?.message || String(err),
      },
      { status: 500 },
    );
  }
}
