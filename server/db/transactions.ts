import {
  date,
  decimal,
  mysqlTable,
  serial,
  varchar,
  bigint,
} from "drizzle-orm/mysql-core";
import { timestamps } from "./columns.helpers";
import { users } from "./users";

export const transactions = mysqlTable("transactions", {
  id: serial().primaryKey(),
  userId: bigint({ mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  date: date().notNull(),
  title: varchar({ length: 128 }).notNull(),
  amount: decimal({ precision: 13, scale: 2 }).notNull(),
  type: varchar({ length: 7, enum: ["expense", "earning"] }).notNull(),
  ...timestamps,
});
