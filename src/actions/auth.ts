"use server";

import { resolveLocale } from "@/i18n/locale";
import { redirectTo } from "@/i18n/redirect-to";
import { auth } from "@/lib/auth/server";
import { fail, type ActionResult } from "@/lib/result";
import { signInSchema, signUpSchema } from "@/lib/validation/auth";
import { toFieldErrors } from "@/lib/validation/errors";

export async function signUpAction(
  locale: string,
  _prevState: ActionResult<null> | null,
  formData: FormData,
): Promise<ActionResult<null>> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return fail("invalidInput", toFieldErrors(parsed.error));
  }

  const { error } = await auth.signUp.email(parsed.data);
  if (error) {
    console.error("sign-up failed:", error);
    return fail("signUpFailed");
  }

  redirectTo("/dashboard", resolveLocale(locale));
}

export async function signInAction(
  locale: string,
  _prevState: ActionResult<null> | null,
  formData: FormData,
): Promise<ActionResult<null>> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return fail("invalidInput", toFieldErrors(parsed.error));
  }

  const { error } = await auth.signIn.email(parsed.data);
  if (error) {
    console.error("sign-in failed:", error);
    return fail("signInFailed");
  }

  redirectTo("/dashboard", resolveLocale(locale));
}

export async function signOutAction(locale: string): Promise<void> {
  await auth.signOut();
  redirectTo("/login", resolveLocale(locale));
}