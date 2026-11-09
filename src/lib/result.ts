export type FieldErrors = Record<string, string[] | undefined>;

export type ActionError = {
  message: string;
  fieldErrors?: FieldErrors;
};

export type ActionResult<T> =
  | { data: T; error: null }
  | { data: null; error: ActionError };

export function fail(
  message: string,
  fieldErrors?: FieldErrors,
): ActionResult<never> {
  return { data: null, error: { message, fieldErrors } };
}