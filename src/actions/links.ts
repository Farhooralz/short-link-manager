"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/server";
import { createLink, deleteLink } from "@/lib/db/links";
import type { Link } from "@/lib/db/schema";
import { fail, ok, type ActionResult } from "@/lib/result";
import { toFieldErrors } from "@/lib/validation/errors";
import { createLinkSchema, linkIdSchema } from "@/lib/validation/link";

export async function createLinkAction(
  formData: FormData,
): Promise<ActionResult<Link>> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return fail("unauthorized");

  const parsed = createLinkSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return fail("invalidInput", toFieldErrors(parsed.error));
  }

  try {
    const link = await createLink({ userId: session.user.id, ...parsed.data });
    if (!link) return fail("invalidInput", { slug: ["slugTaken"] });

    revalidatePath("/[locale]/dashboard", "page");
    return ok(link);
  } catch (error) {
    console.error("create link failed:", error);
    return fail("createFailed");
  }
}

export async function deleteLinkAction(id: string): Promise<ActionResult<null>> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return fail("unauthorized");

  const parsedId = linkIdSchema.safeParse(id);
  if (!parsedId.success) return fail("linkNotFound");

  try {
    const deleted = await deleteLink(session.user.id, parsedId.data);
    if (!deleted) return fail("linkNotFound");

    revalidatePath("/[locale]/dashboard", "page");
    return ok(null);
  } catch (error) {
    console.error("delete link failed:", error);
    return fail("deleteFailed");
  }
}