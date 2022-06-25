import { styled, Typography } from '@mui/material';

import { APP_TITLE } from '../../../utils/constants';

export const AppTitle = () => (
  <StyledAppTitle variant="h6" noWrap sx={{ display: { xs: 'none', sm: 'flex' } }}>
    {APP_TITLE}
  </StyledAppTitle>
);

const StyledAppTitle = styled(Typography)`
  display: {
    xs: none;
    sm: block;
  }
  cursor: default;
`;
