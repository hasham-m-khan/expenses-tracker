export class EntityNotFoundException extends Error {
  statusCode = 404;
  errorType = 'EntityNotFoundException';

  constructor(entity: string, field: string | null = null, value: number | null = null) {
    const message = field == null 
      ? `${entity} not found.`
      : `${entity} with ${field} (${value}) not found.`;
    super(message);
  }
}
