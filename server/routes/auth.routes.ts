import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import * as authService from "../services/auth.service";
import { authMiddleware } from "../middleware/auth.middleware";
import type { AppContext } from "../app";
import { createApiResponse } from "../dtos/api-response.dto";
import { toUserDto } from "../dtos/response/user.dto";

const authRoutes = new Hono<AppContext>()

  .post("/register", async (c) => {
    const { email, password, firstName, lastName } = await c.req.json();

    const userId = await authService.registerUser(
      email,
      password,
      firstName,
      lastName,
    );
    const { sessionId, expiresAt } = await authService.createSession(userId);

    setCookie(c, "session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      expires: expiresAt,
      path: "/",
    });

    return c.json(createApiResponse(null, "user registered successfully"));
  })

  .post("/login", async (c) => {
    const { email, password } = await c.req.json();

    const user = await authService.loginUser(email, password);
    const { sessionId, expiresAt } = await authService.createSession(user.id);

    setCookie(c, "session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      expires: expiresAt,
      path: "/",
    });

    return c.json(createApiResponse(user, "login successful"));
  })

  .post("/logout", async (c) => {
    const sessionId = getCookie(c, "session");
    if (sessionId) await authService.invalidateSession(sessionId);
    deleteCookie(c, "session");

    return c.json(createApiResponse(null, "logout successful"));
  })

  .get("/me", authMiddleware, (c) => {
    const user = c.get("user");
    return c.json(createApiResponse(toUserDto(user)), 200);
  });

export default authRoutes;
