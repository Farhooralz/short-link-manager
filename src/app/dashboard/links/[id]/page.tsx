import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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
import { auth } from "@/lib/auth/server";
import { getClicksPerDay } from "@/lib/db/clicks";
import { getLinkDetail } from "@/lib/db/links";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { linkIdSchema } from "@/lib/validation/link";

export default async function LinkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/login");

  const parsedId = linkIdSchema.safeParse((await params).id);
  if (!parsedId.success) notFound();

  const link = await getLinkDetail(session.user.id, parsedId.data);
  if (!link) notFound();

  const daily = await getClicksPerDay(link.id, 7);
  const hasRecentClicks = daily.some((point) => point.clicks > 0);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "self-start")}
      >
        ← Back to links
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold">
            {link.title ?? `/r/${link.slug}`}
          </h1>
          <p className="font-mono text-sm text-muted-foreground">/r/{link.slug}</p>
        </div>
        <CopyButton slug={link.slug} />
      </div>

      <Card>
        <CardHeader>
          <CardDescription>Destination</CardDescription>
          <CardTitle className="break-all text-base font-normal">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              {link.url}
            </a>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Total clicks</CardDescription>
            <CardTitle className="text-3xl">{link.clickCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Created</CardDescription>
            <CardTitle className="text-3xl">{formatDate(link.createdAt)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clicks per day</CardTitle>
          <CardDescription>Last 7 days (UTC)</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <ClicksChart data={daily} />
          {!hasRecentClicks && (
            <p className="text-sm text-muted-foreground">
              No clicks in the last 7 days yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}