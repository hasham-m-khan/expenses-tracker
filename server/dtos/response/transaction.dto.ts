import type { transactions, categories } from "../../db/schema";

type TransactionRow = typeof transactions.$inferSelect;
type CategoryRow = typeof categories.$inferSelect;

export type TransactionDto = TransactionRow & {
  categories: CategoryRow[];
};
