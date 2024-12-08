import React from 'react';
import { Badge, Button } from '@mui/material';
import styled from '@emotion/styled';
import SearchBar from '../Inputs/SearchBar';
import { FlexRow, FlexRowSpaceBetween } from '@/styles/Flex';
import { ActionButtonType } from '@/types/SmartTableTypes';

interface SmartTableActionsProps {
  actions: ActionButtonType[];
  numOfSelectedRows: number;
  onSearch: (searchValue: string) => void;
}

const SmartTableActions: React.FC<SmartTableActionsProps> = React.memo(({ actions, numOfSelectedRows, onSearch }) => {
  return (
    <FlexRowSpaceBetween p="0 10px" minHeight={70}>
      <SearchBar onSearch={onSearch} />
      <FlexRow display="flex" gap={2}>
        {actions.map(({ text, onClick, color, withBadge, isLoading }, index) => (
          <ActionBadge key={index} color={color} badgeContent={withBadge && numOfSelectedRows > 0 ? numOfSelectedRows : null}>
            <Button variant="contained" color={color} onClick={onClick && onClick}>
              {isLoading ? 'טוען...' : text}
            </Button>
          </ActionBadge>
        ))}
      </FlexRow>
    </FlexRowSpaceBetween>
  );
});

export default SmartTableActions;

const ActionBadge = styled(Badge)({
  '& .MuiBadge-badge': {
    color: '#fff',
    right: 5,
    top: 5,
    border: '2px solid #fff',
    padding: '0 4px',
  },
});
