import React, { useState } from 'react';
import { Box, Button, MenuItem, Select, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { format, eachDayOfInterval } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import IconWrapper from '../IconWrapper/IconWrapper';
import { useCreateDocMutation } from '@/services/docServices/useCreateDocMutation';
import { IDocData } from '@/types/DocTypes';

interface ColumnItem {
  id: string;
  key: string;
  value: string;
  type: 'data' | 'date';
}

interface CreateSheetFormProps {
  columns: ColumnItem[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnItem[]>>;
}

const CreateSheetForm: React.FC<CreateSheetFormProps> = ({ columns, setColumns }) => {
  const createSheetMutation = useCreateDocMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);
  const [type, setType] = useState<string>('database-soldiers');

  const handleAddKeyValue = () => {
    if (keyInput.trim() === '') return;

    // Check for duplicate keys
    if (columns.some((col) => col.key === keyInput.trim())) return;

    const newColumn: ColumnItem = {
      id: `data-${Date.now()}`,
      key: keyInput.trim(),
      value: valueInput.trim(),
      type: 'data',
    };
    setColumns((prev) => [...prev, newColumn]);
    setKeyInput('');
    setValueInput('');
  };

  const handleSubmit = async () => {
    if (title.trim() === '') return;

    const additionalData: { key: string; value: string }[] = columns.map((col) => ({
      key: col.key,
      value: col.value ? col.value : '',
    }));
    const newSheetData: IDocData = {
      docId: `doc-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      databaseModel: type,
      additionalData,
      columns: [],
    };

    try {
      await createSheetMutation.mutateAsync(newSheetData);
      // Optionally reset the form
      // setTitle('');
      // setDescription('');
      // setColumns([]);
    } catch (error) {
      console.error('Failed to create sheet:', error);
    }
  };

  const handleGenerateDates = () => {
    if (dateFrom && dateTo && dateFrom.isBefore(dateTo)) {
      const dates = eachDayOfInterval({
        start: dateFrom.toDate(),
        end: dateTo.toDate(),
      });
      const dateEntries = dates.map((date) => ({
        id: `date-${date.getTime()}`, // Unique ID
        key: format(date, 'dd/MM/yyyy'),
        value: '0', // Initial value
        type: 'date' as const,
      }));
      // Check for duplicate date keys
      const duplicateDates = dateEntries.filter((dateEntry) => columns.some((col) => col.key === dateEntry.key));
      if (duplicateDates.length > 0) {
        const uniqueDateEntries = dateEntries.filter((dateEntry) => !columns.some((col) => col.key === dateEntry.key));
        setColumns((prev) => [...prev, ...uniqueDateEntries]);
      } else {
        setColumns((prev) => [...prev, ...dateEntries]);
      }
      setDateFrom(null);
      setDateTo(null);
    } else {
      alert('Please select a valid date range.');
    }
  };

  return (
    <Box sx={{ maxWidth: '50%' }}>
      <Typography variant="h6">{'מילוי נתוני מסמך'}</Typography>
      <Box>
        <TextField label={'כותרת'} value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth sx={{ marginBottom: 1 }} />
        <TextField label={'תיאור'} value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={2} fullWidth />
        <Typography variant="h6">{'הוסף עמודות'}</Typography>
        <Box>
          <Box display={'flex'} gap={2}>
            <TextField label={'שם העמודה'} value={keyInput} onChange={(e) => setKeyInput(e.target.value)} fullWidth />

            <TextField label={'ערך'} value={valueInput} onChange={(e) => setValueInput(e.target.value)} fullWidth />
            <IconWrapper type="add" onClick={handleAddKeyValue} />
          </Box>
          <Typography variant="h6">{'הוסף תאריכים'}</Typography>
          <Box display={'flex'} gap={2} mt={1}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
              <DatePicker label={'מתאריך'} value={dateFrom} onChange={(date) => setDateFrom(date)} sx={{ padding: 0 }} />
              <DatePicker label={'עד תאריך'} value={dateTo} onChange={(date) => setDateTo(date)} />
              <Button variant="contained" color="primary" onClick={handleGenerateDates}>
                Generate
              </Button>
            </LocalizationProvider>
          </Box>
          <Box>
            <Typography variant="h6">{'מאגר מידע'}</Typography>

            <Select
              label="Value"
              value={type}
              onChange={(e) => setType(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="database-soldiers">{'חיילים'}</MenuItem>
              <MenuItem value="app-sheet-weapons">{'נשקים'}</MenuItem>
              <MenuItem value="app-sheet-tavim">{'תווים'}</MenuItem>
            </Select>
          </Box>
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '16px' }}>
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateSheetForm;
