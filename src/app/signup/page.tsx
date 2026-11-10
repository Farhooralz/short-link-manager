import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const { data: session } = await auth.getSession();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="relative flex min-h-screen items-center justify-center p-4">
      <ThemeToggle className="absolute right-4 top-4" />
      <AuthForm mode="signup" />
    </main>
  );
}