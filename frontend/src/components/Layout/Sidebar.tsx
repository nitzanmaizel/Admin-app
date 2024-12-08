import * as React from 'react';

import { Box, Typography, Drawer, Theme } from '@mui/material';

import SidebarList from '../Lists/SideBarList';
import LogoutButton from '../Buttons/LogoutButton';
import { Flex, FlexCenter, FlexColumn } from '@/styles/Flex';
import styled from '@emotion/styled';
import theme from '@/theme';

interface SidebarProps {
  drawerWidth: number;
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth, open }) => {
  return (
    <DrawerContainer variant="permanent" theme={theme} drawerWidth={drawerWidth}>
      <FlexColumn overflow={'hidden'}>
        <Flex minHeight={'70px'} alignItems={'end'} p={open ? 2 : 0}>
          <Box component="img" sx={{ height: 50 }} alt="Logo" src="/assets/logo.png" />
          {open && (
            <Typography variant="h5" pl={2}>
              {'Admin Panel'}
            </Typography>
          )}
        </Flex>
        <Flex minHeight={'calc(100% - 200px)'} overflow={'auto'} mt={open ? 0 : 2}>
          <SidebarList open={open} />
        </Flex>
        <FlexCenter minHeight={'130px'} p={4}>
          <LogoutButton open={open} />
        </FlexCenter>
      </FlexColumn>
    </DrawerContainer>
  );
};

export default Sidebar;

const DrawerContainer = styled(Drawer)<{ theme: Theme; drawerWidth: number }>(({ drawerWidth }) => ({
  width: drawerWidth,

  transition: theme.transitions.create(['width'], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),

  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },

  '& .MuiDrawer-paper': {
    width: drawerWidth,
    position: 'fixed',
    top: '20px',
    left: '20px',
    right: 0,
    overflow: 'hidden',
  },
}));
