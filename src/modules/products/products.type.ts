export type ProductsProps = {
  id: string;
  user_id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  is_sold: boolean;
  created_at: Date;
  updated_at: Date;
}; // This is the core information of a products.

export type ProductDetailsProps = {
  product_id: string;
  category: string;
  send_from: string;
  rating: number;
  total_solds: number;
}; // This is the details of each product.

export type AddToCartProps = {
  userId: string;
  productId: string;
  quantity: number;
};
