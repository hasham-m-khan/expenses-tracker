import { z } from 'zod';

const CategoryNameSchema = z
  .string()
  .trim()
  .min(3, 'Category name must be at least 3 characters')
  .max(128, 'Category name must be at mosts 128 characters')
  .regex(/^[a-zA-Z].*/, 'Category must start with a letter');

export const CategorySchema = z.object({
  id: z.number().positive(),
  name: CategoryNameSchema,
});

export const CreateCategoriesSchema = z.object({
  categories: z
    .array(CategoryNameSchema)
    .min(1, 'At least noe category is required')
    .superRefine((names, ctx) => {
      const seen = new Set<string>();

      names.forEach((name, index) => {
        const normalized = name.toLowerCase().trim();
        if (seen.has(normalized)) {
          ctx.addIssue({
            code: 'custom',
            path: [index],
            message: `Duplicate category: ${name}`,
          });
        } else {
          seen.add(normalized);
        }
      });
    }),
});

export type Category = z.infer<typeof CategorySchema>
export type CreateCategories = z.infer<typeof CreateCategoriesSchema>;
