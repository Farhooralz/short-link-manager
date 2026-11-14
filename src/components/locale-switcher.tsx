"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { LOCALE_LABELS, otherLocale } from "@/i18n/locales";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const t = useTranslations("Locale");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const target = otherLocale(locale);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      lang={target}
      disabled={isPending}
      aria-label={t("switchLanguage")}
      onClick={() =>
        startTransition(() => router.replace(pathname, { locale: target }))
      }
    >
      {LOCALE_LABELS[target]}
    </Button>
  );
}