import * as React from 'react';
import { alpha, InputBase, styled, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from '../../../utils/utilityFunctions';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
//sx={{ display: { xs: 'none', sm: 'flex' } }}
export const Search = () => {
  const {t} = useTranslation();
  const [searchedText, setSearchedText] = React.useState<string>('');
  const navigate = useNavigate()

  const debounceOnChange = React.useCallback(
    debounce(value => {
      if(value.length > 3) setSearchedText(value);
    }, 600),
    []
  );

  return (
  <Box >
    <SearchWrapper>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase placeholder={`${t('userActions.search')}...`} 
      inputProps={{ 'aria-label': 'search' } }  
      defaultValue={searchedText}
      onChange={((event) => debounceOnChange(event.target.value))}
      />
    </SearchWrapper>
  </Box>
  )
};

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));
