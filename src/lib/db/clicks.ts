import { and, count, eq, gte, sql } from "drizzle-orm";
import { db } from "./index";
import { clicks } from "./schema";

export type DailyClicks = { date: string; clicks: number };

export async function recordClick(linkId: string): Promise<void> {
  await db.insert(clicks).values({ linkId });
}

/**
 * Clicks per UTC day for the last `days` days (today included), with missing
 * days filled with 0. Callers must verify the user owns the link first.
 */
export async function getClicksPerDay(
  linkId: string,
  days: number,
): Promise<DailyClicks[]> {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (days - 1)),
  );

  const day = sql<string>`to_char(${clicks.clickedAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`;

  const rows = await db
    .select({ day, total: count() })
    .from(clicks)
    .where(and(eq(clicks.linkId, linkId), gte(clicks.clickedAt, start)))
    .groupBy(day);

  const totals = new Map(rows.map((row) => [row.day, row.total]));

  return Array.from({ length: days }, (_, offset) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + offset);
    const key = date.toISOString().slice(0, 10);
    return { date: key, clicks: totals.get(key) ?? 0 };
  });
}