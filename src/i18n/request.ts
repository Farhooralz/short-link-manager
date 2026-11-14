import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import en from "../../messages/en.json";
import fa from "../../messages/fa.json";
import { routing } from "./routing";

const messagesByLocale = { en, fa } satisfies Record<
  (typeof routing.locales)[number],
  typeof en
>;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return { locale, messages: messagesByLocale[locale] };
});