import { QueryClient } from '@tanstack/react-query';

/**
 * Cancel ongoing queries and return the current cache data for rollback purposes.
 * @param queryClient - The QueryClient instance.
 * @param queryKey - The key of the query to cancel and fetch data for.
 * @returns - The previous cached data for rollback.
 */
export const cancelQueryAndGetPreviousData = async <T>(queryClient: QueryClient, queryKey: string[]): Promise<T | undefined> => {
  await queryClient.cancelQueries({ queryKey });
  return queryClient.getQueryData<T>(queryKey);
};

/**
 * Update the query cache with new data.
 * @param queryClient - The QueryClient instance.
 * @param queryKey - The key of the query to update.
 * @param updater - The function to update the cache data.
 */
export const updateQueryCache = <T>(
  queryClient: QueryClient,
  queryKey: string[],
  updater: (oldData: T | undefined) => T | undefined,
): void => {
  queryClient.setQueryData(queryKey, updater);
};

/**
 * Roll back the query cache to its previous state.
 * @param queryClient - The QueryClient instance.
 * @param queryKey - The key of the query to restore.
 * @param previousData - The previous data to restore in the cache.
 */
export const rollbackQueryCache = <T>(queryClient: QueryClient, queryKey: string[], previousData: T): void => {
  if (previousData) {
    queryClient.setQueryData(queryKey, previousData);
  }
};
