import { useMutation } from '@tanstack/react-query';
import fetchAPI from '../apiServices'; // Adjust the import path
import { saveAs } from 'file-saver'; // Install file-saver package

export function useDownloadDocMutation() {
  return useMutation<void, Error, { googleSheetId: string; format?: string }>({
    mutationFn: async ({ googleSheetId, format = 'xlsx' }): Promise<void> => {
      const response = await fetchAPI<Blob>(`/google-sheet/${googleSheetId}/download?format=${format}`, {
        method: 'GET',
        responseType: 'blob',
      });

      // Use file-saver to trigger the download
      const blob = new Blob([response], { type: response.type });
      saveAs(blob, `document.${format}`);
    },
  });
}
