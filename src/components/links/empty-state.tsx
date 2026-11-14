import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
  const t = useTranslations("Empty");

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-1 py-10 text-center">
        <p className="font-medium">{t("title")}</p>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </CardContent>
    </Card>
  );
}