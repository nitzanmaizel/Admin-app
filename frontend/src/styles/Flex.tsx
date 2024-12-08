import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const Flex = styled(Box)({
  display: 'flex',
});

export const FlexRow = styled(Flex)({
  flexDirection: 'row',
  alignItems: 'center',
});

export const FlexRowCenter = styled(FlexRow)({
  justifyContent: 'center',
});

export const FlexRowSpaceBetween = styled(FlexRow)({
  justifyContent: 'space-between',
});

export const FlexColumn = styled(Flex)({
  flexDirection: 'column',
});

export const FlexColumnCenter = styled(FlexColumn)({
  justifyContent: 'center',
  alignItems: 'center',
});

export const FlexCenter = styled(Flex)({
  justifyContent: 'center',
  alignItems: 'center',
});
