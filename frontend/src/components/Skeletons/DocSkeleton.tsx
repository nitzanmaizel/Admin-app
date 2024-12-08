import React from 'react';
import { Box, Skeleton } from '@mui/material';

const DocSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="rectangular" width={'100%'} height={465} sx={{ borderRadius: 2 }} />
      <Box display={'flex'} justifyContent={'center'}>
        <Skeleton variant="text" width="60%" sx={{ mt: 2 }} />
      </Box>
      <Box display={'flex'} justifyContent={'center'}>
        <Skeleton variant="text" width="30%" />
      </Box>
      <Skeleton variant="text" width="100%" height={50} />
    </Box>
  );
};

export default DocSkeleton;
