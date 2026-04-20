export type Products = {
  id: string;
  user_id: string;
  name: string;
  price: number;
  stock: number;
  is_sold: boolean;
  created_at: Date;
  updated_at: Date;
  image: string;
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
