import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: "nook & cake. — your sweetest little escape.",
  description:
    "Basque cheesecake dan brownies dari dapur kecil nook & cake. Pilih bento, slice, atau whole cake dan minta konfirmasi tanggal pesanan.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "nook & cake. — your sweetest little escape.",
    description: "Basque cheesecake dari dapur kecil. Dibuat sesuai pesanan.",
    type: "website",
    locale: "id_ID",
    images: [{ url: "/social.png", width: 1200, height: 630, alt: "nook & cake. — Basque cheesecake" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Manrope:wght@400;500;600;700&family=Nunito:wght@600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
