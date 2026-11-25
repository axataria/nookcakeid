import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  isAdminHost,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

const PUBLIC_BLOCKED_ADMIN_PREFIXES = [
  "/admin",
  "/kitchen",
  "/inventory",
  "/procurement",
  "/analytics",
  "/login",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const forwardedHost = req.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const host = forwardedHost || req.headers.get("host") || req.nextUrl.host;
  const adminDomain = isAdminHost(host);

  if (adminDomain) {
    // Allow auth endpoints without session gate
    if (
      pathname === "/api/admin/login" ||
      pathname === "/api/admin/logout" ||
      pathname === "/api/admin/me"
    ) {
      return NextResponse.next();
    }

    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminSessionToken(token);

    // Protect all other /api/admin/* routes
    if (pathname.startsWith("/api/admin")) {
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.next();
    }

    // Allow other /api/* if needed
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // Handle /login and /admin/login
    if (pathname === "/login" || pathname === "/admin/login") {
      if (session) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.rewrite(new URL("/admin/login", req.url));
    }

    // Require valid Owner session for all admin pages
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Rewrite clean subdomain paths to /admin/*
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/admin", req.url));
    }
    if (pathname.startsWith("/admin")) {
      return NextResponse.next();
    }
    return NextResponse.rewrite(new URL(`/admin${pathname}`, req.url));
  }

  // Public storefront domain: block direct access to admin routes & admin APIs
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (
    PUBLIC_BLOCKED_ADMIN_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|otf|woff2?|css|js|map)$).*)",
  ],
};
