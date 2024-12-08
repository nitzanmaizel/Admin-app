import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const CategorySkeleton: React.FC = () => {
  return <Skeleton variant="rectangular" width="100%" height={168} sx={{ borderRadius: 2 }} />;
};

export default CategorySkeleton;
