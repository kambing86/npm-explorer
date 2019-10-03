// solving issue https://github.com/Microsoft/TypeScript/issues/17002
export function isArray(
  value: unknown
): value is unknown[] | readonly unknown[] {
  return Array.isArray(value);
}
