export const ERROR_CODES = [
  "unauthorized",
  "invalidInput",
  "signUpFailed",
  "signInFailed",
  "serviceUnavailable",
  "createFailed",
  "deleteFailed",
  "linkNotFound",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export const VALIDATION_CODES = [
  "nameRequired",
  "nameTooLong",
  "emailInvalid",
  "passwordTooShort",
  "passwordTooLong",
  "passwordRequired",
  "urlRequired",
  "urlTooLong",
  "urlInvalid",
  "slugTooShort",
  "slugTooLong",
  "slugInvalid",
  "slugTaken",
  "titleTooLong",
  "invalid",
] as const;

export type ValidationCode = (typeof VALIDATION_CODES)[number];

export function isValidationCode(value: string): value is ValidationCode {
  return (VALIDATION_CODES as readonly string[]).includes(value);
}