import { z } from "zod";

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

function emptyToUndefined<T extends z.ZodType>(schema: T) {
  return z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    schema.optional(),
  );
}

const SLUG_PATTERN = /^[a-zA-Z0-9-]+$/;

export const createLinkSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Enter a URL")
    .max(2048, "URL is too long")
    .refine(isHttpUrl, "Enter a valid http:// or https:// URL"),
  slug: emptyToUndefined(
    z
      .string()
      .trim()
      .min(3, "Use at least 3 characters")
      .max(50, "Use at most 50 characters")
      .regex(SLUG_PATTERN, "Use letters, numbers and dashes only"),
  ),
  title: emptyToUndefined(
    z.string().trim().max(100, "Title must be 100 characters or fewer"),
  ),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export const linkIdSchema = z.uuid();
export const slugParamSchema = z.string().max(50).regex(SLUG_PATTERN);