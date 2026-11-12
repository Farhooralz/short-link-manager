import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-5 w-96 max-w-full" />
    </main>
  );
}