"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import { signInAction, signUpAction } from "@/actions/auth";
import { FieldError } from "@/components/field-error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import type { ActionResult } from "@/lib/result";

type AuthFormProps = { mode: "login" | "signup" };

export function AuthForm({ mode }: AuthFormProps) {
  const t = useTranslations("Auth");
  const tErrors = useTranslations("Errors");
  const locale = useLocale();

  const [state, formAction, isPending] = useActionState<
    ActionResult<null> | null,
    FormData
  >(
    mode === "signup"
      ? signUpAction.bind(null, locale)
      : signInAction.bind(null, locale),
    null,
  );

  const fieldErrors = state?.error?.fieldErrors;
  const hasFieldErrors =
    fieldErrors !== undefined && Object.keys(fieldErrors).length > 0;
  const formErrorCode = state?.error && !hasFieldErrors ? state.error.code : null;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t(`${mode}.title`)}</CardTitle>
        <CardDescription>{t(`${mode}.description`)}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-4">
          {mode === "signup" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" name="name" autoComplete="name" required />
              <FieldError codes={fieldErrors?.name} />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
            <FieldError codes={fieldErrors?.email} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
            />
            <FieldError codes={fieldErrors?.password} />
          </div>
          {formErrorCode && (
            <p role="alert" className="text-sm text-destructive">
              {tErrors(formErrorCode)}
            </p>
          )}
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t(`${mode}.pending`) : t(`${mode}.submit`)}
          </Button>
          <p className="text-sm text-muted-foreground">
            {t(`${mode}.altText`)}{" "}
            <Link
              href={mode === "login" ? "/signup" : "/login"}
              className="underline underline-offset-4"
            >
              {t(`${mode}.altLabel`)}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}