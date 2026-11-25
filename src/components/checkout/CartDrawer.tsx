"use client";
import { useState } from "react";
import { Drawer } from "vaul";
import { useCartStore } from "@/store/useCartStore";
import { formatRupiah } from "@/lib/format";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285156622944";

export function CartDrawer() {
  const s = useCartStore();
  const [customerName, setCustomerName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  const getOrderSummaryText = () => {
    const trimmedName = customerName.trim();
    return [
      "Halo nook & cake! 🍰 Saya ingin memesan:",
      ...(trimmedName ? ["", `Nama Pemesan: ${trimmedName}`] : []),
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
    if (!customerName.trim()) {
      setNameError(true);
      document.getElementById("cart-customer-name")?.focus();
      return;
    }
    const text = getOrderSummaryText();
    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  async function copy() {
    if (!customerName.trim()) {
      setNameError(true);
      document.getElementById("cart-customer-name")?.focus();
      return;
    }
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
        setNameError(false);
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
                    {i.selectedAddons.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1 mb-1">
                        {i.selectedAddons.map((a) => (
                          <span
                            key={a.sauceId}
                            className="inline-flex items-center gap-1 text-[10px] font-mono bg-[#0E5B44]/8 border border-[#0E5B44]/30 px-1.5 py-0.5 rounded text-[#0E5B44] font-bold"
                          >
                            + {a.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="caption">Tanpa saus tambahan</p>
                    )}
                    {i.customNote && (
                      <div className="text-[11px] font-mono bg-[#FAF7F0] border-l-2 border-[#0E5B44] px-2 py-1 rounded-r text-[#2E4732] mt-1.5 mb-1 italic">
                        💌 &ldquo;{i.customNote}&rdquo;
                      </div>
                    )}
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
                <div className="mt-4 mb-2">
                  <label
                    htmlFor="cart-customer-name"
                    className="block font-display font-bold text-xs text-[#00332A] mb-1.5"
                  >
                    Nama Pemesan <span className="text-[#BE123C]">*</span>
                  </label>
                  <input
                    id="cart-customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (nameError && e.target.value.trim()) setNameError(false);
                    }}
                    placeholder="Masukkan nama kamu..."
                    maxLength={80}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border text-sm font-mono text-[#00332A] placeholder:text-[#687E6C]/70 focus:outline-none transition-colors ${
                      nameError
                        ? "border-[#BE123C] ring-1 ring-[#BE123C]/40"
                        : "border-[#D9D3C5] focus:border-[#0E5B44]"
                    }`}
                  />
                  {nameError && (
                    <p className="mt-1 text-[11px] font-mono text-[#BE123C]">
                      Mohon isi nama pemesan sebelum mengirim pesanan.
                    </p>
                  )}
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
                  href="https://www.instagram.com/nookcakeid/"
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
