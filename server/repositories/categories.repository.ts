import { db } from '../db';
import { categories } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function findAllCategories() {
  return db.select().from(categories);
}

export async function findCategoryById(id: number) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function findCategoriesByNames(names: string[]) {
  return db.select().from(categories);
}

export async function insertCategories(names: string[]) {
  await db.insert(categories).values(names.map(name => ({ name })));
}

export async function deleteCategoryById(id: number) {
  await db.delete(categories).where(eq(categories.id, id));
}
