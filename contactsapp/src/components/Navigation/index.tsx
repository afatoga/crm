import { Drawer, styled} from '@mui/material';

import { Routes } from './Routes';

import { DRAWER_WIDTH } from '../../utils/constants';
//import { navClosedMixin, navOpenedMixin } from '../../styles/mixins';

interface NavigationProps {
  open: boolean | undefined;
  handleClose: () => void;
}

export const Navigation = ({ open, handleClose }: NavigationProps) => {

  return (
    // <Drawer variant="permanent" open={open} >
    <Drawer
    sx={{
      width: DRAWER_WIDTH,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: DRAWER_WIDTH,
        boxSizing: 'border-box',
      },
    }}
    variant="persistent"
    anchor="left"
    open={open}
  >      <DrawerHeader />
      <Routes />
    </Drawer>
  );
};

// const DrawerHeader = styled('div')(({ theme }) => ({
//   ...theme.mixins.toolbar,
// }));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

// const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
//   width: DRAWER_WIDTH,
//   flexShrink: 0,
//   whiteSpace: 'nowrap',
//   boxSizing: 'border-box',
//   ...(open && {
//     ...navOpenedMixin(theme),
//     '& .MuiDrawer-paper': navOpenedMixin(theme),
//   }),
//   ...(!open && {
//     ...navClosedMixin(theme),
//     '& .MuiDrawer-paper': navClosedMixin(theme),
//   }),
// }));
