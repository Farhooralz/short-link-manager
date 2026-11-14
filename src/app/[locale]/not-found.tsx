import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <p className="font-mono text-sm text-muted-foreground">{t("code")}</p>
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="max-w-md text-muted-foreground">{t("description")}</p>
      <Link href="/" className={buttonVariants()}>
        {t("home")}
      </Link>
    </main>
  );
}