import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <ThemeToggle className="absolute right-4 top-4" />
      <h1 className="text-4xl font-bold tracking-tight">Short Link Manager</h1>
      <p className="max-w-md text-muted-foreground">
        Create short links, share them anywhere, and see how many people click.
      </p>
      <div className="flex gap-3">
        <Link href="/signup" className={buttonVariants()}>
          Sign up
        </Link>
        <Link href="/login" className={buttonVariants({ variant: "outline" })}>
          Log in
        </Link>
      </div>
    </main>
  );
}