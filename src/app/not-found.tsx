import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="wrap legal">
      <p>404 / nook & cake.</p>
      <h1>Halaman ini belum ada di menu</h1>
      <Button asChild>
        <Link href="/">Kembali ke beranda</Link>
      </Button>
    </main>
  );
}
