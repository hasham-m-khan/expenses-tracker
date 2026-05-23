import { Hono } from "hono";
import { logger } from "hono/logger";
import { errorHandler } from "./middleware/error-handler.middleware";
import { authMiddleware } from "./middleware/auth.middleware";
import { requireRole } from "./middleware/role.middleware";
import type { users, sessions } from "./db/schema";

import authRoutes from "./routes/auth.routes";
import transactionsRoutes from "./routes/transactions.routes";
import categoriesRoutes from "./routes/categories.routes";

type User = typeof users.$inferSelect;
type Session = typeof sessions.$inferSelect;

export type AppContext = {
  Variables: {
    user: User;
    session: Session;
  };
};

const app = new Hono<AppContext>();

app.use("*", logger());
app.onError(errorHandler);

const apiRoutes = app
  .basePath("/api/v1")
  .route("/auth", authRoutes)
  .use("/transactions/*", authMiddleware)
  .route("/transactions", transactionsRoutes)
  .use("/categories/*", authMiddleware)
  .route("/categories", categoriesRoutes)
  .use("/admin/*", authMiddleware, requireRole("admin"));
// .route("/admin", adminRoutes)

export type ApiRoutes = typeof apiRoutes;
export default app;
