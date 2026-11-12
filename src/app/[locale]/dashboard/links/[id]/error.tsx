"use client";

import { RouteError } from "@/components/route-error";

export default function LinkDetailError({ reset }: { reset: () => void }) {
  return <RouteError reset={reset} />;
}