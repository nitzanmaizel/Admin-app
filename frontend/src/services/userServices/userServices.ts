import { QueryClient, useQuery } from '@tanstack/react-query';
import fetchAPI from '../apiServices';
import { RIUsersType, UserData } from '@/types/UserTypes';

const emptyUsersData: RIUsersType = { users: [], total: 0, limit: 0, page: 0 };

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { users, total, limit, page } = await fetchAPI<RIUsersType>('/user');
      return { users, total, limit, page };
    },
  });
}

export function useUserQuery(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const user = await fetchAPI<UserData>(`/user/profile`);
      return user;
    },
  });
}

export async function cancelAndGetPreviousUsersData(
  queryClient: QueryClient,
): Promise<{ previousData: RIUsersType; previousUsers: UserData[] }> {
  await queryClient.cancelQueries({ queryKey: ['users'] });
  const previousData = queryClient.getQueryData<RIUsersType>(['users']) || emptyUsersData;
  const previousUsers = previousData.users;
  return { previousData, previousUsers };
}
