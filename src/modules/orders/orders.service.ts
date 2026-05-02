import Errors from "@errors/errors";
import ordersRepo from "./orders.repository";
export async function ordersService(userId: string) {
  return await ordersRepo.orders(userId);
}

export async function userOrdersService(userId: string, orderId: string) {
  if (!orderId) throw Errors.notFound("Order not found");

  const res = await ordersRepo.userOrders(userId, orderId);

  if (!res) throw Errors.notFound("Order not found");

  return res;
}

export async function ordersListService(userId: string) {
  return await ordersRepo.ordersList(userId);
}

export async function exsName4() {
  // Code goes here
}

export async function exsName5() {
  // Code goes here
}
