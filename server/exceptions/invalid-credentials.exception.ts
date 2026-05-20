export class InvalidCredentialsException extends Error {
  statusCode = 401;
  errorType = "InvalidCredentialsException";

  constructor(credential: string) {
    super(`Invalid ${credential}`);
  }
}
