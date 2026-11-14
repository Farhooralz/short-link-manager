import type { ErrorCode, ValidationCode } from "@/lib/error-codes";

export type FieldErrors = Partial<Record<string, ValidationCode[]>>;

export type ActionError = {
  code: ErrorCode;
  fieldErrors?: FieldErrors;
};

export type ActionResult<T> =
  | { data: T; error: null }
  | { data: null; error: ActionError };

export function ok<T>(data: T): ActionResult<T> {
  return { data, error: null };
}

export function fail(
  code: ErrorCode,
  fieldErrors?: FieldErrors,
): ActionResult<never> {
  return { data: null, error: { code, fieldErrors } };
}