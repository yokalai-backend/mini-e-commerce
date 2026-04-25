import Errors from "@errors/errors";
import userRepo from "./user.repository";
import { userParser } from "./user.schema";

export async function userService(userId: string) {
  const result = await userRepo.user(userId);

  if (!result) throw Errors.notFound("Sorry user not found try again later");

  return userParser.parse(result);
}
