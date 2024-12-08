import { GridRenderCellParams, GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { MuiColorOptions } from './MuiTypes';

export interface SmartTableProps {
  data: SmartTableData;
  actions: SmartTableActionsProps;
}

/**
 * SmartTableData Types
 */
export interface SmartTableData {
  items: SmartTableItem[];
  columns: { field: string; headerName: string; flex: number }[];
  costumeColumns?: SmartTableCostumeColumn[];
  selectedRowsId?: GridRowSelectionModel;
}

export type SmartTableItem = { id: string; [k: string]: unknown };

/**
 * SmartTableActions Types
 */
export interface SmartTableActionsProps {
  onDelete: () => void;
  onEdit: (value: string, key: string) => void;
  onAdd?: () => void;
  onExport: () => void;
  onDownload: () => void;
  onSearch?: (searchValue: string) => void;
  onRowClick: (row: GridRowParams) => void;
  onSave?: () => void;
}

/**
 * SmartTableActionButton Types
 */
export type ActionButtonType = {
  color: MuiColorOptions;
  text: string;
  onClick?: SmartTableActionsProps[keyof SmartTableActionsProps];
  withBadge?: boolean;
  role?: string;
  isLoading?: boolean;
};

/**
 * SmartTableCostumeColumn Types
 */
export interface SmartTableCostumeColumn {
  field: string;
  headerName: string;
  flex: number;
  renderCell: (params: GridRenderCellParams) => JSX.Element;
}
