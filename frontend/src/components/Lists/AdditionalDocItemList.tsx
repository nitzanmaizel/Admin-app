import { Box, MenuItem, Select, TextField, Typography } from '@mui/material';
import React from 'react';

interface AdditionalSheetItemDataProps {
  entries: {
    title: string;
    data: { key: string; value: string }[];
    label: string;
  }[];
  handleChange: (key: string, field: 'key' | 'value', value: string) => void;
}

const isValidDate = (dateString: string) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(dateString);
};

const AdditionalDocItemList: React.FC<AdditionalSheetItemDataProps> = ({ entries, handleChange }) => {
  return (
    <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
      {entries.map((entry) => (
        <Box key={entry.title} mb={2}>
          <Typography variant="h6" mb={2}>
            {entry.title}
          </Typography>
          <Box display="flex" gap={3} flexWrap="wrap">
            {entry.data.map((entryData) => (
              <Box display="flex" alignItems="center" gap={1} maxWidth="30%" key={entryData.key}>
                <TextField label={entry.label} value={entryData.key} variant="outlined" size="small" margin="none" />
                {isValidDate(entryData.key) ? (
                  <Select
                    label="Value"
                    value={entryData.value || '0'}
                    onChange={(e) => handleChange(entryData.key, 'value', e.target.value)}
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value="1">{'1'}</MenuItem>
                    <MenuItem value="0">{'0'}</MenuItem>
                    <MenuItem value="ח">{'ח'}</MenuItem>
                    <MenuItem value="ש">{'ש'}</MenuItem>
                  </Select>
                ) : (
                  <TextField
                    label="Value"
                    value={entryData.value}
                    onChange={(e) => handleChange(entryData.key, 'value', e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AdditionalDocItemList;
