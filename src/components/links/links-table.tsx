import { Link } from "@/i18n/navigation";
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
import type { LinkWithClicks } from "@/lib/db/links";
import { formatDate } from "@/lib/format";

export function LinksTable({ links }: { links: LinkWithClicks[] }) {
  return (
    <>
      <div className="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slug</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                <TableCell>{link.title ?? "—"}</TableCell>
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
                  {link.clickCount} {link.clickCount === 1 ? "click" : "clicks"}{" "}
                  · {formatDate(link.createdAt)}
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