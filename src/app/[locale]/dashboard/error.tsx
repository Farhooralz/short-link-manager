"use client";

import { RouteError } from "@/components/route-error";

export default function DashboardError({ reset }: { reset: () => void }) {
  return <RouteError reset={reset} />;
}