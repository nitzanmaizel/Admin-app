import React, { useCallback, useState } from 'react';
import { GridRenderCellParams, GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { IDocData, IDocItemData } from '@/types/DocTypes';
import { SmartTableActionsProps } from '@/types/SmartTableTypes';
import { useExportDocMutation } from '@/services/docServices/useExportDocMutation';
import { useDownloadDocMutation } from '@/services/docServices/useDownloadDocMutation';

import { useEditDocItemMutation } from '@/services/docItemServices/useEditDocItemMutation';
import { useDocQuery } from '@/services/docServices/useDocQuery';
import { useDeleteDocItemMutation } from '@/services/docItemServices/useDeleteDocItemMutation';
import { useBulkUpdateDocItemsMutation } from '@/services/docItemServices/useBulkUpdateDocItemsMutation';
import SmartTableCellFactory from '@/components/SmartTable/SmartTableCellFactory';

export const useDocPage = (docId: string) => {
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const { data: docData, isLoading: docLoading } = useDocQuery(docId);

  const { mutate: editDocItem } = useEditDocItemMutation();
  const { mutate: deleteItems } = useDeleteDocItemMutation();
  const { mutate: exportDoc, isPending: isPendingExport } = useExportDocMutation();
  const { mutate: downloadDoc, isPending: isPendingDownload } = useDownloadDocMutation();
  const { mutate: bulkUpdateDocItems } = useBulkUpdateDocItemsMutation();

  const [smartData, setSmartData] = React.useState<IDocData>();
  const [selectedRows, setSelectedRows] = React.useState<GridRowSelectionModel>([]);
  const [googleSheetId, setGoogleSheetId] = React.useState('');

  const { docItems = [] } = smartData || { docItems: [] };

  React.useEffect(() => {
    if (docData) {
      setSmartData(docData);
    }
  }, [docData]);

  const toggleEditModel = () => {
    setIsOpenEditModal((prev) => !prev);
  };

  const handleEditDocItems = React.useCallback(
    (value: string, key: string) => {
      console.log({ key, value, selectedRows });

      const additionalData = [{ key, value }];
      bulkUpdateDocItems(
        { docId, docItemIds: selectedRows, additionalData },
        {
          onSuccess: () => setSelectedRows([]),
          onError: () => setSelectedRows([]),
        }
      );
      setIsOpenEditModal(false);
    },
    [bulkUpdateDocItems, docId, selectedRows]
  );

  const handleDeleteItems = React.useCallback(() => {
    deleteItems({ docId: docData?.docId || '', itemIds: selectedRows as string[] });
    setSelectedRows([]);
  }, [deleteItems, docData?.docId, selectedRows]);

  const handleDownloadDoc = () => {
    if (!googleSheetId) return;
    downloadDoc(
      { googleSheetId, format: 'xlsx' },
      {
        onError: (error: unknown) => {
          console.error('Error downloading document:', error);
        },
      }
    );
    console.log('handleDownloadAppSheet');
  };

  const handleExportDoc = () => {
    exportDoc(docData?.docId || '', {
      onSuccess: (googleSheetId) => {
        setGoogleSheetId(googleSheetId);
        const googleSheetUrl = `https://docs.google.com/spreadsheets/d/${googleSheetId}`;
        window.open(googleSheetUrl, '_blank');
      },
    });
  };

  const onSearch = React.useCallback((searchQuery: string) => {
    console.log({ searchQuery });
  }, []);

  const handleRowClick = React.useCallback((row: GridRowParams) => {
    console.log({ row });
  }, []);

  const getItemsWithRowIds = useCallback(
    (selectedRowsId: GridRowSelectionModel) => {
      return selectedRowsId
        .map((rowId) => docItems.find((item) => item.docItemId === rowId))
        .filter((item): item is IDocItemData => item !== undefined);
    },
    [docItems]
  );

  const handleCellChange = React.useCallback(
    (value: string, params: GridRenderCellParams) => {
      const key = params.field;
      const itemId = params.row.id;
      editDocItem({
        docId,
        itemId,
        updatedItemData: [{ key, value }],
      });
    },
    [docId, editDocItem]
  );

  const columns = React.useMemo(() => {
    if (!smartData) return [];

    return smartData.columns.map((col) => ({
      ...col,
      renderCell: col.cellType
        ? (params: GridRenderCellParams) => (
            <SmartTableCellFactory
              cellType={col.cellType!}
              value={params.value as string}
              config={col.config}
              onChange={(value) => handleCellChange(value, params)}
            />
          )
        : undefined,
    }));
  }, [handleCellChange, smartData]);

  const allColumnFields = React.useMemo(() => new Set(columns?.map((c) => c.field)), [columns]);

  const rows = React.useMemo(() => {
    return docItems.map((item) => {
      const rowData: { [key: string]: string } = { ...item.data, id: item.docItemId };

      item.additionalData.forEach((ad) => {
        if (allColumnFields.has(ad.key)) {
          rowData[ad.key] = ad.value || '';
        }
      });

      return { id: item.docItemId, ...rowData };
    });
  }, [docItems, allColumnFields]);

  const onCheckBoxRow = React.useCallback((selectionModel: GridRowSelectionModel) => {
    setSelectedRows(selectionModel);
  }, []);

  const handleAddItem = () => {
    // TODO: Implement add item functionality
    console.log('handleAddItem');
  };

  const actions: SmartTableActionsProps = {
    onDelete: handleDeleteItems,
    onEdit: handleEditDocItems,
    onExport: handleExportDoc,
    onDownload: handleDownloadDoc,
    onRowClick: handleRowClick,
    onSearch: onSearch,
    onAdd: handleAddItem,
  };

  console.log({ isPendingExport });

  return {
    rows,
    columns,
    smartData,
    actions,
    docLoading,
    selectedRows,
    isOpenEditModal,
    isPendingExport,
    isPendingDownload,

    onCheckBoxRow,
    toggleEditModel,

    getItemsWithRowIds,
  };
};
