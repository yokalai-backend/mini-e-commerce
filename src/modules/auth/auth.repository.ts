import { registerRepo, loginRepo } from "@repository/auth";
import { RegisterInput, LoginInput } from "@auth/auth.types";

const authRepo = {
  register: async (input: RegisterInput) => registerRepo(input),
  login: async (input: LoginInput) => loginRepo(input),
};

export default authRepo;
