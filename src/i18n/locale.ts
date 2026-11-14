import { hasLocale } from "next-intl";
import { routing } from "./routing";

export function resolveLocale(value: string): string {
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}