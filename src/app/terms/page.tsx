import Link from "next/link";

export default function Page() {
  return (
    <main className="wrap legal">
      <Link href="/">← Kembali ke menu</Link>
      <h1>Ketentuan pemesanan</h1>
      <p>
        Menu dan harga di situs adalah penawaran yang perlu dikonfirmasi oleh
        baker. Memilih tanggal atau menambahkan produk ke keranjang tidak
        memesan kapasitas. Konfirmasikan ketersediaan, rincian bahan,
        pengiriman, total biaya, serta ketentuan perubahan dan pembatalan
        melalui Instagram sebelum membayar. Situs ini belum menerima pembayaran
        online.
      </p>
      <a href="https://www.instagram.com/nookcakeid/">
        Hubungi nook & cake.
      </a>
    </main>
  );
}
