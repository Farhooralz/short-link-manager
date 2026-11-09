import { CreateLinkForm } from "@/components/links/create-link-form";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Your links</h1>
      <CreateLinkForm />
      <p className="text-muted-foreground">No links to show yet.</p>
    </div>
  );
}