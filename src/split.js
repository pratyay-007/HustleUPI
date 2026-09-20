/** Safe per-transaction ceiling: strictly under ₹2,000. */
export const TRANCHE_CEILING = 1999;

/**
 * Split a bill into the fewest whole-rupee tranches, none above TRANCHE_CEILING.
 * Uses even-ish amounts (remainder rupees folded into the last tranches).
 *
 * @param {number} total
 * @returns {number[]}
 */
export function splitAmount(total) {
  const amount = Number(total);
  if (!Number.isFinite(amount) || amount < 1) {
    return [];
  }

  const rupees = Math.round(amount);
  if (rupees <= TRANCHE_CEILING) {
    return [rupees];
  }

  const count = Math.ceil(rupees / TRANCHE_CEILING);
  const base = Math.floor(rupees / count);
  const remainder = rupees % count;

  return Array.from({ length: count }, (_, index) => {
    return base + (index >= count - remainder ? 1 : 0);
  });
}
