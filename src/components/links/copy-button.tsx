"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({ slug }: { slug: string }) {
  async function handleCopy() {
    const shortUrl = `${window.location.origin}/r/${slug}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Short link copied");
    } catch {
      toast.error("Couldn’t copy the link. Please copy it manually.");
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
      Copy
    </Button>
  );
}