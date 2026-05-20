import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { timestamps } from "./columns.helpers";

export const users = mysqlTable("users", {
  id: serial().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  ...timestamps,
});
