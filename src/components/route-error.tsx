"use client";

import { Button } from "@/components/ui/button";

type RouteErrorProps = {
  reset: () => void;
  title?: string;
  message?: string;
};

export function RouteError({
  reset,
  title = "Something went wrong",
  message = "We couldn’t load this page. Please try again.",
}: RouteErrorProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}