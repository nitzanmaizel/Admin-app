// utils/filterDates.js

/**
 * Checks if a string matches the dd/mm/yyyy date format.
 * @param {string} str - The string to check.
 * @returns {boolean} - True if the string is a valid date, else false.
 */
export const isValidDate = (str: string) => {
  // Regular expression to match dd/mm/yyyy format
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(str)) return false;

  const match = str.match(regex);
  if (!match) return false;
  const [, day, month, year] = match;
  const date = new Date(`${year}-${month}-${day}`);

  // Check if the date object corresponds to the input
  return date.getFullYear() === parseInt(year, 10) && date.getMonth() + 1 === parseInt(month, 10) && date.getDate() === parseInt(day, 10);
};

/**
 * Filters an array of objects to include only those with keys as valid dates.
 * @param {Array<{ key: string, value: string }>} data - The array to filter.
 * @returns {Array<{ key: string, value: string }>} - The filtered array with date keys.
 */
export const filterDateEntries = (data: { key: string; value: string }[]) => {
  return data.filter((item) => isValidDate(item.key));
};
