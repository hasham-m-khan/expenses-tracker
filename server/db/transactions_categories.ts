import {
  mysqlTable,
  bigint,
  primaryKey,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { transactions } from "./transactions";
import { categories } from "./categories";

export const transactionsCategories = mysqlTable(
  "transactions_categories",
  {
    transactionId: bigint({ mode: "number", unsigned: true }).notNull(),
    categoryId: bigint({ mode: "number", unsigned: true }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.transactionId, t.categoryId] }),
    foreignKey({
      columns: [t.transactionId],
      foreignColumns: [transactions.id],
    }),
    foreignKey({ columns: [t.categoryId], foreignColumns: [categories.id] }),
  ],
);
