import {
  orderProductsHelper,
  ordersListHelper,
  userOrderItemsHelper,
  userOrdersHelper,
} from "@repository/orders";

const ordersRepo = {
  orders: async (userId: string) => orderProductsHelper(userId),
  userOrders: async (userId: string, orderId: string) =>
    userOrdersHelper(userId, orderId),
  ordersList: async (userId: string) => ordersListHelper(userId),
  userOrderItems: async (userId: string, productId: string) =>
    userOrderItemsHelper(userId, productId),
};

export default ordersRepo;
