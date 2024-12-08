import { useMutation, useQueryClient } from '@tanstack/react-query';
import fetchAPI from '../apiServices';

import { useSnackbar } from '@/hooks/useSnackbar';

import { ApiResponse } from '@/types/ApiTypes';
import { IDocData, IDocItemData } from '@/types/DocTypes';

export const editDocItem = async (
  docId: string,
  docItemId: string,
  additionalData: { [key: string]: string }[]
): Promise<{ message: string; updatedItem?: IDocItemData }> => {
  try {
    if (!docId) return { message: 'DocId is required' };
    if (!docItemId) return { message: 'DocItemId is required' };
    if (!additionalData) return { message: 'AdditionalData is required' };

    const res: ApiResponse<IDocItemData> = await fetchAPI(`/doc-item/${docId}/${docItemId}`, {
      method: 'PUT',
      body: { additionalData },
    });

    if (res.status === 'error') {
      throw new Error(res.message || 'Error updating item');
    }

    if (res.status === 'success') {
      return { message: res.message || 'Successfully updated item', updatedItem: res.data };
    }

    return { message: 'Unexpected response from server' };
  } catch (error) {
    console.error('Error updating item', error);
    throw new Error((error as Error).message || 'Error updating item');
  }
};

export const useEditDocItemMutation = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<
    { message: string; updatedItem?: IDocItemData },
    Error,
    { docId: string; itemId: string; updatedItemData: { [key: string]: string }[] },
    { previousDoc: IDocData | undefined }
  >({
    mutationFn: async ({ docId, itemId, updatedItemData }) => editDocItem(docId, itemId, updatedItemData),
    onMutate: async ({ docId, itemId, updatedItemData }) => {
      await queryClient.cancelQueries({ queryKey: ['doc', docId] });

      const previousDoc = queryClient.getQueryData<IDocData>(['doc', docId]);

      queryClient.setQueryData<IDocData>(['doc', docId], (oldData) => {
        if (!oldData || !oldData.docItems) return oldData;

        const updatedItems = oldData.docItems.map((docItem) => {
          if (docItem.docItemId === itemId) {
            return updatedItemData.reduce((currentItem, update) => {
              const { key, value } = update;
              const isAdditional = currentItem.additionalData.some((ad) => ad.key === key);

              if (isAdditional) {
                const updatedAdditionalData = currentItem.additionalData.map((ad) => (ad.key === key ? { ...ad, value } : ad));
                return { ...currentItem, additionalData: updatedAdditionalData };
              } else {
                return {
                  ...currentItem,
                  data: { ...currentItem.data, [key]: value },
                };
              }
            }, docItem);
          }

          return docItem;
        });

        return { ...oldData, docItems: updatedItems };
      });

      return { previousDoc };
    },
    onError: (error, _variables, context) => {
      showSnackbar(error.message, 'error');
      if (context?.previousDoc) {
        queryClient.setQueryData(['doc', context.previousDoc.docId], context.previousDoc);
      }
    },
    onSuccess: (data) => {
      showSnackbar(data.message, 'success');
    },
  });
};
