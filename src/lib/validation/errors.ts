import type { z } from "zod";
import { isValidationCode, type ValidationCode } from "@/lib/error-codes";
import type { FieldErrors } from "@/lib/result";

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const result: FieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (field === undefined) continue;

    const code: ValidationCode = isValidationCode(issue.message)
      ? issue.message
      : "invalid";
    (result[String(field)] ??= []).push(code);
  }

  return result;
}