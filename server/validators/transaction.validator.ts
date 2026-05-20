import { z } from "zod";
import { CategorySchema } from "./category.validator";

export const TransactionSchema = z.object({
  id: z.number().int().positive().min(1),
  date: z.iso.date(),
  title: z.string().min(3).max(128),
  amount: z.string(),
  type: z.literal(["expense", "earning"]),
  categories: z.array(CategorySchema),
});

export const CreateTransactionSchema = TransactionSchema.omit({ id: true });

export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
