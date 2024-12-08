import { useMutation, useQueryClient } from '@tanstack/react-query';
import fetchAPI from '@/services/apiServices';
import { IDocData } from '@/types/DocTypes';

async function createDoc(docData: IDocData): Promise<IDocData> {
  const sheet = await fetchAPI<IDocData, IDocData>('/doc', {
    method: 'POST',
    body: docData,
  });
  return sheet;
}

export function useCreateDocMutation() {
  const queryClient = useQueryClient();

  return useMutation<IDocData, Error, IDocData>({
    mutationFn: createDoc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['docs'] });
    },
  });
}
