import {
  orderProductsHelper,
  ordersListHelper,
  userOrdersHelper,
} from "@repository/orders";

const ordersRepo = {
  orders: async (userId: string) => orderProductsHelper(userId),
  userOrders: async (userId: string, orderId: string) =>
    userOrdersHelper(userId, orderId),
  ordersList: async (userId: string) => ordersListHelper(userId),
};

export default ordersRepo;
