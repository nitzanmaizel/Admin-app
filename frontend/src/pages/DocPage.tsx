import React from 'react';
import { useParams } from 'react-router-dom';
import { TransitionProps } from '@mui/material/transitions';
import { Alert, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Slide, styled, Typography } from '@mui/material';

import PageWrapper from '@/components/Layout/PageWrapper';
import SmartTable from '@/components/SmartTable/SmartTable';
import SmartTableActions from '@/components/SmartTable/SmartTableActions';

import { useDocPage } from '@/hooks/useDocPage';

import { FlexRowCenter } from '@/styles/Flex';
import TableSkeleton from '@/components/Skeletons/TableSkeleton';

import { ActionButtonType } from '@/types/SmartTableTypes';
import SmartTableCellFactory from '@/components/SmartTable/SmartTableCellFactory';

const selectStatus = {
  field: 'statusArrival',
  headerName: 'סטאטוס הגעה',
  flex: 1,
  cellType: 'select',
  config: {
    value: '',
    options: [
      { value: 'התייצב', label: 'התייצב' },
      { value: 'לא התייצב', label: 'לא התייצב' },
    ],
  },
};

const DocPage: React.FC = () => {
  const { docId = '' } = useParams<{ docId: string }>();

  const {
    rows,
    columns,
    smartData,
    selectedRows,
    actions,
    isPendingExport,
    isPendingDownload,
    onCheckBoxRow,
    toggleEditModel,
    isOpenEditModal,
    docLoading,
  } = useDocPage(docId);
  const { onDownload, onEdit, onAdd, onExport, onSearch } = actions;

  const breadcrumbs = [
    { title: 'בית', to: '/' },
    { title: smartData?.title || '', to: `/doc/${docId}` },
  ];

  const actionButtons: ActionButtonType[] = [
    { color: 'warning', text: 'הוסף', onClick: onAdd },
    { color: 'secondary', text: 'ערוך', onClick: toggleEditModel, withBadge: true },
    { color: 'error', text: 'מחק', onClick: toggleEditModel, withBadge: true },
    { color: 'primary', text: 'פתח Excel', onClick: onExport, isLoading: isPendingExport },
    { color: 'success', text: 'הורד Excel', onClick: onDownload, isLoading: isPendingDownload },
  ];

  return (
    <PageWrapper title={smartData?.title} description={smartData?.description} breadcrumbs={breadcrumbs} isLoading={docLoading}>
      {docLoading && !rows.length && !columns?.length ? (
        <FlexRowCenter mt={2}>
          <TableSkeleton />
        </FlexRowCenter>
      ) : (
        <Card>
          <SmartTableActions onSearch={onSearch || (() => {})} numOfSelectedRows={selectedRows.length} actions={actionButtons} />
          <SmartTable docId={docId} rows={rows} columns={columns} selectedRows={selectedRows} onCheckBoxRow={onCheckBoxRow} />
        </Card>
      )}
      <EditDialog
        maxWidth={false}
        open={isOpenEditModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={toggleEditModel}
        transitionDuration={500}
      >
        <DocItemModalContainer>
          <DocItemModalTitle>
            <Typography variant="h5">{`ערוך ${selectedRows.length} חיילים`}</Typography>
          </DocItemModalTitle>

          <DialogContent>
            <Alert severity="warning">{'שים לב אתה עומד לערוך מספר של חיילים, אם מוזן משהו אחר אצל חייל השינוי שלך ישנה אותו'}</Alert>
            <Typography variant="h6">{selectStatus.headerName}</Typography>
            <SmartTableCellFactory
              cellType={selectStatus.cellType!}
              value={selectStatus.config.value as string}
              config={selectStatus.config}
              onChange={(value) => onEdit(value, selectStatus.field)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleEditModel} style={{ marginRight: '8px' }}>
              {'סגור'}
            </Button>
            {/* <Button variant="contained" onClick={onEdit}>
              {'שמור'}
            </Button> */}
          </DialogActions>
        </DocItemModalContainer>
      </EditDialog>
    </PageWrapper>
  );
};

export default DocPage;

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

const EditDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
  },
}));

const DocItemModalTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));
