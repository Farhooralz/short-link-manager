import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { ClicksChart } from "@/components/charts/clicks-chart";
import { CopyButton } from "@/components/links/copy-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resolveLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { redirectTo } from "@/i18n/redirect-to";
import { auth } from "@/lib/auth/server";
import { getClicksPerDay } from "@/lib/db/clicks";
import { getLinkDetail } from "@/lib/db/links";
import { cn } from "@/lib/utils";
import { linkIdSchema } from "@/lib/validation/link";

export default async function LinkDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  const locale = resolveLocale(rawLocale);
  setRequestLocale(locale);

  const { data: session } = await auth.getSession();
  if (!session?.user) redirectTo("/login", locale);

  const parsedId = linkIdSchema.safeParse(id);
  if (!parsedId.success) notFound();

  const link = await getLinkDetail(session.user.id, parsedId.data);
  if (!link) notFound();

  const [t, format, daily] = await Promise.all([
    getTranslations("LinkDetail"),
    getFormatter(),
    getClicksPerDay(link.id, 7),
  ]);
  const hasRecentClicks = daily.some((point) => point.clicks > 0);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "self-start")}
      >
        <span aria-hidden className="inline-block rtl:-scale-x-100">
          ←
        </span>{" "}
        {t("back")}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold" dir="auto">
            {link.title ?? `/r/${link.slug}`}
          </h1>
          <p
            className="font-mono text-sm text-muted-foreground rtl:text-right"
            dir="ltr"
          >
            /r/{link.slug}
          </p>
        </div>
        <CopyButton slug={link.slug} />
      </div>

      <Card>
        <CardHeader>
          <CardDescription>{t("destination")}</CardDescription>
          <CardTitle className="break-all text-base font-normal">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
              dir="ltr"
            >
              {link.url}
            </a>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>{t("totalClicks")}</CardDescription>
            <CardTitle className="text-3xl">{format.number(link.clickCount)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("created")}</CardDescription>
            <CardTitle className="text-3xl">
              {format.dateTime(link.createdAt, {
                dateStyle: "medium",
                timeZone: "UTC",
              })}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("chartTitle")}</CardTitle>
          <CardDescription>{t("chartDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <ClicksChart data={daily} />
          {!hasRecentClicks && (
            <p className="text-sm text-muted-foreground">{t("noRecentClicks")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}