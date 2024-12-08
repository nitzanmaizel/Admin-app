import { useQuery } from '@tanstack/react-query';
import fetchAPI from '@/services/apiServices';
import { IDocData } from '@/types/DocTypes';
import { ApiResponse } from '@/types/ApiTypes';

export const defaultDocData: IDocData = {
  docId: '',
  title: 'תע"מ 24',
  description: 'דוח 1 מתאריכים 30/11/24 עד 15/12/24',
  databaseModel: '',
  docItems: [],
  additionalData: [],
  columns: [],
};

export function useDocQuery(docId: string) {
  return useQuery<IDocData, Error>({
    queryKey: ['doc', docId],
    queryFn: async (): Promise<IDocData> => {
      const response = await fetchAPI<ApiResponse<IDocData>>(`/doc/${docId}`);
      return response.data ?? defaultDocData;
    },
    enabled: !!docId,
  });
}
