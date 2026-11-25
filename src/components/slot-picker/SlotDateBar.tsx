"use client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { PreOrderSlot } from "@/types/catalog";
export function SlotDateBar() {
  const { selectedSlot, setSelectedSlot } = useCartStore();
  const [dates, setDates] = useState<PreOrderSlot[]>([]);
  useEffect(() => {
    const refresh = () => {
      const now = new Date();
      const local = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(now);
      const hour = Number(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          hourCycle: "h23",
        }).format(now),
      );
      setDates(
        [1, 2].map((offset) => {
          const d = new Date(local + "T12:00:00+07:00");
          d.setUTCDate(d.getUTCDate() + offset);
          return {
            dateKey: new Intl.DateTimeFormat("en-CA", {
              timeZone: "Asia/Jakarta",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(d),
            dayLabel: offset === 1 ? "Besok" : "Lusa",
            dateFormatted: new Intl.DateTimeFormat("id-ID", {
              timeZone: "Asia/Jakarta",
              day: "numeric",
              month: "short",
            }).format(d),
            fullDate: new Intl.DateTimeFormat("id-ID", {
              timeZone: "Asia/Jakarta",
              dateStyle: "full",
            }).format(d),
            totalCapacity: 16,
            bookedCapacity: 0,
            isCutOff: offset === 1 && hour >= 16,
            isSoldOut: false,
          };
        }),
      );
    };
    refresh();
    const timer = setInterval(refresh, 30000);
    return () => clearInterval(timer);
  }, []);
  return (
    <section id="slots" className="wrap section date-section">
      <div>
        <p className="eyebrow">01 / Tentukan harinya</p>
        <h2>Kapan ingin menikmati?</h2>
        <p>
          Permintaan untuk besok ditutup pukul 16.00 WIB.
          <br />
          Ketersediaan dikonfirmasi oleh baker sebelum pembayaran.
        </p>
      </div>
      <div
        className="date-options"
        role="group"
        aria-label="Tanggal yang diminta"
      >
        {dates.map((d) => (
          <button
            key={d.dateKey}
            disabled={d.isCutOff}
            aria-pressed={selectedSlot?.dateKey === d.dateKey}
            onClick={() => setSelectedSlot(d)}
          >
            <span>{d.dayLabel}</span>
            <strong>{d.dateFormatted}</strong>
            <small>
              {d.isCutOff ? "Permintaan ditutup" : "Minta tanggal ini"}
            </small>
          </button>
        ))}
      </div>
    </section>
  );
}
