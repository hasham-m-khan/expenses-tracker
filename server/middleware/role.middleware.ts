import type { AppContext } from "../app";
import type { MiddlewareHandler } from "hono";

type Role = "admin" | "staff" | "user";

export const requireRole = (
  ...roles: Role[]
): MiddlewareHandler<AppContext> => {
  return async (c, next) => {
    const user = c.get("user");
    if (!roles.includes(user.role as Role)) {
      return c.json({ sucess: false, message: "Forbidden" }, 403);
    }
    await next();
  };
};
