import Link from "next/link";

export default function Page() {
  return (
    <main className="wrap legal">
      <Link href="/">← Kembali ke menu</Link>
      <h1>Privasi</h1>
      <p>
        Keranjang disimpan di browser perangkat ini. Tombol salin membuat
        ringkasan pada clipboard; situs tidak otomatis mengirim pesanan atau
        data pribadi. Jika kamu mengirim pesan melalui Instagram, data dalam
        pesan tersebut mengikuti kebijakan layanan Instagram. Hapus item dari
        keranjang untuk menghapus pilihan yang tersimpan.
      </p>
      <a href="https://www.instagram.com/nookcakeid/">
        Hubungi nook & cake.
      </a>
    </main>
  );
}
