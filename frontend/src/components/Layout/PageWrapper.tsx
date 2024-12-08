import React from 'react';
import { Container } from '@mui/material';
import { Theme } from '@mui/material/styles';
import styled from '@emotion/styled';

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import PageTitle from './PageTitle';
import { Flex, FlexColumn } from '@/styles/Flex';
import theme from '@/theme';
import Footer from './Footer';
import TitlePageSkeleton from '../Skeletons/TitlePageSkeleton';

interface PageWrapperProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: { title: string; to: string }[];
  isLoading?: boolean;
}

const drawerWidth = 270;
const drawerWidthCollapsed = 100;

const PageWrapper: React.FC<PageWrapperProps> = ({ title, children, description, breadcrumbs, isLoading }) => {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => setOpen((prev) => !prev);

  const drawerWidthStyles = open ? drawerWidth : drawerWidthCollapsed;

  return (
    <Flex flex={1} minWidth="100%" minHeight="100vh">
      <Sidebar drawerWidth={drawerWidthStyles} open={open} />
      <MainContainer>
        <Navbar toggleDrawer={toggleDrawer} />
        <ContentContainer theme={theme} drawerWidth={drawerWidthStyles}>
          {isLoading ? (
            <React.Fragment>
              <TitlePageSkeleton />
              {children}
              <Footer />
            </React.Fragment>
          ) : (
            <React.Fragment>
              {title && <PageTitle title={title} description={description} breadcrumbs={breadcrumbs} />}
              {children}
              <Footer />
            </React.Fragment>
          )}
          <Footer />
        </ContentContainer>
      </MainContainer>
    </Flex>
  );
};

export default PageWrapper;

const MainContainer = styled(FlexColumn)({
  padding: '20px 24px 0 24px',
  flex: 1,
});

const ContentContainer = styled(Container)<{ theme: Theme; drawerWidth: number }>(({ theme, drawerWidth }) => ({
  paddingRight: '0',
  width: '100%',
  transition: theme.transitions.create(['max-width', 'transform'], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),
  [theme.breakpoints.down('sm')]: {
    maxWidth: `vw`,
    paddingRight: '0',
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: `calc(100vw - ${drawerWidth}px - 40px)`,
    paddingRight: '0',
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: `calc(100vw - ${drawerWidth}px - 50px)`,
    paddingRight: '0',
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: `calc(100vw - ${drawerWidth}px - 50px)`,
    paddingRight: '0',
  },
}));
