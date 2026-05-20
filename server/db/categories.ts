import { mysqlTable, varchar, serial } from "drizzle-orm/mysql-core";
import { timestamps } from "./columns.helpers";

export const categories = mysqlTable("categories", {
  id: serial().primaryKey(),
  name: varchar({ length: 128 }).notNull(),
  ...timestamps,
});
