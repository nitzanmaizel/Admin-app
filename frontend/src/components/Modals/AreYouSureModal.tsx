import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Button, Typography } from '@mui/material';
import IconWrapper from '../IconWrapper/IconWrapper';

interface AreYouSureModalProps {
  text?: string;
  buttonText?: string;
  item?: string;
  disabled?: boolean;
  handleDelete: () => void;
  onCancel?: () => void;
}

const AreYouSureModal = ({ text, item, disabled, buttonText, handleDelete, onCancel }: AreYouSureModalProps) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    if (onCancel) onCancel();
  };
  const onConfirm = () => {
    handleDelete();
    handleClose();
  };

  return (
    <React.Fragment>
      <IconWrapper text={buttonText} isDisabled={disabled} onClick={handleOpen} type={'delete'} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'האם אתה בטוח?'}</DialogTitle>
        <DialogContent>
          <Typography>{text ? text : `האם אתה בטוח שאתה רוצה למחוק את ה${item ? item : 'item'}?`}</Typography>
          <Typography color="error">{`פעולה זו אינה ניתנת לביטול ותמחק את ה${item ? item : 'item'} לצמיתות.`}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            {'ביטול'}
          </Button>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            {'למחוק'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AreYouSureModal;
