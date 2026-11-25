/**
 * Atomic Slot Engine & Capacity Guard
 * Prevents overbooking and ensures the Solo Baker capacity (max 16 Bento/day) is protected.
 * Provides a 15-minute temporary reservation lock during QRIS checkout.
 */

export interface SlotReservation {
  id: string;
  slotDate: string;
  bentoUnits: number;
  orderNumber: string;
  expiresAt: number; // Unix timestamp ms
  isConfirmed: boolean;
}

// In-memory atomic store (Distributed Redis in production)
const activeReservations: Map<string, SlotReservation> = new Map();
const slotCapacities: Record<string, { max: number; permanentBooked: number }> = {
  '2026-11-24': { max: 16, permanentBooked: 12 },
  '2026-11-25': { max: 16, permanentBooked: 6 },
  '2026-11-26': { max: 16, permanentBooked: 16 }, // Sold out
  '2026-11-27': { max: 20, permanentBooked: 8 },
  '2026-11-28': { max: 20, permanentBooked: 5 },
};

/**
 * Attempts to acquire an atomic reservation lock for the requested slot
 */
export function acquireSlotLock(
  slotDate: string,
  bentoUnits: number,
  orderNumber: string,
  ttlMinutes = 15
): { success: boolean; reservationId?: string; message: string; remaining?: number } {
  // Purge expired temporary locks
  const now = Date.now();
  for (const [id, res] of activeReservations.entries()) {
    if (!res.isConfirmed && res.expiresAt < now) {
      activeReservations.delete(id);
    }
  }

  const slot = slotCapacities[slotDate] || { max: 16, permanentBooked: 0 };

  // Calculate current reserved units from unexpired locks
  let activePendingUnits = 0;
  for (const res of activeReservations.values()) {
    if (res.slotDate === slotDate && !res.isConfirmed) {
      activePendingUnits += res.bentoUnits;
    }
  }

  const totalUsed = slot.permanentBooked + activePendingUnits;
  const available = slot.max - totalUsed;

  if (available < bentoUnits) {
    return {
      success: false,
      message: `Maaf, slot untuk tanggal ${slotDate} hanya tersisa ${Math.max(0, available)} bento.`,
      remaining: Math.max(0, available),
    };
  }

  const reservationId = `lock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  activeReservations.set(reservationId, {
    id: reservationId,
    slotDate,
    bentoUnits,
    orderNumber,
    expiresAt: now + ttlMinutes * 60 * 1000,
    isConfirmed: false,
  });

  return {
    success: true,
    reservationId,
    message: `Slot berhasil dikunci selama ${ttlMinutes} menit.`,
    remaining: available - bentoUnits,
  };
}

/**
 * Confirms payment and permanently deducts capacity
 */
export function confirmSlotReservation(reservationId: string): boolean {
  const res = activeReservations.get(reservationId);
  if (!res) return false;

  res.isConfirmed = true;
  const slot = slotCapacities[res.slotDate] || { max: 16, permanentBooked: 0 };
  slot.permanentBooked += res.bentoUnits;
  slotCapacities[res.slotDate] = slot;

  return true;
}

/**
 * Releases a temporary reservation lock if order is cancelled
 */
export function releaseSlotLock(reservationId: string): boolean {
  return activeReservations.delete(reservationId);
}
