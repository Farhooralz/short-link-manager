import { after, NextResponse } from "next/server";
import { recordClick } from "@/lib/db/clicks";
import { getLinkBySlug } from "@/lib/db/links";
import { linkNotFoundResponse } from "@/lib/link-not-found-response";
import { slugParamSchema } from "@/lib/validation/link";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const parsed = slugParamSchema.safeParse((await params).slug);
  if (!parsed.success) return linkNotFoundResponse();

  const link = await getLinkBySlug(parsed.data);
  if (!link) return linkNotFoundResponse();

  after(async () => {
    try {
      await recordClick(link.id);
    } catch (error) {
      console.error("record click failed:", error);
    }
  });

  return NextResponse.redirect(link.url, 307);
}