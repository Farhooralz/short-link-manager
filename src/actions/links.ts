"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth/server";
import { createLink, deleteLink } from "@/lib/db/links";
import type { Link } from "@/lib/db/schema";
import { fail, ok, type ActionResult } from "@/lib/result";
import { createLinkSchema, linkIdSchema } from "@/lib/validation/link";

export async function createLinkAction(
  formData: FormData,
): Promise<ActionResult<Link>> {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return fail("You need to be logged in to create links.");
  }

  const parsed = createLinkSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return fail(
      "Please fix the highlighted fields.",
      z.flattenError(parsed.error).fieldErrors,
    );
  }

  try {
    const link = await createLink({ userId: session.user.id, ...parsed.data });
    if (!link) {
      return fail("Please fix the highlighted fields.", {
        slug: ["That slug is already taken"],
      });
    }

    revalidatePath("/dashboard");
    return ok(link);
  } catch (error) {
    console.error("create link failed:", error);
    return fail("Something went wrong creating your link. Please try again.");
  }
}
export async function deleteLinkAction(id: string): Promise<ActionResult<null>> {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return fail("You need to be logged in to delete links.");
  }

  const parsedId = linkIdSchema.safeParse(id);
  if (!parsedId.success) {
    return fail("That link doesn’t exist.");
  }

  try {
    const deleted = await deleteLink(session.user.id, parsedId.data);
    if (!deleted) {
      return fail("That link doesn’t exist or was already deleted.");
    }

    revalidatePath("/dashboard");
    return ok(null);
  } catch (error) {
    console.error("delete link failed:", error);
    return fail("Something went wrong deleting your link. Please try again.");
  }
}