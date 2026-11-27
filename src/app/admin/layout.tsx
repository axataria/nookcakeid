import type { Metadata, Viewport } from "next";
import { AdminPwaProvider } from "@/components/admin/AdminPwaProvider";

export const metadata: Metadata = {
  title: "nook & cake. Admin",
  description:
    "Solo Baker Kitchen & Operations — Order, kitchen prep, stok MRP, dan profit owner nook & cake.",
  manifest: "/admin-manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "nook admin",
  },
  icons: {
    icon: [
      { url: "/icons/admin-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/admin-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/admin-apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0E5B44",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminPwaProvider>{children}</AdminPwaProvider>;
}
