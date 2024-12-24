export const calculatePagination = ({ page = 1, perPage = 10, totalItems }) => {
  const currentPage = parseInt(page);
  const itemsPerPage = parseInt(perPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    page: currentPage,
    perPage: itemsPerPage,
    totalItems,
    totalPages,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
};
