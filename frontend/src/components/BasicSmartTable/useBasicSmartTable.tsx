import React from 'react';
import { BasicSmartTableProps, BasicSmartTableData } from './BasicSmartDataTypes';
import { GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import SmartTableCellFactory from '../SmartTable/SmartTableCellFactory';

const useBasicSmartTable = ({ data }: BasicSmartTableProps) => {
  const [smartData, setSmartData] = React.useState<BasicSmartTableData>(data);
  const [selectedRows, setSelectedRows] = React.useState<GridRowSelectionModel>([]);

  React.useEffect(() => {
    setSmartData(data);
  }, [data]);

  React.useEffect(() => {
    console.log({ smartData });
  }, [smartData]);

  const handleCellChange = React.useCallback(
    (value: unknown, params: GridRenderCellParams) => {
      console.log({ value, params });

      const itemIndex = smartData.items.findIndex((item) => item.id === params.row.id);

      console.log({ itemIndex });

      if (itemIndex !== -1) {
        const updatedItems = [...smartData.items];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          [params.field]: value as string,
        };

        console.log({ updatedItems });
        setSmartData((prev) => ({ ...prev, items: updatedItems }));
      }
    },
    [smartData.items]
  );

  const rows = React.useMemo(() => smartData.items, [smartData.items]);

  const columns = React.useMemo(() => {
    return smartData.columns.map((col) => ({
      ...col,
      renderCell: col.cellType
        ? (params: GridRenderCellParams) => (
            <SmartTableCellFactory
              cellType={col.cellType!}
              params={params}
              config={col.config}
              onChange={(value) => handleCellChange(value, params)}
            />
          )
        : undefined,
    }));
  }, [smartData.columns, handleCellChange]);

  const onCheckBoxRow = (selectionModel: GridRowSelectionModel) => {
    setSelectedRows(selectionModel);
  };

  return {
    rows,
    columns,
    selectedRows,
    onCheckBoxRow,
    handleCellChange,
  };
};

export default useBasicSmartTable;
