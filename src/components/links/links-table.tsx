import { useFormatter, useTranslations } from "next-intl";
import { CopyButton } from "@/components/links/copy-button";
import { DeleteLinkDialog } from "@/components/links/delete-link-dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import type { LinkWithClicks } from "@/lib/db/links";

export function LinksTable({ links }: { links: LinkWithClicks[] }) {
  const t = useTranslations("Links");
  const format = useFormatter();

  const formatDate = (date: Date) =>
    format.dateTime(date, { dateStyle: "medium", timeZone: "UTC" });

  return (
    <>
      <div className="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("slug")}</TableHead>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("destination")}</TableHead>
              <TableHead className="text-right">{t("clicks")}</TableHead>
              <TableHead>{t("created")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-mono">
                  <Link
                    href={`/dashboard/links/${link.id}`}
                    className="underline-offset-4 hover:underline"
                  >
                    /r/{link.slug}
                  </Link>
                </TableCell>
                <TableCell>{link.title ?? t("noTitle")}</TableCell>
                <TableCell className="max-w-xs truncate" title={link.url}>
                  {link.url}
                </TableCell>
                <TableCell className="text-right">{link.clickCount}</TableCell>
                <TableCell>{formatDate(link.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <CopyButton slug={link.slug} />
                    <DeleteLinkDialog id={link.id} slug={link.slug} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {links.map((link) => (
          <li key={link.id}>
            <Card>
              <CardContent className="flex flex-col gap-3">
                <div>
                  <Link
                    href={`/dashboard/links/${link.id}`}
                    className="font-mono font-medium underline-offset-4 hover:underline"
                  >
                    /r/{link.slug}
                  </Link>
                  {link.title && (
                    <p className="text-sm text-muted-foreground">{link.title}</p>
                  )}
                </div>
                <p className="break-all text-sm">{link.url}</p>
                <p className="text-sm text-muted-foreground">
                  {t("clickCount", { count: link.clickCount })} ·{" "}
                  {formatDate(link.createdAt)}
                </p>
                <div className="flex gap-2">
                  <CopyButton slug={link.slug} />
                  <DeleteLinkDialog id={link.id} slug={link.slug} />
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}