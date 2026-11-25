import { NextResponse } from "next/server";
import { getDashboardSummary } from "@/lib/admin-store";

export async function GET() {
  try {
    const summary = await getDashboardSummary();
    return NextResponse.json(summary);
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json(
      { error: "Gagal memuat data dashboard." },
      { status: 500 },
    );
  }
}
