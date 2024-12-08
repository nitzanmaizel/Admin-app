import SearchBar from '@/components/Inputs/SearchBar';
import { useUser } from '@/hooks/useUser';
import { Flex, FlexColumn, FlexColumnCenter } from '@/styles/Flex';
import styled from '@emotion/styled';
import { Box, Button, Card, Divider, Typography } from '@mui/material';
import React from 'react';

const LoginPage: React.FC = () => {
  const { login } = useUser();
  return (
    <LoginPageContainer>
      <LoginFormContainer>
        <FlexColumn>
          <Flex minHeight={'70px'}>
            <Box component="img" sx={{ height: 50 }} alt="Logo" src="/assets/logo.png" />
            <Typography variant="h3" pl={2} mt={2}>
              {'Admin Panel'}
            </Typography>
          </Flex>
          <Typography variant="h2" mb={2}>
            {'ברוך הבא למערכת ניהול גדוד 910'}
          </Typography>
          <Button variant="outlined" color="primary" sx={{ margin: '0 40px' }} onClick={login}>
            {'התחבר  עם גוגל'}
          </Button>
          <Box display={'flex'} flexDirection={'column'} m={3}>
            <Divider>
              <Typography variant="h6">{'או התחבר עם שם משתמש וסיסמא'}</Typography>
            </Divider>
          </Box>
          <SearchBar label="שם משתמש" />
          <SearchBar label="סיסמא" />
        </FlexColumn>
      </LoginFormContainer>
    </LoginPageContainer>
  );
};

export default LoginPage;

const LoginPageContainer = styled(FlexColumnCenter)({
  overflow: 'hidden',
  minHeight: '100vh',
  '&::before, &::after': {
    content: "''",
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '100%',
    zIndex: -1,
  },
  '&::before': {
    right: '125px',
    top: '-50px',
    backgroundColor: '#fb977d',
  },
  '&::after': {
    left: '80px',
    bottom: 0,
    backgroundColor: '#57c0f6',
  },
});

const LoginFormContainer = styled(Card)({
  marginBottom: 0,
  minWidth: '500px',
  boxShadow: '#2553b919 0px 2px 30px 15px',
  padding: '20px',
});
