import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { CreateTransactionSchema } from "../validators/transaction.validator";
import * as transactionsService from "../services/transactions.service";
import {
  createApiResponse,
  createErrorResponse,
} from "../dtos/api-response.dto";
import type { AppContext } from "../app";

const transactionsRoutes = new Hono<AppContext>()

  .get("/", async (c) => {
    const user = c.get("user");
    const transactions = await transactionsService.getTransactions(user.id);

    const res = createApiResponse(
      transactions,
      "Transactions retrieved successfully",
      { totalCount: transactions.length },
    );

    return c.json(res, 200);
  })

  .get("/total-spent", async (c) => {
    const user = c.get("user");
    const res = createApiResponse(
      await transactionsService.getTotalSpent(user.id),
      "Expenses total retrieved successfully",
      { range: "all" },
    );

    return c.json(res, 200);
  })

  .get("/total-earned", async (c) => {
    const user = c.get("user");
    const res = createApiResponse(
      await transactionsService.getTotalEarned(user.id),
      "Income total retrieved successfully",
      { range: "all" },
    );

    return c.json(res, 200);
  })

  .get("/overall-status", async (c) => {
    const user = c.get("user");
    const res = createApiResponse(
      await transactionsService.getOverallStatus(user.id),
      "Overall status retrieved successfully",
      { range: "all" },
    );

    return c.json(res, 200);
  })

  .get("/:id{[0-9]+}", async (c) => {
    const user = c.get("user");
    const id = Number(c.req.param("id"));

    const res = createApiResponse(
      await transactionsService.getTransaction(user.id, id),
      "Transaction retrieved successfully",
      { id },
    );

    return c.json(res, 200);
  })

  .post(
    "/",
    zValidator("json", CreateTransactionSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          createErrorResponse("Validation failed", {
            timestamp: new Date().toISOString(),
            status: 400,
            error: "validation error",
            issues: result.error.issues,
          }),
          400,
        );
      }
    }),
    async (c) => {
      const user = c.get("user");
      const transaction = c.req.valid("json");

      const res = createApiResponse(
        await transactionsService.createTransaction(user.id, transaction),
        "Transaction created successfully",
        {},
      );

      return c.json(res, 201);
    },
  )

  .delete("/:id{[0-9]+}", async (c) => {
    const user = c.get("user");
    const id = Number(c.req.param("id"));

    const res = createApiResponse(
      await transactionsService.deleteTransaction(user.id, id),
      "Transaction deleted successfully",
      { id },
    );

    return c.json(res, 200);
  });

export default transactionsRoutes;
