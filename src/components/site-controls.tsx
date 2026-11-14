import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function SiteControls({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LocaleSwitcher />
      <ThemeToggle />
    </div>
  );
}