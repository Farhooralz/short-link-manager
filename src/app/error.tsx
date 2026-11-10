"use client";

import { RouteError } from "@/components/route-error";

export default function RootError({ reset }: { reset: () => void }) {
  return <RouteError reset={reset} />;
}