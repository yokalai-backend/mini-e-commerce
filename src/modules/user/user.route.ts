import verifyTokenPlugin from "@utils/token/verify.token.plugin";
import { FastifyInstance } from "fastify";
import {
  addComment,
  likesComment,
  uploadImg,
  user,
} from "@user/user.controller";
import validateParams from "@utils/preValidation/validate.params";
import { productIdSchema } from "@products/products.schema";
import validateBody from "@utils/preValidation/validate.body";
import { commentSchema } from "./user.schema";

export default function userRoute(app: FastifyInstance) {
  app.register(verifyTokenPlugin); // User need to login first in order to access this route.

  app.get("/", user); // Get the user's information

  app.post(
    "/comment/:id",
    {
      preValidation: [
        validateParams(productIdSchema),
        validateBody(commentSchema),
      ],
    },
    addComment,
  );

  app.patch(
    "/comments/:id",
    { preValidation: validateParams(productIdSchema) },
    likesComment,
  );

  app.post("/uploads", uploadImg);
}
