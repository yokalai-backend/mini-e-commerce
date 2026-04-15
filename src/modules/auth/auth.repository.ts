import registerRepo from "../../cores/repository/auth/registerRepo";
import { RegisterInput } from "./auth.types";

const authRepo = {
  register: async (input: RegisterInput) => registerRepo(input),
  exf2: async () => {
    // Code goes here
  },
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
