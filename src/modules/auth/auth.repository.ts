import { loginHelper, registerHelper } from "@repository/auth";
import { RegisterInput, LoginInput } from "@auth/auth.types";

const authRepo = {
  register: async (input: RegisterInput) => registerHelper(input),
  login: async (input: LoginInput) => loginHelper(input),
};

export default authRepo;
