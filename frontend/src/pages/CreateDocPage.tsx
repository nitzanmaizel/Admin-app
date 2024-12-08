import React, { useState } from 'react';
import { Paper } from '@mui/material';

import PageWrapper from '@/components/Layout/PageWrapper';
import PreviewSheet from '@/components/CreateSheetComponents/PreviewSheet';
import CreateSheetForm from '@/components/CreateSheetComponents/CreateSheetForm';

interface ColumnItem {
  id: string;
  key: string;
  value: string;
  type: 'data' | 'date';
}

const CreateDocPage: React.FC = () => {
  const [columns, setColumns] = useState<ColumnItem[]>([]);

  return (
    <PageWrapper title={'יצירת מסמך חדש'}>
      <Paper elevation={3} style={{ padding: '16px', display: 'flex', gap: '40px' }}>
        <CreateSheetForm columns={columns} setColumns={setColumns} />
        <PreviewSheet data={columns} setData={setColumns} />
      </Paper>
    </PageWrapper>
  );
};

export default CreateDocPage;
