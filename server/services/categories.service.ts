import { EntityNotFoundException } from "../exceptions/entity-not-found.exception";
import * as categoriesRepo from "../repositories/categories.repository";

export async function getCategories() {
  return categoriesRepo.findAllCategories();
}

export async function getCategory(id: number) {
  const category = await categoriesRepo.findCategoryById(id);
  if (!category) throw new EntityNotFoundException("category", "id", id);
  return category;
}

export async function createCategories(names: string[]) {
  const all = await categoriesRepo.findAllCategories();

  const existingCategories = all.filter((c) =>
    names.some((name) => name.toLowerCase() === c.name.toLowerCase()),
  );

  const newNames = names.filter(
    (name) => !all.some((c) => c.name.toLowerCase() === name.toLowerCase()),
  );

  if (newNames.length) {
    await categoriesRepo.insertCategories(newNames);
  }

  const updated = await categoriesRepo.findAllCategories();
  const addedCategories = updated.filter((c) =>
    newNames.some((name) => name.toLowerCase() === c.name.toLowerCase()),
  );

  return { addedCategories, existingCategories, requestedCategories: names };
}

export async function deleteCategory(id: number) {
  const category = await categoriesRepo.findCategoryById(id);
  if (!category) throw new EntityNotFoundException("category", "id", id);
  await categoriesRepo.deleteCategoryById(id);
  return category;
}
