import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box, Typography, SelectChangeEvent, Button } from '@mui/material';
import { filterDateEntries } from '@/utils/filterDates';
import { AdditionalData } from '@/types/AppSheetTypes';

interface DateSelectsProps {
  data: Array<{ key: string; value: string }>;
  onSelect?: (selectedValues: Record<string, string>) => void;
  onSave?: (selectedValues: AdditionalData[]) => void;
}

const OPTIONS = ['0', '1', 'ח', 'ש'];

const DateSelects: React.FC<DateSelectsProps> = ({ data, onSave }) => {
  const dateEntries = filterDateEntries(data);

  const initialState: Record<string, string> = dateEntries.reduce(
    (acc, entry) => {
      acc[entry.key] = '0';
      return acc;
    },
    {} as Record<string, string>,
  );

  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(initialState);

  const handleChange = (date: string, event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setSelectedValues((prev) => {
      const updated = { ...prev, [date]: value };
      return updated;
    });
  };

  if (dateEntries.length === 0) {
    return <Typography>No available dates.</Typography>;
  }

  const handleSave = (selectedValues: AdditionalData[]) => {
    onSave?.(selectedValues);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Typography variant="h6">{'דו"ח 1'}</Typography>
        <Button variant="contained" color="primary" onClick={() => handleSave(selectedValues)}>
          Save
        </Button>
      </Box>
      <Box display={'flex'} gap={2} flexWrap={'wrap'}>
        {dateEntries.map((entry) => {
          return (
            <FormControl key={entry.key} fullWidth variant="outlined" sx={{ maxWidth: '15%' }}>
              <InputLabel id={`select-label-${entry.key}`}>{entry.key}</InputLabel>
              <Select
                labelId={`select-label-${entry.key}`}
                value={selectedValues[entry.key]}
                onChange={(e) => handleChange(entry.key, e)}
                label={entry.key}
              >
                {OPTIONS.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        })}
      </Box>
    </Box>
  );
};

export default DateSelects;
