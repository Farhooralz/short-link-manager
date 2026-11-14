import { after, NextResponse } from "next/server";
import { recordClick } from "@/lib/db/clicks";
import { getLinkBySlug } from "@/lib/db/links";
import { linkNotFoundResponse } from "@/lib/link-not-found-response";
import { isHttpUrl, slugParamSchema } from "@/lib/validation/link";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const acceptLanguage = request.headers.get("accept-language");

  const parsed = slugParamSchema.safeParse((await params).slug);
  if (!parsed.success) return linkNotFoundResponse(acceptLanguage);

  const link = await getLinkBySlug(parsed.data);
  if (!link || !isHttpUrl(link.url)) return linkNotFoundResponse(acceptLanguage);

  after(async () => {
    try {
      await recordClick(link.id);
    } catch (error) {
      console.error("record click failed:", error);
    }
  });

  return NextResponse.redirect(link.url, 307);
}