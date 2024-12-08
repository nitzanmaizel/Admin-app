import React from 'react';
import { Avatar, Typography } from '@mui/material';
import styled from '@emotion/styled';

import { useUser } from '@/hooks/useUser';

import IconWrapper from '../IconWrapper/IconWrapper';
import { Flex, FlexCenter, FlexColumn } from '@/styles/Flex';

const LogoutButton: React.FC<{ open: boolean }> = ({ open }) => {
  const { userInfo, logout } = useUser();
  return (
    <LogoutButtonContainer>
      {open && (
        <Flex gap={2}>
          <Avatar src={userInfo?.picture} alt={userInfo?.firstName} sx={{ width: 50, height: 50 }} />
          <FlexColumn>
            <Typography variant="h5">{userInfo?.firstName}</Typography>
            <Typography variant="h6" fontWeight={500}>
              {userInfo?.role}
            </Typography>
          </FlexColumn>
        </Flex>
      )}
      <IconWrapper type="logout" onClick={logout} />
    </LogoutButtonContainer>
  );
};

export default LogoutButton;

const LogoutButtonContainer = styled(FlexCenter)({
  backgroundColor: '#eff9ff',
  justifyContent: 'space-around',
  borderRadius: '18px',
  padding: '15px',
});
