import { getTranslations, setRequestLocale } from "next-intl/server";
import { signOutAction } from "@/actions/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { resolveLocale } from "@/i18n/locale";
import { redirectTo } from "@/i18n/redirect-to";
import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);

  const { data: session } = await auth.getSession();
  if (!session?.user) redirectTo("/login", locale);

  const t = await getTranslations("Dashboard");
  const tCommon = await getTranslations("Common");

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="font-semibold">{tCommon("appName")}</span>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.user.email}
            </span>
            <ThemeToggle />
            <form action={signOutAction.bind(null, locale)}>
              <Button type="submit" variant="outline" size="sm">
                {t("logOut")}
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4">{children}</main>
    </div>
  );
}