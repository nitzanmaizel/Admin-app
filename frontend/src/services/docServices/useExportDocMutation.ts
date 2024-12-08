import { useMutation } from '@tanstack/react-query';
import fetchAPI from '@/services/apiServices';
import { ApiResponse } from '@/types/ApiTypes';

export function useExportDocMutation() {
  return useMutation<string, Error, string>({
    mutationFn: async (docId: string): Promise<string> => {
      const response = await fetchAPI<ApiResponse<string>>(`/google-sheet/${docId}`);
      return response.data ?? '';
    },
  });
}
