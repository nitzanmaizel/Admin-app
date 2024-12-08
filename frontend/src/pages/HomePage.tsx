import React from 'react';
import PageWrapper from '@/components/Layout/PageWrapper';
import MasonryImageList from '@/components/Lists/MasonryImageList';
import { Button } from '@mui/material';
import fetchAPI from '@/services/apiServices';

const HomePage: React.FC = () => {
  const loadGoogleSheetData = async () => {
    const response = await fetchAPI('/google-sheet/1F5w456mFnrHJxP3idA3fgQuy4XUXX4Aop-4jmvsTDqg/load');

    console.log({ response });
  };

  return (
    <PageWrapper>
      <Button variant="contained" color="primary" onClick={loadGoogleSheetData}>
        Click Me
      </Button>
      <MasonryImageList />
    </PageWrapper>
  );
};

export default HomePage;
