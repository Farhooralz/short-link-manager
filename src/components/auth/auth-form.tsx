"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction, signUpAction } from "@/actions/auth";
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
import type { ActionResult } from "@/lib/result";
import { FieldError } from "@/components/field-error";

type AuthFormProps = { mode: "login" | "signup" };

const copy = {
  login: {
    title: "Welcome back",
    description: "Log in to manage your links.",
    submit: "Log in",
    pending: "Logging in…",
    altText: "Don’t have an account?",
    altLabel: "Sign up",
    altHref: "/signup",
  },
  signup: {
    title: "Create your account",
    description: "Start creating short links in seconds.",
    submit: "Create account",
    pending: "Creating account…",
    altText: "Already have an account?",
    altLabel: "Log in",
    altHref: "/login",
  },
} as const;

export function AuthForm({ mode }: AuthFormProps) {
  const [state, formAction, isPending] = useActionState<
    ActionResult<null> | null,
    FormData
  >(mode === "signup" ? signUpAction : signInAction, null);

  const text = copy[mode];
  const fieldErrors = state?.error?.fieldErrors;
  const formError = state?.error && !fieldErrors ? state.error.message : null;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{text.title}</CardTitle>
        <CardDescription>{text.description}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-4">
          {mode === "signup" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" autoComplete="name" required />
              <FieldError messages={fieldErrors?.name} />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
            <FieldError messages={fieldErrors?.email} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
            />
            <FieldError messages={fieldErrors?.password} />
          </div>
          {formError && (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          )}
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? text.pending : text.submit}
          </Button>
          <p className="text-sm text-muted-foreground">
            {text.altText}{" "}
            <Link href={text.altHref} className="underline underline-offset-4">
              {text.altLabel}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}