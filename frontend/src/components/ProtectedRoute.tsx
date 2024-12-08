import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useUser } from '../hooks/useUser';
import { FlexRowCenter } from '@/styles/Flex';

const ProtectedRoute: React.FC = () => {
  const { userInfo, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <FlexRowCenter style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </FlexRowCenter>
    );
  }

  if (userInfo && userInfo.role === 'admin') {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
};

export default ProtectedRoute;
