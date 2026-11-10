import { db } from "./index";
import { clicks } from "./schema";

export async function recordClick(linkId: string): Promise<void> {
  await db.insert(clicks).values({ linkId });
}