import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export async function findUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result[0] ?? null;
}

export async function insertUser(
  email: string,
  passwordHash: string,
  firstName: string,
  lastName: string,
) {
  const [{ insertId }] = await db
    .insert(users)
    .values({ email, passwordHash, firstName, lastName });
  return insertId;
}
