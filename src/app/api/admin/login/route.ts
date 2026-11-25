import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getOwnerCredentials,
} from "@/lib/admin-auth";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi." },
        { status: 400 },
      );
    }

    const owner = getOwnerCredentials();
    const emailMatch = safeEqual(email, owner.email);
    const passwordMatch = safeEqual(password, owner.password);

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json(
        { error: "Email atau password Owner tidak sesuai." },
        { status: 401 },
      );
    }

    const token = await createAdminSessionToken(owner.email);
    const res = NextResponse.json({
      ok: true,
      user: { email: owner.email, role: "OWNER" },
    });

    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Permintaan login tidak valid." },
      { status: 400 },
    );
  }
}
