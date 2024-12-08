import React from 'react';
import { Box, Skeleton } from '@mui/material';

const ProductSkeleton: React.FC = () => {
  return (
    <Box sx={{ margin: 2 }}>
      <Skeleton variant="rectangular" width={'100%'} height={200} sx={{ borderRadius: 2 }} />
      <Skeleton variant="text" width="60%" height={30} />
      <Skeleton variant="text" width="20%" />
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="20%" />
      <Skeleton variant="text" width="30%" sx={{ mt: 2 }} />
    </Box>
  );
};

export default ProductSkeleton;
