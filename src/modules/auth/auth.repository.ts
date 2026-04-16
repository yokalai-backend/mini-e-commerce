import { registerRepo, loginRepo } from "../../cores/repository/auth";
import { RegisterInput, LoginInput } from "./auth.types";

const authRepo = {
  register: async (input: RegisterInput) => registerRepo(input),
  login: async (input: LoginInput) => loginRepo(input),
  exf3: async () => {
    // Code goes here
  },
  exf4: async () => {
    // Code goes here
  },
  exf5: async () => {
    // Code goes here
  },
};

export default authRepo;
