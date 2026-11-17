/** Distance used by the example address (the demo never looks up a real one). */
export const EXAMPLE_KM = 4.2;

/** Delivery fee in BRL by distance band: up to 3 km, up to 5 km, beyond. */
export function deliveryFee(km: number): number {
  if (km <= 3) return 10;
  if (km <= 5) return 14;
  return 18;
}

/** A CEP as typed, reduced to its digits (8 at most). */
export function normalizeCep(input: string): string {
  return input.replace(/\D/g, '').slice(0, 8);
}

export function isCompleteCep(input: string): boolean {
  return normalizeCep(input).length === 8;
}

export function cartCount(cart: Record<string, number>): number {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

export function cartSubtotal(cart: Record<string, number>, menu: { id: string; price: number }[]): number {
  return menu.reduce((sum, item) => sum + (cart[item.id] ?? 0) * item.price, 0);
}
