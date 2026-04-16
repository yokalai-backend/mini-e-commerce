// Don't forget to import the queries helper up here!

import { productsHelper } from "../../cores/repository/products";
import { PaginationProps } from "../../shared/types";

const productsRepo = {
  products: async (pagination: PaginationProps) => productsHelper(pagination),
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

export default productsRepo;
