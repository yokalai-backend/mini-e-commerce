import { FastifyInstance } from "fastify";
import validateParams from "@utils/preValidation/validate.params";
import validateQuery from "@utils/preValidation/validate.query";
import verifyToken from "@utils/token/verify.token";
import validateBody from "@utils/preValidation/validate.body";
import { productIdSchema } from "@products/products.schema";
import { productAmountSchema } from "@products/products.schema";
import {
  addProductsToCart,
  addProductToCart,
  getProductsCart,
  mergeUserCart,
  removeCartById,
  removeFromCart,
} from "@cart/cart.controller";
import { addUserCartSchema, userCartSchema } from "@cart/cart.schema";

export default function cartRoute(app: FastifyInstance) {
  app.post(
    "/:id",
    {
      preHandler: verifyToken,
      preValidation: [
        validateParams(productIdSchema),
        validateQuery(productAmountSchema),
      ],
    },
    addProductToCart,
  ); // This endpoint use for adding the product user has been added to the cart when the user already login.

  app.delete("/", { preHandler: verifyToken }, removeFromCart); // Remove products in cart.

  app.delete(
    "/:id",
    { preValidation: validateParams(productIdSchema), preHandler: verifyToken },
    removeCartById,
  ); // Remove products in cart.

  app.post(
    "/add",
    {
      preValidation: validateBody(addUserCartSchema),
      preHandler: verifyToken,
    },
    addProductsToCart,
  ); // Add all of the products the user have in their cart.

  app.post(
    "/",
    { preValidation: validateBody(addUserCartSchema) },
    getProductsCart,
  ); // This get all of the products from user's cart so then the FE could render the products image or show the information.

  app.post(
    "/merge",
    {
      preValidation: validateBody(userCartSchema),
      preHandler: verifyToken,
    },
    mergeUserCart,
  ); // Merge user's real cart when already login with the current local cart.
}
