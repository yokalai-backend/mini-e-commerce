// Don't forget to import the queries helper up here!

import { ordersHelper } from "../../cores/repository/orders";

const ordersRepo = {
  orders: async (userId: string) => ordersHelper(userId),
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

export default ordersRepo;
