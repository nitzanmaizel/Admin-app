export function searchItemsByKey<T>(items: T[], query: string, keys: Array<keyof T>): T[] {
  if (!query) {
    return items;
  }

  const lowerCaseQuery = query.toLowerCase();

  return items.filter((item) =>
    keys.some((key) => {
      const value = item[key];

      if (value === null || value === undefined) {
        return false;
      }

      const valueString = String(value).toLowerCase();

      return valueString.includes(lowerCaseQuery);
    })
  );
}
