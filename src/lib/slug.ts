import { randomInt } from "node:crypto";

const ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const GENERATED_SLUG_LENGTH = 6;

export function generateSlug(length: number = GENERATED_SLUG_LENGTH): string {
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += ALPHABET.charAt(randomInt(ALPHABET.length));
  }
  return slug;
}