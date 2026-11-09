import { redirect } from "next/navigation";
import { CreateLinkForm } from "@/components/links/create-link-form";
import { EmptyState } from "@/components/links/empty-state";
import { LinksTable } from "@/components/links/links-table";
import { auth } from "@/lib/auth/server";
import { getLinksByUser } from "@/lib/db/links";

export default async function DashboardPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/login");

  const links = await getLinksByUser(session.user.id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Your links</h1>
      <CreateLinkForm />
      {links.length === 0 ? <EmptyState /> : <LinksTable links={links} />}
    </div>
  );
}