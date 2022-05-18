import {
  Home as HomeIcon,
  BarChartOutlined as DashboardIcon,
  CodeOutlined as CodeIcon,
  GitHub as GitHubIcon,
  Public as PublicIcon,
  PublicOff as PrivateIcon,
  AccountBoxRounded as UserIcon,
  SettingsOutlined as SettingsIcon,
  ListAlt as ListIcon,
  CreditCard as BillingIcon,
} from '@mui/icons-material';

import { Home } from '../pages/Home';
import { Login } from '../pages/Login';

import { Route } from '../types/Route';

const routes: Array<Route> = [
  {
    key: 'router-home',
    title: 'Home',
    description: 'Home',
    component: Home,
    path: '/',
    isProtected: false,
    isEnabled: true,
    icon: HomeIcon,
    appendDivider: true,
  },
  {
    key: 'router-dashboard',
    title: 'Dashboard',
    description: 'Dashboard',
    path: '/dashboard',
    isProtected: true,
    isEnabled: true,
    icon: DashboardIcon,
  },
  {
    key: 'router-gh',
    title: 'GitHub',
    description: 'GitHub',
    path: '/gh',
    isProtected: true,
    isEnabled: true,
    icon: GitHubIcon,
    subRoutes: [
      {
        key: 'router-gh-public',
        title: 'Public Repos',
        description: 'Public Repos',
        path: '/gh/public',
        isProtected: true,
        isEnabled: true,
        icon: PublicIcon,
      },
      {
        key: 'router-gh-private',
        title: 'Private Repos',
        description: 'Private Repos',
        path: '/gh/private',
        isAdmin: true,
        isProtected: true,
        isEnabled: false,
        icon: PrivateIcon,
      },
    ],
  },
  {
    key: 'router-code',
    title: 'Code Editor',
    description: 'Code Editor',
    path: '/code-editor',
    isProtected: true,
    isEnabled: true,
    icon: CodeIcon,
    appendDivider: true,
  },
  {
    key: 'router-my-account',
    title: 'My Account',
    description: 'My Account',
    path: '/account',
    isProtected: true,
    isEnabled: true,
    icon: UserIcon,
    subRoutes: [
      {
        key: 'router-settings',
        title: 'Settings',
        description: 'Account Settings',
        path: '/account/settings',
        isProtected: true,
        isEnabled: true,
        icon: SettingsIcon,
      },
      {
        key: 'router-preferences',
        title: 'Preferences',
        description: 'Account Preferences',
        path: '/account/preferences',
        isProtected: true,
        isEnabled: true,
        icon: ListIcon,
      },
      {
        key: 'router-billing',
        title: 'Billing',
        description: 'Account Billing',
        path: '/account/billing',
        isProtected: true,
        isEnabled: true,
        icon: BillingIcon,
      },
    ],
  },
  {
    key: 'login',
    title: 'Login',
    path: '/login',
    isProtected: false,
    isEnabled: true,
    component: Login,
    icon: UserIcon,
  }
];

export default routes;