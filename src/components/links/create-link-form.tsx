"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("CreateLink");
  const tErrors = useTranslations("Errors");
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createLinkAction(formData);

      if (result.error) {
        const errors = result.error.fieldErrors ?? {};
        setFieldErrors(errors);
        if (Object.keys(errors).length === 0) {
          toast.error(tErrors(result.error.code));
        }
        return;
      }

      setFieldErrors({});
      form.reset();
      toast.success(t("created", { slug: result.data.slug }));
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="url">{t("url")}</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder={t("urlPlaceholder")}
              dir="ltr"
              required
            />
            <FieldError codes={fieldErrors.url} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">{t("slug")}</Label>
              <Input id="slug" name="slug" placeholder={t("slugPlaceholder")} dir="ltr" />
              <FieldError codes={fieldErrors.slug} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">{t("linkTitle")}</Label>
              <Input id="title" name="title" placeholder={t("titlePlaceholder")} dir="auto" />
              <FieldError codes={fieldErrors.title} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-6">
          <Button type="submit" disabled={isPending}>
            {isPending ? t("pending") : t("submit")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}