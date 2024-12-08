import { DataGrid, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import React from 'react';

type SmartTableColumn = {
  renderCell?: (params: GridRenderCellParams) => JSX.Element;
  field: string;
  headerName: string;
  flex: number;
  cellType?: 'input' | 'select';
  config?: {
    value?: string;
    options?: { value: string; label: string }[];
  };
};

interface SmartTableProps {
  docId: string;
  rows: { [key: string]: string }[];
  columns: SmartTableColumn[];
  onCheckBoxRow: (selectionModel: GridRowSelectionModel) => void;
  selectedRows: GridRowSelectionModel;
}

const SmartTable: React.FC<SmartTableProps> = ({ rows, columns, onCheckBoxRow, selectedRows }) => {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSizeOptions={[10, 25, 50]}
      initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      disableRowSelectionOnClick
      checkboxSelection
      onRowSelectionModelChange={onCheckBoxRow}
      rowSelectionModel={selectedRows}
      sx={{
        '& .MuiDataGrid-root': { border: 'none', backgroundColor: 'transparent' },
        '& .MuiDataGrid-cell': { display: 'flex', backgroundColor: 'transparent' },
      }}
    />
  );
};

export default SmartTable;
