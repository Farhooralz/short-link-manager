import { redirect } from "next/navigation";
import { getPathname } from "./navigation";

type AppPath = "/login" | "/dashboard";

export function redirectTo(href: AppPath, locale: string): never {
  redirect(getPathname({ href, locale }));
}