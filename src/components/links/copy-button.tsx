"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({ slug }: { slug: string }) {
  const t = useTranslations("Links");

  async function handleCopy() {
    const shortUrl = `${window.location.origin}/r/${slug}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
      {t("copy")}
    </Button>
  );
}