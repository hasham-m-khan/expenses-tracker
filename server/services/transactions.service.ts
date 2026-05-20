import { EntityNotFoundException } from "../exceptions/entity-not-found.exception";
import * as transactionsRepo from "../repositories/transactions.repository";
import * as categoriesRepo from "../repositories/categories.repository";
import type { CreateTransaction } from "../validators/transaction.validator";
import type { TransactionDto } from "../dtos/response/transaction.dto";

type RawTransaction = Awaited<
  ReturnType<typeof transactionsRepo.findTransactionById>
>;

function flattenCategories(
  transaction: NonNullable<RawTransaction>,
): TransactionDto {
  return {
    ...transaction,
    categories: transaction.categories.map((tc) => tc.category),
  };
}

export async function getTransactions(userId: number) {
  const transactions = transactionsRepo.findAllTransactions(userId);
  return (await transactions).map((t) => flattenCategories(t)!);
}

export async function getTransaction(userId: number, id: number) {
  const transaction = await transactionsRepo.findTransactionById(userId, id);
  if (!transaction) throw new EntityNotFoundException("transaction", "id", id);
  return flattenCategories(transaction)!;
}

export async function getTotalSpent(userId: number) {
  const totalSpent = Number(
    (await transactionsRepo.findTotalByType(userId, "expense")).toFixed(2),
  );
  return { totalSpent };
}

export async function getTotalEarned(userId: number) {
  const totalEarned = Number(
    (await transactionsRepo.findTotalByType(userId, "earning")).toFixed(2),
  );
  return { totalEarned };
}

export async function getOverallStatus(userId: number) {
  const [{ totalSpent }, { totalEarned }] = await Promise.all([
    getTotalSpent(userId),
    getTotalEarned(userId),
  ]);

  return {
    totalExpenses: totalSpent,
    totalEarnings: totalEarned,
    totalSavings: Number((totalEarned - totalSpent).toFixed(2)),
  };
}

export async function createTransaction(
  userId: number,
  data: CreateTransaction,
) {
  const { categories: categoryNames, ...transactionData } = data;

  const transactionId = await transactionsRepo.insertTransaction(
    userId,
    transactionData,
  );

  if (categoryNames?.length) {
    const allCategories = await categoriesRepo.findAllCategories();
    const matchedIds = allCategories
      .filter((c) =>
        categoryNames.some(
          (cat: { name: string }) =>
            cat.name.toLowerCase() === c.name.toLowerCase(),
        ),
      )
      .map((c) => c.id);

    await transactionsRepo.insertTransactionCategories(
      transactionId,
      matchedIds,
    );
  }

  const transaction = await transactionsRepo.findTransactionById(
    transactionId,
    userId,
  );

  if (!transaction)
    throw new EntityNotFoundException("transaction", "id", transactionId);
  return flattenCategories(transaction);
}

export async function deleteTransaction(
  userId: number,
  id: number,
): Promise<TransactionDto> {
  const transaction = await transactionsRepo.findTransactionById(userId, id);
  if (!transaction) throw new EntityNotFoundException("transaction", "id", id);
  await transactionsRepo.deleteTransactionById(id);
  return flattenCategories(transaction);
}
