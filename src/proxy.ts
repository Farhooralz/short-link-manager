import { hasLocale } from "next-intl";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth/server";

const handleI18n = createMiddleware(routing);

const dashboardGuards = Object.fromEntries(
  routing.locales.map((locale) => [
    locale,
    auth.middleware({ loginUrl: `/${locale}/login` }),
  ]),
);

export default function proxy(request: NextRequest) {
  const [, locale, section] = request.nextUrl.pathname.split("/");

  if (section === "dashboard" && hasLocale(routing.locales, locale)) {
    return dashboardGuards[locale](request);
  }

  return handleI18n(request);
}

export const config = {
  matcher: "/((?!api|r/|_next|_vercel|.*\\..*).*)",
};