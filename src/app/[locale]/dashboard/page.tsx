import { getTranslations, setRequestLocale } from "next-intl/server";
import { CreateLinkForm } from "@/components/links/create-link-form";
import { EmptyState } from "@/components/links/empty-state";
import { LinksTable } from "@/components/links/links-table";
import { resolveLocale } from "@/i18n/locale";
import { redirectTo } from "@/i18n/redirect-to";
import { auth } from "@/lib/auth/server";
import { getLinksByUser } from "@/lib/db/links";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);

  const { data: session } = await auth.getSession();
  if (!session?.user) redirectTo("/login", locale);

  const [t, links] = await Promise.all([
    getTranslations("Dashboard"),
    getLinksByUser(session.user.id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <CreateLinkForm />
      {links.length === 0 ? <EmptyState /> : <LinksTable links={links} />}
    </div>
  );
}