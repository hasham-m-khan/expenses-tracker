export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metadata: Record<string, unknown>;
}

export function createApiResponse<T>(
  data: T,
  message: string = "data retrieved successfully",
  metadata: Record<string, unknown> = {},
  success: boolean = true,
): ApiResponse<typeof data> {
  const response: ApiResponse<T> = {
    success,
    message,
    data,
    metadata,
  };

  return response;
}

export function createErrorResponse(
  message: string,
  metadata: Record<string, unknown> = {},
): ApiResponse<null> {
  const response: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    metadata,
  };

  return response;
}
