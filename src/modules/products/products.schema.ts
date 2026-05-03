import { transform, z } from "zod";
import { countries } from "countries-list";

export const productIdSchema = z.object({
  id: z.uuid(),
}); // A first attempt checking if the id is literally an UUID or not.

export const productAmountSchema = z.object({
  quantity: z.coerce
    .number({ error: "Quantity needed" })
    .min(1, { error: "Quantity can't be less than 1" }),
}); // A validation for the requested product quantity.

export const productDetailParser = z
  .object({
    owner_id: z.uuid(),
    owner_name: z.string(),
    product_id: z.uuid(),
    product_name: z.string(),
    price: z.coerce.number(),
    stock: z.coerce.number(),
    image: z.union([z.url(), z.string().regex(/\.(jpg|jpeg|png)$/i)]),
    created_at: z.date().optional(),
    updated_at: z.union([z.date().optional(), z.null()]),
    send_from: z.string(),
    category: z.string(),
    rating: z.coerce.number(),
    total_solds: z.coerce.number(),
    total_reviews: z.coerce.number().optional(),
  })
  .transform((p) => ({
    product: {
      productId: p.product_id,
      productName: p.product_name,
      productPrice: p.price,
      productStock: p.stock,
      productImage: p.image,
    },
    productDetail: {
      sendFrom: p.send_from,
      category: p.category,
      rating: p.rating,
      totalSolds: p.total_solds,
      totalReviews: p.total_reviews,
      createdAt: p.created_at,
      updatedAd: p.updated_at,
    },
    owner: {
      ownerId: p.owner_id,
      ownerName: p.owner_name,
    },
  })); // A parser to only one product.

export type ProductDetailParserProps = z.infer<typeof productDetailParser>;

export const productsDetailsParser = z.array(productDetailParser); // This is parser for group of products in an array.

const validCountries = Object.values(countries).map((e) =>
  e.name.toLocaleLowerCase(),
);

export const validProductCategory = [
  "Food",
  "Electronics",
  "Daily",
  "Fashion",
  "Cosmetics",
  "Drinks",
  "Entertainment",
  "Pet",
  "Service",
  "Others",
];

export const validProductsOrder = [
  "Cheapest",
  "Most expensive",
  "Newest",
  "High rates",
  "Low stock",
];

const orderMap: Record<(typeof validProductsOrder)[number], string> = {
  Cheapest: "p.price ASC",
  "Most expensive": "p.price DESC",
  Newest: "p.created_at DESC",
  "High rates": "pd.rating DESC",
  "Low stock": "p.stock ASC",
};

export const productFilterSchema = z.object({
  category: z.array(z.enum(validProductCategory).optional()),
  order: z
    .preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .enum(validProductsOrder)
        .default("Newest")
        .transform((e) => orderMap[e]),
    )
    .optional(),
});

export type ProductFilterProps = z.infer<typeof productFilterSchema>;

export const addProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(10, { error: "Product name too short" })
    .max(200, { error: "Product name too long" }),
  price: z.coerce
    .number({ error: "Price of the product is needed" })
    .min(1, { error: "Price can't be 0" }),
  stock: z.coerce
    .number({ error: "Stock of the product is needed" })
    .min(1, { error: "Stock can't be 0" }),
  category: z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      if (!val) {
        ctx.addIssue({
          code: "custom",
          message: "Category of the product is needed",
        });

        return;
      }

      if (!validProductCategory.includes(val)) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid product category",
        });
      }
    }),
  image: z.union([z.url(), z.string().regex(/\.(jpg|jpeg|png)$/i)], {
    error: "Only jpg, jpeg, png, url allowed",
  }),
  sendFrom: z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      if (!val) {
        ctx.addIssue({
          code: "custom",
          message: "Sender location of the product is needed",
        });
        return;
      }

      if (!validCountries.includes(val.toLowerCase())) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid country",
        });
      }
    }),
}); // A validation for adding self product.

export type AddProductProps = z.infer<typeof addProductSchema>;
