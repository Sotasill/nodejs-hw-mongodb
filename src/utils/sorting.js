export const getSortOptions = ({ sortBy = 'name', sortOrder = 'asc' }) => {
  const order = sortOrder.toLowerCase() === 'desc' ? -1 : 1;
  const sortOptions = {};
  sortOptions[sortBy] = order;

  return sortOptions;
};
