import React from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { FlexRow, FlexRowSpaceBetween } from '@/styles/Flex';

interface PageTitleProps {
  title: string;
  description?: string;
  breadcrumbs?: { title: string; to: string }[];
}

const PageTitle: React.FC<PageTitleProps> = ({ title, description, breadcrumbs }) => {
  description = description || '';
  breadcrumbs = breadcrumbs || [{ title: 'בית', to: '/' }];

  return (
    <PageTitleContainer>
      <FlexRow display={'flex'} alignItems={'center'} gap={2}>
        <Typography variant="h4" align="center">
          {title}
        </Typography>
        <Typography variant="body1" align="center" mt={'5px'}>
          {description}
        </Typography>
      </FlexRow>
      <Box my={2}>
        <List sx={{ display: 'flex', justifySelf: 'end' }}>
          {breadcrumbs.map(({ title, to }, index) => (
            <ListItem key={index} component={Link} to={to} sx={{ width: 'auto' }}>
              <Typography variant="subtitle1">{title}</Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </PageTitleContainer>
  );
};

export default PageTitle;

const PageTitleContainer = styled(FlexRowSpaceBetween)({
  maxHeight: '80px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '40px',
  padding: '0 20px',
  backgroundColor: '#fff',
  marginBottom: '20px',
});
