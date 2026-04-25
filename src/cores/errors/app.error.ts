// This are error class it used for helps me handling errors in a clean way and consistent.
export default class AppError extends Error {
  code: string;
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, code: string, statusCode: number) {
    super(message);

    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
