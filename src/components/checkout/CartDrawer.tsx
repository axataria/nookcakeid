"use client";
import { useState } from "react";
import { Drawer } from "vaul";
import { useCartStore } from "@/store/useCartStore";
import { formatRupiah } from "@/lib/format";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";

export function CartDrawer() {
  const s = useCartStore();
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  const getOrderSummaryText = () => {
    return [
      "Halo nook & cake! 🍰 Saya ingin memesan:",
      "",
      ...s.items.map(
        (i, idx) =>
          `${idx + 1}. ${i.name} (×${i.quantity}) - ${formatRupiah(i.unitPrice * i.quantity)}${
            i.selectedAddons.length
              ? "\n   + Saus: " + i.selectedAddons.map((a) => a.name).join(", ")
              : ""
          }${i.customNote ? "\n   + Ucapan: " + i.customNote : ""}`
      ),
      "",
      `Total Produk: ${formatRupiah(s.getSubtotal())}`,
      "",
      "Mohon konfirmasi ketersediaan, ongkir, dan metode pembayaran. Terima kasih!"
    ].join("\n");
  };

  const openWhatsApp = () => {
    const text = getOrderSummaryText();
    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  async function copy() {
    const text = getOrderSummaryText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setNotice(
        "Ringkasan berhasil disalin! Kamu bisa langsung mengirimkannya via WhatsApp atau Instagram.",
      );
    } catch {
      setNotice(
        "Ringkasan belum dapat disalin otomatis. Kamu bisa klik tombol 'Pesan via WhatsApp' langsung.",
      );
    }
  }

  return (
    <Drawer.Root
      open={s.isCartDrawerOpen}
      onOpenChange={(open) => {
        s.setIsCartDrawerOpen(open);
        setNotice("");
        setCopied(false);
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="drawer-overlay" />
        <Drawer.Content className="drawer-content">
          <div className="drawer-handle" aria-hidden="true" />
          <div className="drawer-header">
            <Drawer.Title>Keranjang pesanan</Drawer.Title>
            <Drawer.Close aria-label="Tutup keranjang">×</Drawer.Close>
          </div>
          <Drawer.Description className="drawer-description">
            Pilihan kue segar dari dapur kami. Konfirmasi langsung ke baker untuk jadwal pengiriman atau pengambilan.
          </Drawer.Description>
          <div className="drawer-body">
            {!s.items.length ? (
              <div className="empty">
                <h3>Masih ada ruang untuk yang manis</h3>
                <p>Pilih Basque cheesecake favoritmu dari menu.</p>
                <Drawer.Close className="button primary">
                  Kembali ke menu
                </Drawer.Close>
              </div>
            ) : (
              <>
                {s.items.map((i) => (
                  <article className="cart-item" key={i.cartItemId}>
                    <h3>{i.name}</h3>
                    <p className="caption">
                      {i.selectedAddons.map((a) => a.name).join(", ") ||
                        "Tanpa saus tambahan"}
                    </p>
                    {i.customNote && <p className="text-xs text-stone-600 mt-1">Ucapan: &ldquo;{i.customNote}&rdquo;</p>}
                    <div className="cart-row">
                      <div className="stepper">
                        <button
                          aria-label={`Kurangi ${i.name}`}
                          onClick={() =>
                            s.updateQuantity(i.cartItemId, i.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <output>{i.quantity}</output>
                        <button
                          aria-label={`Tambah ${i.name}`}
                          disabled={
                            s.items.reduce(
                              (n, x) =>
                                n +
                                x.quantity *
                                  (x.variant === "WHOLE"
                                    ? 20
                                    : x.variant === "SLICE"
                                      ? 4
                                      : 5),
                              0,
                            ) +
                              (i.variant === "WHOLE"
                                ? 20
                                : i.variant === "SLICE"
                                  ? 4
                                  : 5) >
                            80
                          }
                          onClick={() =>
                            s.updateQuantity(i.cartItemId, i.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <span>{formatRupiah(i.unitPrice * i.quantity)}</span>
                      <button
                        className="text-button"
                        onClick={() => s.removeItem(i.cartItemId)}
                      >
                        Hapus
                      </button>
                    </div>
                  </article>
                ))}
                <div className="cart-total">
                  <span>Total produk</span>
                  <strong>{formatRupiah(s.getSubtotal())}</strong>
                </div>
                <p className="caption">
                  Kemasan eco bagasse & sendok kayu sudah termasuk. Ongkir dan kurir dikonfirmasi bersama baker.
                </p>
                {notice && (
                  <p role="status" className="status-message">
                    {notice}
                  </p>
                )}
              </>
            )}
          </div>
          {s.items.length > 0 && (
            <div className="drawer-footer">
              <button className="button primary" onClick={openWhatsApp}>
                Pesan via WhatsApp ↗
              </button>
              <div className="flex gap-2 w-full">
                <button
                  className="button secondary flex-1 text-xs"
                  onClick={copy}
                >
                  {copied ? "✓ Tersalin" : "Salin Ringkasan"}
                </button>
                <a
                  className="button secondary flex-1 text-xs text-center"
                  href="https://www.instagram.com/nookandcake.id/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram ↗
                </a>
              </div>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
