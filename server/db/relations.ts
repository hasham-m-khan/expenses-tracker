import { relations } from "drizzle-orm";
import { users } from "./users";
import { transactions } from "./transactions";
import { categories } from "./categories";
import { transactionsCategories } from "./transactions_categories";

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(
  transactions,
  ({ many, one }) => ({
    categories: many(transactionsCategories),
    user: one(users, {
      fields: [transactions.userId],
      references: [users.id],
    }),
  }),
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactionsCategories),
}));

export const transactionsCategoriesRelations = relations(
  transactionsCategories,
  ({ one }) => ({
    transaction: one(transactions, {
      fields: [transactionsCategories.transactionId],
      references: [transactions.id],
    }),
    category: one(categories, {
      fields: [transactionsCategories.categoryId],
      references: [categories.id],
    }),
  }),
);
