/**
 * Deterministic Indonesian Rupiah Currency Formatter
 * Avoids Intl.NumberFormat non-breaking space (\u00A0) discrepancies
 * between Node.js SSR and Browser VDOM hydration.
 */
export function formatRupiah(val: number): string {
  const integerPart = Math.floor(Math.abs(val))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${val < 0 ? '-Rp ' : 'Rp '}${integerPart}`;
}
