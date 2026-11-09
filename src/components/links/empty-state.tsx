import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-1 py-10 text-center">
        <p className="font-medium">No links yet</p>
        <p className="text-sm text-muted-foreground">
          Create your first short link with the form above.
        </p>
      </CardContent>
    </Card>
  );
}