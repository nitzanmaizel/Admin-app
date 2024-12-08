import React from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { TextField } from '@mui/material';
import { FlexRowCenter } from '@/styles/Flex';

interface SmartTableInputCellProps {
  params: GridRenderCellParams;
  field: string;
  label?: string;
  onChange?: (value: string, params: GridRenderCellParams) => void;
}

const SmartTableInputCell: React.FC<SmartTableInputCellProps> = ({ params, field, label = 'Value', onChange }) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (onChange) {
      onChange(newValue, params);
    }
  };

  return (
    <FlexRowCenter onClick={handleClick}>
      <TextField label={label} variant="outlined" size="small" value={params.row[field] || ''} onChange={handleChange} fullWidth />
    </FlexRowCenter>
  );
};

export default SmartTableInputCell;
