import { orderProductsHelper } from "@repository/orders";

const ordersRepo = {
  orders: async (userId: string) => orderProductsHelper(userId),
};

export default ordersRepo;
