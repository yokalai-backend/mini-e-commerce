import bc from "bcrypt";
import authRepo from "./auth.repository";
import { RegisterInput } from "./auth.types";
import Errors from "../../cores/errors/errors";

export async function registerService(input: RegisterInput) {
  const { username, password, email } = input;

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

export async function exsName2() {
  // Code goes here
}

export async function exsName3() {
  // Code goes here
}

export async function exsName4() {
  // Code goes here
}

export async function exsName5() {
  // Code goes here
}
