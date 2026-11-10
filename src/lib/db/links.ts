import { and, count, desc, eq } from "drizzle-orm";
import { db } from "./index";
import { clicks, links, type Link } from "./schema";
import { generateSlug } from "../slug";

const MAX_SLUG_ATTEMPTS = 5;

type InsertLinkInput = {
  userId: string;
  url: string;
  slug: string;
  title?: string;
};

async function insertLink(input: InsertLinkInput): Promise<Link | null> {
  const [created] = await db
    .insert(links)
    .values({
      userId: input.userId,
      url: input.url,
      slug: input.slug,
      title: input.title ?? null,
    })
    .onConflictDoNothing({ target: links.slug })
    .returning();

  return created ?? null;
}

type CreateLinkParams = {
  userId: string;
  url: string;
  slug?: string;
  title?: string;
};

/** Returns null when a custom slug is already taken. */
export async function createLink(params: CreateLinkParams): Promise<Link | null> {
  const { slug, ...rest } = params;

  if (slug) {
    return insertLink({ ...rest, slug });
  }

  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
    const link = await insertLink({ ...rest, slug: generateSlug() });
    if (link) return link;
  }

  throw new Error("Could not generate a unique slug");
}

export type LinkWithClicks = Link & { clickCount: number };

export async function getLinksByUser(userId: string): Promise<LinkWithClicks[]> {
  const rows = await db
    .select({ link: links, clickCount: count(clicks.id) })
    .from(links)
    .leftJoin(clicks, eq(clicks.linkId, links.id))
    .where(eq(links.userId, userId))
    .groupBy(links.id)
    .orderBy(desc(links.createdAt));

  return rows.map(({ link, clickCount }) => ({ ...link, clickCount }));
}

/** Returns false when the link doesn’t exist or belongs to someone else. */
export async function deleteLink(userId: string, id: string): Promise<boolean> {
  const deleted = await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning({ id: links.id });

  return deleted.length > 0;
}
export async function getLinkBySlug(slug: string): Promise<Link | null> {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.slug, slug))
    .limit(1);

  return link ?? null;
}