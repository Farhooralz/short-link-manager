"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth/server";
import { createLink } from "@/lib/db/links";
import type { Link } from "@/lib/db/schema";
import { fail, ok, type ActionResult } from "@/lib/result";
import { createLinkSchema } from "@/lib/validation/link";

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