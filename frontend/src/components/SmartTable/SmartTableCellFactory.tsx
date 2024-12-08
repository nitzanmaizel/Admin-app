import React from 'react';
import { TextField, Select, MenuItem } from '@mui/material';

interface Option {
  value: string;
  label: string;
}

interface SmartTableCellFactoryConfig {
  value?: string;
  options?: Option[];
}

interface SmartTableCellFactoryProps {
  cellType: string;
  value: string;
  config?: SmartTableCellFactoryConfig;
  onChange: (value: string) => void;
}

const SmartTableCellFactory: React.FC<SmartTableCellFactoryProps> = ({ cellType, value, config, onChange }) => {
  switch (cellType) {
    case 'select':
      return (
        <Select fullWidth value={value || ''} onChange={(e) => onChange(e.target.value)}>
          {config?.options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      );

    case 'text':
    default:
      return <TextField fullWidth variant="standard" value={value || ''} onChange={(e) => onChange(e.target.value)} />;
  }
};

export default SmartTableCellFactory;
