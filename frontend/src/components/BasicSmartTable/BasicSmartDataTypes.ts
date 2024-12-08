import { GridRowSelectionModel } from '@mui/x-data-grid';

export interface BasicSmartTableProps {
  data: BasicSmartTableData;
}

/**
 * BasicSmartTableData Types
 */
export interface BasicSmartTableData {
  items: { id: string; [k: string]: string }[];
  columns: BasicSmartTableColumn[];
  selectedRowsId?: GridRowSelectionModel;
}

/**
 * BasicSmartTableItem Types
 */
export interface BasicSmartTableColumn {
  field: string;
  headerName: string;
  cellType?: 'input' | 'select';
  flex: number;
  sortable?: boolean;
  filterable?: boolean;
  config?: {
    value?: string;
    options?: { value: string; label: string }[];
  };
}
