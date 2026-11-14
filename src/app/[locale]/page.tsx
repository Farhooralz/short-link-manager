import { useTranslations } from "next-intl";
import { SiteControls } from "@/components/site-controls";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations("Home");
  const tCommon = useTranslations("Common");

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <SiteControls className="absolute end-4 top-4" />
      <h1 className="text-4xl font-bold tracking-tight">{tCommon("appName")}</h1>
      <p className="max-w-md text-muted-foreground">{t("tagline")}</p>
      <div className="flex gap-3">
        <Link href="/signup" className={buttonVariants()}>
          {t("signUp")}
        </Link>
        <Link href="/login" className={buttonVariants({ variant: "outline" })}>
          {t("logIn")}
        </Link>
      </div>
    </main>
  );
}