import React from 'react';
import { Box, List, ListItem, Skeleton } from '@mui/material';
import styled from '@emotion/styled';
import { FlexRow, FlexRowSpaceBetween } from '@/styles/Flex';

const TitlePageSkeleton: React.FC = () => {
  return (
    <PageTitleSkeletonContainer>
      <FlexRow display={'flex'} alignItems={'center'} gap={2}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={300} height={20} />
      </FlexRow>
      <Box my={2}>
        <List sx={{ display: 'flex', justifySelf: 'end' }}>
          {[1, 2, 3].map((item) => (
            <ListItem key={item} sx={{ width: 'auto' }}>
              <Skeleton variant="text" width={100} height={20} />
            </ListItem>
          ))}
        </List>
      </Box>
    </PageTitleSkeletonContainer>
  );
};

export default TitlePageSkeleton;

const PageTitleSkeletonContainer = styled(FlexRowSpaceBetween)({
  minHeight: '80px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '40px',
  padding: '0 20px',
  backgroundColor: '#f0f0f0',
});
