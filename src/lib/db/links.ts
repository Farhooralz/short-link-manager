import { db } from "./index";
import { links, type Link } from "./schema";
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