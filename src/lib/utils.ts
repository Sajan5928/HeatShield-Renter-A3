/**
 * Minimal class-name merge utility.
 * Filters out falsy values and joins the rest with a space.
 */
export function cn(...inputs: (string | false | null | undefined)[]): string {
  return inputs.filter(Boolean).join(' ')
}
