import React from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { FlexRowCenter } from '@/styles/Flex';

interface SmartTableSelectCellProps {
  params: GridRenderCellParams;
  options: { value: string; label: string }[];
  label?: string;
  field: string;
  onChange?: (value: string, params: GridRenderCellParams) => void;
}

const SmartTableSelectCell: React.FC<SmartTableSelectCellProps> = ({ params, options, label = 'Value', field, onChange }) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleChange = (event: SelectChangeEvent) => {
    event.stopPropagation();
    if (onChange) {
      onChange(event.target.value, params);
    }
  };

  return (
    <FlexRowCenter onClick={handleClick}>
      <Select label={label} variant="outlined" size="small" value={params.row[field] || ''} onChange={handleChange}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FlexRowCenter>
  );
};

export default SmartTableSelectCell;
