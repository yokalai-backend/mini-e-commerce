export type Products = {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
};

export type ProductDetailed = {
  product_id: string;
  category: string;
  send_from: string;
  rating: number;
  total_solds: number;
};

export type AddToCart = {
  userId: string;
  productId: string;
  quantity: number;
};
