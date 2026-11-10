import { Skeleton } from "@/components/ui/skeleton";

export default function SignupLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Skeleton className="h-96 w-full max-w-sm" />
    </main>
  );
}