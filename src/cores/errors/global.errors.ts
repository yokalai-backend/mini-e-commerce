import { FastifyReply } from "fastify";
import AppError from "@errors/app.error";
import { ZodError } from "zod";

// Here all type of error being handled, i can modify some errors so it could return response as i wanted.
export default function globalErrors(error: any, rep: FastifyReply) {
  console.error(error);

  if (error instanceof AppError) {
    return rep.notok(error.message, error.code, error.statusCode);
  }

  if (error instanceof ZodError) {
    const errMsg = error.issues.map((e) => e.message);

    return rep.notok("Input invalid", "INVALID_INPUT", 400, errMsg);
  }

  return rep.notok("Something went wrong", "INTERNAL_ERROR");
}
