import React from 'react';
import { Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Slide, styled, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import AdditionalDocItemList from '../Lists/AdditionalDocItemList';

import { AdditionalData, IDocItemData } from '@/types/DocTypes';

interface DocItemModalProps {
  open: boolean;
  onClose: () => void;
  docItem: IDocItemData;
  onSave: (additionalData: AdditionalData) => void;
}

const DocItemModal: React.FC<DocItemModalProps> = ({ open, onClose, docItem, onSave }) => {
  const { data, additionalData } = docItem;

  const [editableAdditionalData, setEditableAdditionalData] = React.useState<{ key: string; value: string }[]>(additionalData);

  const dateEntries = React.useMemo(() => editableAdditionalData.filter((entry) => isValidDate(entry.key)), [editableAdditionalData]);

  const stringEntries = React.useMemo(() => editableAdditionalData.filter((entry) => !isValidDate(entry.key)), [editableAdditionalData]);

  const handleChange = (key: string, field: 'key' | 'value', value: string) => {
    const updatedData = editableAdditionalData.map((entry) => (entry.key === key ? { ...entry, [field]: value } : entry));

    setEditableAdditionalData(updatedData);
  };

  const handleSaveClick = () => onSave(editableAdditionalData);

  const entries = [
    { title: 'נתונים נוספים', data: stringEntries, label: 'עמודה' },
    { title: 'דו"ח 1', data: dateEntries, label: 'תאריך' },
  ];

  return (
    <Dialog maxWidth={false} open={open} TransitionComponent={Transition} keepMounted onClose={onClose} transitionDuration={500}>
      <DocItemModalContainer>
        <DocItemModalTitle>
          <Typography variant="h5">{`שם פרטי: ${data.firstName}`}</Typography>
          <Typography variant="h5">{`שם משפחה: ${data.lastName}`}</Typography>
          <Typography variant="h5">{`מספר אישי: ${data.personalNumber}`}</Typography>
          <Typography variant="h5">{`פלוגה: ${data.company}`}</Typography>
          <Typography variant="h5">{`מחלקה: ${data.department}`}</Typography>
        </DocItemModalTitle>

        <DialogContent>
          <AdditionalDocItemList entries={entries} handleChange={handleChange} />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} style={{ marginRight: '8px' }}>
            {'סגור'}
          </Button>
          <Button variant="contained" onClick={handleSaveClick}>
            {'שמור'}
          </Button>
        </DialogActions>
      </DocItemModalContainer>
    </Dialog>
  );
};

export default DocItemModal;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DocItemModalContainer = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  maxWidth: '50vw',
  boxShadow: 'none',
}));

const DocItemModalTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const isValidDate = (dateString: string) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(dateString);
};
