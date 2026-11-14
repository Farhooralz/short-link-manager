import type { routing } from "./routing";

export type AppLocale = (typeof routing.locales)[number];

export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  fa: "فارسی",
};

export function otherLocale(current: string): AppLocale {
  return current === "fa" ? "en" : "fa";
}