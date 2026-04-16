import productsRepo from "./products.repository";

export async function productsService({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const offset = (page - 1) * limit;

  return await productsRepo.products({ limit, offset });
}

export async function exsName2() {
  // Code goes here
}

export async function exsName3() {
  // Code goes here
}

export async function exsName4() {
  // Code goes here
}

export async function exsName5() {
  // Code goes here
}
