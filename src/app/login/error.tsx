"use client";

import { RouteError } from "@/components/route-error";

export default function LoginError({ reset }: { reset: () => void }) {
  return <RouteError reset={reset} />;
}