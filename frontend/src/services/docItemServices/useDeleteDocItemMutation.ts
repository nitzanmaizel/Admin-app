import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GridRowSelectionModel } from '@mui/x-data-grid';

import fetchAPI from '../apiServices';

import { useSnackbar } from '@/hooks/useSnackbar';

import { IDocData } from '@/types/DocTypes';
import { ApiResponse } from '@/types/ApiTypes';

export const deleteDocItems = async (docId: string, itemIds: GridRowSelectionModel): Promise<{ message: string }> => {
  try {
    if (!docId) return { message: 'DocId is required' };
    if (itemIds.length === 0) return { message: 'itemIds is required' };

    const res: ApiResponse<string> = await fetchAPI(`/doc-item/${docId}`, { method: 'DELETE', body: { itemDocIds: itemIds } });
    if (res.status === 'error') {
      return { message: res.message || 'Error deleting items' };
    }
    if (res.status === 'success') {
      return { message: res.data || 'Successfully deleted items' };
    }

    return { message: 'Not Supposed to happen' };
  } catch (error) {
    console.log('Error deleting items', error);
    return { message: (error as unknown as { message?: string })?.message || 'Error deleting items' };
  }
};

export const useDeleteDocItemMutation = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<{ message: string }, Error, { docId: string; itemIds: GridRowSelectionModel }, { previousDoc: IDocData | undefined }>({
    mutationFn: async ({ docId, itemIds }) => deleteDocItems(docId, itemIds),
    onMutate: async ({ docId, itemIds }) => {
      await queryClient.cancelQueries({ queryKey: ['doc', docId] });

      const previousDoc = queryClient.getQueryData<IDocData>(['doc', docId]);

      queryClient.setQueryData<IDocData>(['doc', docId], (oldData) => {
        if (!oldData || !oldData.docItems) return oldData;
        const updatedItems = oldData.docItems.filter((item) => !itemIds.includes(item.docItemId));
        return { ...oldData, docItems: updatedItems };
      });

      return { previousDoc };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDoc) {
        queryClient.setQueryData(['doc'], context.previousDoc);
      }
    },
    onSuccess: (data) => {
      showSnackbar(data.message, 'success');
    },
    onSettled: (_data, _error, { docId }) => {
      queryClient.invalidateQueries({ queryKey: ['doc', docId] });
    },
  });
};
