import { db } from "../db";
import { transactions, transactionsCategories } from "../db/schema";
import { eq, sum, and } from "drizzle-orm";
import type { CreateTransaction } from "../validators/transaction.validator";

export async function findAllTransactions(userId: number) {
  return db.query.transactions.findMany({
    where: eq(transactions.userId, userId),
    with: {
      categories: {
        with: {
          category: true,
        },
      },
    },
  });
}

export async function findTransactionById(userId: number, id: number) {
  return db.query.transactions.findFirst({
    where: and(eq(transactions.id, id), eq(transactions.userId, userId)),
    with: {
      categories: {
        with: {
          category: true,
        },
      },
    },
  });
}

export async function findTotalByType(
  userId: number,
  type: "expense" | "earning",
) {
  const result = await db
    .select({ total: sum(transactions.amount) })
    .from(transactions)
    .where(and(eq(transactions.type, type), eq(transactions.userId, userId)));

  return Number(result[0]?.total ?? 0);
}

export async function insertTransaction(
  userId: number,
  data: Omit<CreateTransaction, "categories">,
) {
  const [{ insertId }] = await db.insert(transactions).values({
    ...data,
    userId,
    amount: String(data.amount),
    date: new Date(data.date),
  });
  return insertId;
}

export async function insertTransactionCategories(
  transactionId: number,
  categoryIds: number[],
) {
  if (!categoryIds.length) return;
  await db
    .insert(transactionsCategories)
    .values(categoryIds.map((categoryId) => ({ transactionId, categoryId })));
}

export async function deleteTransactionById(id: number) {
  await db.delete(transactions).where(eq(transactions.id, id));
}
