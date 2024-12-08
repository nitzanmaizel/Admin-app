// useBulkUpdateDocItemsQuery.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import fetchAPI from '../apiServices';
import { useSnackbar } from '@/hooks/useSnackbar';
import { ApiResponse } from '@/types/ApiTypes';
import { IDocData, IDocItemData } from '@/types/DocTypes';
import { GridInputRowSelectionModel } from '@mui/x-data-grid';

interface BulkUpdateDocItemResponse {
  message: string;
  data?: {
    updatedItems: IDocItemData[];
    failedItems: string[];
  };
}

async function bulkUpdateDocItems(
  docId: string,
  docItemIds: GridInputRowSelectionModel,
  additionalData: { key: string; value: string }[]
): Promise<BulkUpdateDocItemResponse> {
  if (!docId) throw new Error('DocId is required');
  if (!Array.isArray(docItemIds) || docItemIds.length === 0) throw new Error('docItemIds array is required');
  if (!Array.isArray(additionalData) || additionalData.length === 0) throw new Error('additionalData array is required');

  const res: ApiResponse<{ updatedItems: IDocItemData[]; failedItems: string[] }> = await fetchAPI(`/doc-item/${docId}/bulk-update`, {
    method: 'PUT',
    body: { docItemIds, additionalData },
  });

  if (res.status === 'error') {
    throw new Error(res.message || 'Error updating items');
  }

  return { message: res.message || 'Successfully updated items', data: res.data };
}

export function useBulkUpdateDocItemsMutation(options?: {
  onMutate?: (variables: {
    docId: string;
    docItemIds: GridInputRowSelectionModel;
    additionalData: { key: string; value: string }[];
  }) => void;
  onError?: (
    error: Error,
    variables: { docId: string; docItemIds: GridInputRowSelectionModel; additionalData: { key: string; value: string }[] },
    context?: { previousDoc: IDocData | undefined; optimisticUpdatedIds?: GridInputRowSelectionModel }
  ) => void;
  onSuccess?: (
    data: BulkUpdateDocItemResponse,
    variables: { docId: string; docItemIds: GridInputRowSelectionModel; additionalData: { key: string; value: string }[] },
    context?: { previousDoc: IDocData | undefined; optimisticUpdatedIds?: GridInputRowSelectionModel }
  ) => void;
}) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<
    BulkUpdateDocItemResponse,
    Error,
    { docId: string; docItemIds: GridInputRowSelectionModel; additionalData: { key: string; value: string }[] },
    { previousDoc: IDocData | undefined; optimisticUpdatedIds?: GridInputRowSelectionModel }
  >({
    mutationFn: async ({ docId, docItemIds, additionalData }) => bulkUpdateDocItems(docId, docItemIds, additionalData),
    onMutate: async (variables) => {
      const { docId, docItemIds, additionalData } = variables;
      if (options?.onMutate) options.onMutate(variables);

      await queryClient.cancelQueries({ queryKey: ['doc', docId] });

      const previousDoc = queryClient.getQueryData<IDocData>(['doc', docId]);

      queryClient.setQueryData<IDocData>(['doc', docId], (oldData) => {
        if (!oldData || !oldData.docItems) return oldData;

        const updatedItems = oldData.docItems.map((docItem) => {
          if (Array.isArray(docItemIds) ? docItemIds.includes(docItem.docItemId) : docItemIds === docItem.docItemId) {
            return additionalData.reduce((currentItem, { key, value }) => {
              const isAdditional = currentItem.additionalData.some((ad) => ad.key === key);
              if (isAdditional) {
                const updatedAdditionalData = currentItem.additionalData.map((ad) => (ad.key === key ? { ...ad, value } : ad));
                return { ...currentItem, additionalData: updatedAdditionalData };
              } else {
                return { ...currentItem, data: { ...currentItem.data, [key]: value } };
              }
            }, docItem);
          }
          return docItem;
        });

        return { ...oldData, docItems: updatedItems };
      });

      return { previousDoc, optimisticUpdatedIds: docItemIds };
    },
    onError: (error, variables, context) => {
      showSnackbar(error.message, 'error');
      if (context?.previousDoc) {
        queryClient.setQueryData(['doc', context.previousDoc.docId], context.previousDoc);
      }
      if (options?.onError) options.onError(error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      showSnackbar(data.message, 'success');
      if (options?.onSuccess) options.onSuccess(data, variables, context);
    },
  });
}
