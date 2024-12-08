import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import styled from '@emotion/styled';

import IconWrapper from '../IconWrapper/IconWrapper';
import { FlexRow } from '@/styles/Flex';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  size?: 'small' | 'medium';
  label?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, label, size, onSearch }) => {
  const [controlledValue, setControlledValue] = React.useState<string>(value || '');
  const debouncedSearchTerm = useDebounce(controlledValue, 300);

  React.useEffect(() => {
    onSearch?.(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setControlledValue(event.target.value);
  };

  const handleSearch = () => onSearch?.(controlledValue);

  return (
    <FlexRow>
      <SearchBarContainer
        fullWidth
        value={controlledValue}
        onChange={handleChange}
        variant="outlined"
        placeholder={label || 'חיפוש...'}
        size={size || 'small'}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconWrapper type="search" onClick={handleSearch} />
              </InputAdornment>
            ),
          },
        }}
      />
    </FlexRow>
  );
};

export default SearchBar;

const SearchBarContainer = styled(TextField)({
  margin: 0,
  maxWidth: 400,
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: `24px`,
    },
  },
});
