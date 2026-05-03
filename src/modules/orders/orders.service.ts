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
  const res = await ordersRepo.ordersList(userId);

  if (!res.length) throw Errors.notFound("You don't have any orders yet");

  return res;
}

export async function userOrderItemsService(userId: string, productId: string) {
  const res = await ordersRepo.userOrderItems(userId, productId);

  if (!res) throw Errors.badRequest("No orders found");

  return res;
}
