export const getFilterOptions = ({ type, isFavourite }) => {
  const filterOptions = {};

  if (type) {
    filterOptions.contactType = type;
  }

  if (isFavourite !== undefined) {
    filterOptions.isFavourite = isFavourite === 'true';
  }

  return filterOptions;
};
