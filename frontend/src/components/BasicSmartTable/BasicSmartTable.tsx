import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Typography } from '@mui/material';
import useBasicSmartTable from './useBasicSmartTable';
import { BasicSmartTableData } from './BasicSmartDataTypes';
import UserTableSkeleton from '../Skeletons/TableSkeleton';

export interface BasicSmartTableProps {
  data: BasicSmartTableData;
  isLoading?: boolean;
}

const BasicSmartTable: React.FC<BasicSmartTableProps> = ({ data, isLoading }) => {
  console.log({ data, isLoading });
  const { rows, columns, selectedRows, onCheckBoxRow } = useBasicSmartTable({ data });

  if (isLoading) {
    return <UserTableSkeleton />;
  }

  if (!rows.length || !columns.length) {
    return (
      <Card>
        <Typography variant="h6" align="center">
          {'No data available'}
        </Typography>
      </Card>
    );
  }

  return (
    <Card>
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
          '& .MuiDataGrid-root': {
            border: 'none',
          },

          '& .MuiDataGrid-cell': {
            display: 'flex',
          },
        }}
      />
    </Card>
  );
};

export default BasicSmartTable;
