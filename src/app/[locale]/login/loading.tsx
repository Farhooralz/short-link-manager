import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Skeleton className="h-80 w-full max-w-sm" />
    </main>
  );
}