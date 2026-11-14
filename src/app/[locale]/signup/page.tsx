import { AuthForm } from "@/components/auth/auth-form";
import { SiteControls } from "@/components/site-controls";

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center p-4">
      <SiteControls className="absolute end-4 top-4" />
      <AuthForm mode="signup" />
    </main>
  );
}