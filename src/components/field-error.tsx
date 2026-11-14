"use client";

import { useTranslations } from "next-intl";
import type { ValidationCode } from "@/lib/error-codes";

export function FieldError({ codes }: { codes?: ValidationCode[] }) {
  const t = useTranslations("Validation");
  if (!codes?.length) return null;
  return <p className="text-sm text-destructive">{t(codes[0])}</p>;
}