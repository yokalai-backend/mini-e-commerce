export default function buildPagination(
  total: number,
  page: number,
  limit: number,
) {
  const totalPages = Math.ceil(total / limit);

  const hasNext = page < totalPages;

  const hasPrev = page > 1;

  return { totalPages, hasNext, hasPrev };
}
