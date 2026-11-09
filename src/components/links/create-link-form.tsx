"use client";

import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { createLinkAction } from "@/actions/links";
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
import type { FieldErrors } from "@/lib/result";

export function CreateLinkForm() {
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createLinkAction(formData);

      if (result.error) {
        setFieldErrors(result.error.fieldErrors ?? {});
        if (!result.error.fieldErrors) toast.error(result.error.message);
        return;
      }

      setFieldErrors({});
      form.reset();
      toast.success(`Short link created: /r/${result.data.slug}`);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a short link</CardTitle>
        <CardDescription>
          Paste a long URL. Leave the slug empty to get a random one.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="url">Long URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com/a/very/long/url"
              required
            />
            <FieldError messages={fieldErrors.url} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">Custom slug (optional)</Label>
              <Input id="slug" name="slug" placeholder="my-link" />
              <FieldError messages={fieldErrors.slug} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title (optional)</Label>
              <Input id="title" name="title" placeholder="My article" />
              <FieldError messages={fieldErrors.title} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-6">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Create link"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}