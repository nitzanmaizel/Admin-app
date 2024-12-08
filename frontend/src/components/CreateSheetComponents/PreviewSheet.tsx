import React from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RemoveIcon from '@mui/icons-material/Remove';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from '../SortableItem';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';

interface data {
  id: string;
  key: string;
  value: string;
  type: 'data' | 'date';
}

interface PreviewSheetProps {
  data: data[];
  setData: React.Dispatch<React.SetStateAction<data[]>>;
}

const PreviewSheet: React.FC<PreviewSheetProps> = ({ data, setData }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = data.findIndex((col) => col.id === active.id);
      const newIndex = data.findIndex((col) => col.id === over?.id);
      setData((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleRemoveColumn = (id: string) => {
    setData((prev) => prev.filter((col) => col.id !== id));
  };

  const handleValueChange = (id: string, newValue: string) => {
    setData((prev) => prev.map((col) => (col.id === id ? { ...col, value: newValue } : col)));
  };
  return (
    <Box>
      <Typography variant="h6">{'סדר של שדות נוספים'}</Typography>
      <Box>
        {data.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={data.map((col) => col.id)} strategy={verticalListSortingStrategy}>
              {data.map((col) => (
                <SortableItem key={col.id} id={col.id}>
                  <Box display="flex" alignItems="center" gap={2} p={0}>
                    <DragIndicatorIcon style={{ cursor: 'grab' }} />
                    <TextField label="Key" value={col.key || ''} sx={{ padding: 0, '& .MuiInputBase-input': { padding: 0 } }} />
                    <TextField
                      label="Value"
                      value={col.value || ''}
                      onChange={(e) => handleValueChange(col.id, e.target.value)}
                      sx={{ padding: 0, '& .MuiInputBase-input': { padding: 0 } }}
                    />
                    <IconButton color="secondary" onClick={() => handleRemoveColumn(col.id)}>
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </Box>
    </Box>
  );
};

export default PreviewSheet;
