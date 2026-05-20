import { db } from "../db";
import { sessions, users } from "../db/schema";
import { eq } from "drizzle-orm";

export async function findSessionWithUser(sessionId: string) {
  const result = await db
    .select()
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!result.length || !result[0]) return null;

  return { session: result[0].sessions, user: result[0].users };
}

export async function insertSession(
  id: string,
  userId: number,
  expiresAt: Date,
) {
  await db.insert(sessions).values({ id, userId, expiresAt });
}

export async function updateSessionExpiry(sessionId: string, expiresAt: Date) {
  await db
    .update(sessions)
    .set({ expiresAt })
    .where(eq(sessions.id, sessionId));
}

export async function deleteSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
