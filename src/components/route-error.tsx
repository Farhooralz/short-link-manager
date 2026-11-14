"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function RouteError({ reset }: { reset: () => void }) {
  const t = useTranslations("RouteError");

  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <h2 className="text-xl font-semibold">{t("title")}</h2>
      <p className="text-sm text-muted-foreground">{t("description")}</p>
      <Button type="button" onClick={reset}>
        {t("retry")}
      </Button>
    </div>
  );
}