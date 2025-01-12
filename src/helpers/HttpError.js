export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const createHttpError = (status, message) => {
  return new HttpError(status, message);
};
