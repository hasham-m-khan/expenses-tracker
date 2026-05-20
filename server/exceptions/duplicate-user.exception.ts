export class DuplicateUserFound extends Error {
  statusCode = 409;
  errorType = 'DuplicateUserFound';

  constructor(message: string) {
    super(message);
  }
}
