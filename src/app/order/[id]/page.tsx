import Link from "next/link";

export default function OrderTrackingPage() {
  return (
    <main className="wrap legal">
      <Link href="/">← Kembali ke menu</Link>
      <h1>Konfirmasi pesanan melalui baker</h1>
      <p>
        Pelacakan pesanan online belum tersedia. Halaman ini tidak mengonfirmasi
        pembayaran atau reservasi slot. Jika sudah menghubungi kami, tanyakan
        status pesanan melalui percakapan Instagram yang sama.
      </p>
      <a
        className="button primary"
        href="https://www.instagram.com/nookcakeid/"
        target="_blank"
        rel="noreferrer"
      >
        Buka Instagram ↗
      </a>
    </main>
  );
}
