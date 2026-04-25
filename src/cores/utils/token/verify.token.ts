import env from "@config/env";
import Errors from "@errors/errors";
import { Roles } from "@shared/types";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

// A basic token verifying where i use cookies to make it simpler and safer, it's not a plugin tho because i want to seperate some endroutes to be strict and some are not.
export default async function verifyToken(req: any, rep: any) {
  const token = req.cookies.accessToken;

  if (!token) throw Errors.authorization("No token provided", "NO_TOKEN");

  try {
    const decoded = jwt.verify(token, env.ACCESS_SECRET) as {
      id: string;
      username: string;
      role: Roles;
    };

    req.user = decoded;
  } catch (error) {
    if (error instanceof TokenExpiredError)
      throw Errors.authorization("Token expired", "TOKEN_EXPIRED");

    if (error instanceof JsonWebTokenError)
      throw Errors.authorization("Invalid token", "TOKEN_INVALID");

    throw error;
  }
}
