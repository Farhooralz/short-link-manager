import { z } from "zod";

const SLUG_PATTERN = /^[a-zA-Z0-9-]+$/;

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

export const createLinkSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "urlRequired")
    .max(2048, "urlTooLong")
    .refine(isHttpUrl, "urlInvalid"),
  slug: emptyToUndefined(
    z
      .string()
      .trim()
      .min(3, "slugTooShort")
      .max(50, "slugTooLong")
      .regex(SLUG_PATTERN, "slugInvalid"),
  ),
  title: emptyToUndefined(z.string().trim().max(100, "titleTooLong")),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

export const linkIdSchema = z.uuid();

export const slugParamSchema = z.string().max(50).regex(SLUG_PATTERN);