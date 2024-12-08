import React from 'react';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { ActionButtonType, SmartTableData, SmartTableItem, SmartTableProps } from '@/types/SmartTableTypes';
import { searchItemsByKey } from '@/utils/searchItemsByKey';

const useSmartTable = ({ data, actions }: SmartTableProps) => {
  const [smartData, setSmartData] = React.useState<SmartTableData>(data);
  const [selectedRows, setSelectedRows] = React.useState<GridRowSelectionModel>([]);

  const { onDelete, onEdit, onAdd, onExport, onDownload } = actions;

  React.useEffect(() => {
    setSmartData(data);
  }, [data]);

  const rows = React.useMemo(() => smartData.items, [smartData.items]);

  const columns = React.useMemo(
    () => [...smartData.columns, ...(smartData.costumeColumns || [])],
    [smartData.costumeColumns, smartData.columns]
  );

  const onCheckBoxRow = (selectionModel: GridRowSelectionModel) => {
    setSelectedRows(selectionModel);
  };

  const onEditClick = () => {
    onEdit();
    setSelectedRows([]);
  };

  const onDeleteClick = () => {
    onDelete();
    setSelectedRows([]);
  };

  const onSearch = React.useCallback(
    (searchQuery: string) => {
      const searchKeys: Array<string> = ['firstName', 'lastName', 'personalNumber'];
      const searchResults = searchItemsByKey<SmartTableItem>(data.items, searchQuery, searchKeys);
      setSmartData((prev) => ({ ...prev, items: searchResults }));
    },
    [data.items, setSmartData]
  );

  const actionButtons: ActionButtonType[] = [
    { color: 'warning', text: 'הוסף', onClick: onAdd },
    { color: 'secondary', text: 'ערוך', onClick: onEditClick, withBadge: true },
    { color: 'error', text: 'מחק', onClick: onDeleteClick, withBadge: true },
    { color: 'primary', text: 'פתח Excel', onClick: onExport },
    { color: 'success', text: 'הורד Excel', onClick: onDownload },
  ];

  return {
    rows,
    columns,
    selectedRows,
    actionButtons,
    onCheckBoxRow,
    onSearch,
  };
};

export default useSmartTable;
