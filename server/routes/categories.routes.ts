import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as categoriesService from "../services/categories.service";
import { CreateCategoriesSchema } from "../validators/category.validator";
import {
  createApiResponse,
  createErrorResponse,
} from "../dtos/api-response.dto";

const categoriesRoutes = new Hono()

  .get("/", async (c) => {
    const categories = await categoriesService.getCategories();

    const res = createApiResponse(
      categories,
      "Categories retrieved successfully",
      {
        filter: "none",
        totalCount: categories.length,
      },
    );

    return c.json(res);
  })

  .get("/:id{[0-9]+}", async (c) => {
    const id = Number(c.req.param("id"));
    const category = await categoriesService.getCategory(id);

    const res = createApiResponse(
      category,
      `Category with id (${id}) retrieved successfully`,
      { id },
    );

    return c.json(res, 200);
  })

  .post(
    "/",
    zValidator("json", CreateCategoriesSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          createErrorResponse("validation failed", {
            status: 400,
            error: "validation error",
            issues: result.error.issues,
            timestamp: new Date().toISOString(),
          }),
        );
      }
    }),
    async (c) => {
      const req = c.req.valid("json");
      const result = await categoriesService.createCategories(req.categories);

      const res = createApiResponse(
        result.addedCategories,
        "categories created successfully",
        {
          addedCategories: {
            categories: result.addedCategories,
            count: result.addedCategories.length,
          },
          existingCategories: {
            categories: result.existingCategories,
            count: result.existingCategories.length,
          },
          requestedCategories: {
            names: result.requestedCategories,
          },
        },
      );

      return c.json(res, 201);
    },
  )

  .delete("/:id{[0-9]+}", async (c) => {
    const id = Number(c.req.param("id"));
    const deletedCategory = await categoriesService.deleteCategory(id);

    const res = createApiResponse(
      deletedCategory,
      `Category with id (${id}) deleted successfully`,
      { id },
    );

    return c.json(res, 200);
  });

export default categoriesRoutes;
