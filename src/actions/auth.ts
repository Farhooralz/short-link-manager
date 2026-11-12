"use server";

import { getLocale } from "next-intl/server";
import { redirectTo } from "@/i18n/redirect-to";
import { z } from "zod";
import { auth } from "@/lib/auth/server";
import { fail, type ActionResult } from "@/lib/result";
import { signInSchema, signUpSchema } from "@/lib/validation/auth";

export async function signUpAction(
  _prevState: ActionResult<null> | null,
  formData: FormData,
): Promise<ActionResult<null>> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return fail(
      "Please fix the highlighted fields.",
      z.flattenError(parsed.error).fieldErrors,
    );
  }

  const { error } = await auth.signUp.email(parsed.data);
  if (error) {
    console.error("sign-up failed:", error);
    return fail(
      "We couldn’t create your account. That email may already be registered.",
    );
  }

  redirectTo("/dashboard", await getLocale());
}

export async function signInAction(
  _prevState: ActionResult<null> | null,
  formData: FormData,
): Promise<ActionResult<null>> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return fail(
      "Please fix the highlighted fields.",
      z.flattenError(parsed.error).fieldErrors,
    );
  }

  const { error } = await auth.signIn.email(parsed.data);
  if (error) {
    console.error("sign-in failed:", error);
    return fail("Invalid email or password.");
  }

  redirectTo("/dashboard", await getLocale());
}

export async function signOutAction(): Promise<void> {
  await auth.signOut();
  redirectTo("/login", await getLocale());
}