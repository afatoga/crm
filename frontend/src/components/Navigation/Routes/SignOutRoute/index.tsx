import { ListItemButton, ListItemIcon, ListItemText, IconButton, styled } from '@mui/material';
import ExitToApp from '@mui/icons-material/ExitToApp';
import { useAuth } from '../../../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

export const SignOutRoute = () => {

  const {signout} = useAuth();
  const {t} = useTranslation()

  const handleSignOutClick = () => {
    signout();
  };

  return (
    <StyledListItemButton onClick={handleSignOutClick}>
      <ListItemIcon>
        <IconButton size="small">
          <ExitToApp />
        </IconButton>
      </ListItemIcon>
      <ListItemText primary={t('userActions.signOut')} />
    </StyledListItemButton>
  );
};

const StyledListItemButton = styled(ListItemButton)`
  position: absolute;
  bottom: 0;
  width: 100%;
`;
