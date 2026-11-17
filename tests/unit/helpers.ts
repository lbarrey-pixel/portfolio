/**
 * The "shape" of a strings object: same keys, same nesting, same array lengths, with every
 * leaf replaced by its type. Two locales with the same shape have the same things to say.
 */
export function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value as object)
        .sort()
        .map((k) => [k, shape((value as Record<string, unknown>)[k])]),
    );
  }
  return typeof value;
}

/** Every string leaf of an object, to check none is empty. */
export function leaves(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(leaves);
  if (value !== null && typeof value === 'object') return Object.values(value as object).flatMap(leaves);
  return [];
}
