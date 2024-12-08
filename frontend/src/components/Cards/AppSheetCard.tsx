import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { NewSheetData } from '@/types/AppSheetTypes';
import IconWrapper from '../IconWrapper/IconWrapper';
import { Link } from 'react-router-dom';

const AppSheetCard: React.FC<NewSheetData> = ({ _id, title, description }) => {
  return (
    <Card>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          '&:last-child': {
            paddingBottom: '16px',
          },
        }}
      >
        <Box display="flex" flexDirection={'column'}>
          <Typography variant="h5" component="div" mb={1}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>

        <Box display={'flex'} justifyContent={'end'}>
          <Link to={`/app-sheet/${_id}`}>
            <IconWrapper type="arrowLeft" />
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AppSheetCard;
