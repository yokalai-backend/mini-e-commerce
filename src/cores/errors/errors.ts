import AppError from "./app.error";

const Errors = {
  badRequest: (msg: string, code?: string) =>
    new AppError(msg, code ?? "BAD_REQUEST", 400),
  notFound: (msg: string, code?: string) =>
    new AppError(msg, code ?? "NOT_FOUND", 404),
  conflict: (msg: string, code?: string) =>
    new AppError(msg, code ?? "CONFLICT", 409),
  authorization: (msg: string, code?: string) =>
    new AppError(msg, code ?? "AUTHORIZATION", 401),
};

export default Errors;
