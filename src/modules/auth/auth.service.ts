import bc from "bcrypt";
import authRepo from "./auth.repository";
import { LoginInput, RegisterInput } from "./auth.types";
import Errors from "../../cores/errors/errors";
import { loginHelper, refreshTokenHelper } from "../../cores/repository/auth";

export async function registerService({
  username,
  password,
  email,
}: RegisterInput) {
  const hashPassword = await bc.hash(password, 10);

  try {
    return await authRepo.register({ username, password: hashPassword, email });
  } catch (error: any) {
    if (error.code === "23505") {
      throw Errors.conflict("Email not available", "EMAIL_DUPLICATE");
    }

    throw error;
  }
}

export async function loginService(input: LoginInput, deviceId: string) {
  const result = await authRepo.login(input);

  if (!result)
    throw Errors.authorization(
      "Password or email invalid",
      "INVALID_CREDENTIALS",
    );

  const validPassword = await bc.compare(input.password, result.hash);

  if (!validPassword)
    throw Errors.authorization(
      "Password or email invalid",
      "INVALID_CREDENTIALS",
    );

  const { hash, ...payload } = result;

  return await loginHelper(payload, deviceId);
}

export async function exsName3() {
  // Code goes here
}

export async function refreshTokenService(token: string, deviceId: string) {
  console.log(
    "At refresh token check if input corrects: ",
    token,
    " and ",
    deviceId,
  );

  if (!token || !deviceId) throw Errors.badRequest("Login first");

  return await refreshTokenHelper(token, deviceId);
}

export async function exsName5() {
  // Code goes here
}
