import { mysqlTable, serial, varchar, datetime, bigint } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const sessions = mysqlTable('sessions', {
  id: varchar({ length: 255}).primaryKey(),
  userId: bigint({ mode: 'number', unsigned: true }).notNull()
    .references(() => users.id),
  expiresAt: datetime().notNull(),
})