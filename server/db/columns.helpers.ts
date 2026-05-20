import { timestamp } from "drizzle-orm/mysql-core"

export const timestamps = {
  updatedAt: timestamp().defaultNow().notNull().onUpdateNow(),
  createdAt: timestamp().defaultNow().notNull(),
};
