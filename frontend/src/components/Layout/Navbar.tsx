import React from 'react';
import { AppBar, Avatar, Box, Button, Typography } from '@mui/material';

import IconWrapper from '../IconWrapper/IconWrapper';
import { FlexColumn, FlexRow, FlexRowSpaceBetween } from '@/styles/Flex';
import { useUser } from '@/hooks/useUser';
import SearchBar from '../Inputs/SearchBar';

interface NavbarProps {
  toggleDrawer: () => void;
}

const darkMode = false;

const Navbar: React.FC<NavbarProps> = ({ toggleDrawer }) => {
  const { userInfo } = useUser();
  return (
    <AppBar position="sticky">
      <FlexRowSpaceBetween flex={1}>
        <Box display={'flex'}>
          <Button onClick={toggleDrawer}>
            <IconWrapper type="menu" />
          </Button>
        </Box>
        <SearchBar />
        <Box display={'flex'} gap={3}>
          <IconWrapper type={darkMode ? 'lightMode' : 'darkMode'} />
          <IconWrapper type="notification" />
          <FlexRow gap={2}>
            <Avatar src={userInfo?.picture} alt={userInfo?.firstName} />
            <FlexColumn color={'#111c2d'}>
              <Typography variant="h5">{`${userInfo?.firstName} ${userInfo?.lastName}`}</Typography>
              <Typography variant="subtitle1" textTransform={'capitalize'} fontWeight={500}>
                {userInfo?.role}
              </Typography>
            </FlexColumn>
          </FlexRow>
        </Box>
      </FlexRowSpaceBetween>
    </AppBar>
  );
};

export default Navbar;
