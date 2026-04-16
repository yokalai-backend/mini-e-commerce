import { FastifyReply } from "fastify";
import AppError from "./app.error";
import { ZodError } from "zod";

export default function globalErrors(error: any, rep: FastifyReply) {
  console.error(error);

  if (error instanceof AppError) {
    return rep.notok(error.message, error.code, error.statusCode);
  }

  if (error instanceof ZodError) {
    const errMsg = error.issues.map((e) => e.message);

    return rep.notok(errMsg, "INVALID_INPUT", 400);
  }

  return rep.notok("Something went wrong", "INTERNAL_ERROR");
}
