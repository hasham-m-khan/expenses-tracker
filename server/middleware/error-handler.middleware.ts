import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { EntityNotFoundException } from "../exceptions/entity-not-found.exception";
import { DuplicateUserFound } from "../exceptions/duplicate-user.exception";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials.exception";

export function errorHandler(err: Error, c: Context) {
  if (err instanceof EntityNotFoundException) {
    return c.json(
      {
        success: false,
        message: err.message,
        data: [],
        metadata: {
          timestamp: new Date().toISOString(),
          status: 404,
          error: err.errorType,
        },
      },
      404,
    );
  }

  if (err instanceof DuplicateUserFound) {
    return c.json(
      {
        success: false,
        message: err.message,
        data: [],
        metadata: {
          timestamp: new Date().toISOString(),
          status: 409,
          error: err.errorType,
        },
      },
      409,
    );
  }

  if (err instanceof InvalidCredentialsException) {
    return c.json(
      {
        success: false,
        message: err.message,
        data: [],
        metadata: {
          timestamp: new Date().toISOString(),
          status: 400,
          error: "validation error",
        },
      },
      400,
    );
  }

  if (err instanceof ZodError) {
    return c.json(
      {
        success: false,
        message: "Validation failed",
        data: [],
        metadata: {
          timestamp: new Date().toISOString(),
          status: 400,
          error: "validation error",
          issues: err.issues,
        },
      },
      400,
    );
  }

  if (err instanceof HTTPException) {
    return c.json({
      success: false,
      message: err.message,
      data: [],
      metadata: {
        timestamp: new Date().toISOString(),
        status: err.status,
        error: "http error",
      },
    });
  }

  return c.json(
    {
      success: false,
      message: "Internal server error",
      data: [],
      metadata: {
        timestamp: new Date().toISOString(),
        status: 500,
        error: "unknown error",
      },
    },
    500,
  );
}
