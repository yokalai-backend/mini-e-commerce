import { userHelper } from "@repository/user";

const userRepo = {
  user: async (userId: string) => userHelper(userId),
};

export default userRepo;
