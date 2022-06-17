import {
  Home as HomeIcon,
  // BarChartOutlined as DashboardIcon,
  // CodeOutlined as CodeIcon,
  // GitHub as GitHubIcon,
  // Public as PublicIcon,
  // PublicOff as PrivateIcon,
  AccountBoxRounded as UserIcon,
  SettingsOutlined as SettingsIcon,
  ListAlt as ListIcon,
  // CreditCard as BillingIcon,
  Book as BookIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  Tag as TagIcon
} from '@mui/icons-material';

import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { People } from '../pages/People';
import { NewRecord } from '../pages/NewRecord';
import { SingleRecord } from '../pages/SingleRecord';
import { AccountSettings } from '../pages/AccountSettings';

import { Route } from '../types/Route';
import { Organizations } from '../pages/Organizations';
import { Tags } from '../pages/Tags';

const routes: Array<Route> = [
  {
    key: 'router-home',
    titleCode: 'Home',
    description: 'Home',
    component: Home,
    path: '/',
    isProtected: false,
    isEnabled: true,
    icon: HomeIcon,
    appendDivider: true,
  },
  // {
  //   key: 'router-dashboard',
  //   titleCode: 'Dashboard',
  //   description: 'Dashboard',
  //   path: '/dashboard',
  //   isProtected: true,
  //   isEnabled: true,
  //   icon: DashboardIcon,
  // },
  {
    key: 'router-people',
    titleCode: 'pageTitles.people',
    description: 'People',
    path: '/people',
    isProtected: true,
    isEnabled: true,
    icon: PeopleIcon,
    component: People,
  },
  {
    key: 'router-singlePerson',
    titleCode: 'Person\'s Profile',
    description: 'Person\'s profile',
    path: '/people/:id',
    isProtected: true,
    isEnabled: false,
    //icon: PublicIcon,
    component: SingleRecord
  },
  {
    key: 'router-organizations',
    titleCode: 'pageTitles.organizations',
    description: 'Organizations',
    path: '/organizations',
    isProtected: true,
    isEnabled: true,
    icon: StoreIcon,
    component: Organizations
  },
  {
    key: 'router-singleOrganization',
    titleCode: 'Organization\'s Profile',
    description: 'Organization\'s profile',
    path: '/organizations/:id',
    isProtected: true,
    isEnabled: false,
    //icon: PublicIcon,
    component: SingleRecord
  },
  {
    key: 'router-tags',
    titleCode: 'pageTitles.tags',
    description: 'Tags',
    path: '/tags',
    isProtected: true,
    isEnabled: true,
    icon: TagIcon,
    component: Tags
  },
  {
    key: 'router-singleTag',
    titleCode: 'pageTitles.singleTag',
    description: 'Tag\'s detail',
    path: '/tags/:id',
    isProtected: true,
    isEnabled: false,
    //icon: PublicIcon,
    component: SingleRecord
  },
  {
    key: 'router-new',
    titleCode: 'New',
    //description: 'People',
    path: '/new',
    isProtected: true,
    isEnabled: false,
    //icon: PeopleIcon,
    component: NewRecord//() => ({titleCode: 'New'})
  },
  // {
  //   key: 'router-gh',
  //   titleCode: 'GitHub',
  //   description: 'GitHub',
  //   path: '/gh',
  //   isProtected: true,
  //   isEnabled: true,
  //   icon: GitHubIcon,
  //   subRoutes: [
  //     {
  //       key: 'router-gh-public',
  //       titleCode: 'Public Repos',
  //       description: 'Public Repos',
  //       path: '/gh/public',
  //       isProtected: true,
  //       isEnabled: true,
  //       icon: PublicIcon,
  //     },
  //     {
  //       key: 'router-gh-private',
  //       titleCode: 'Private Repos',
  //       description: 'Private Repos',
  //       path: '/gh/private',
  //       isAdmin: true,
  //       isProtected: true,
  //       isEnabled: false,
  //       icon: PrivateIcon,
  //     },
  //   ],
  // },
  // {
  //   key: 'router-code',
  //   titleCode: 'Code Editor',
  //   description: 'Code Editor',
  //   path: '/code-editor',
  //   isProtected: true,
  //   isEnabled: true,
  //   icon: CodeIcon,
  //   appendDivider: true,
  // },
  {
    key: 'router-settings',
    titleCode: 'pageTitles.settings',
    description: 'Settings',
    path: '/settings',
    isProtected: true,
    isEnabled: true,
    icon: SettingsIcon,
    subRoutes: [
      {
        key: 'router-my-account',
        //titleCode: 'Settings',
        titleCode: 'pageTitles.myAccount',
        description: 'Account Settings',
        path: '/settings/account',
        isProtected: true,
        isEnabled: true,
        icon:UserIcon,
        component: AccountSettings//() => AccountSettings({titleCode: 'pageTitles.accountSettings'})
      },
      {
        key: 'router-preferences',
        titleCode: 'pageTitles.preferences',
        description: 'App Preferences',
        path: '/settings/preferences',
        isProtected: true,
        isAdmin: true,
        isEnabled: true,
        icon: ListIcon,
      },
      // {
      //   key: 'router-billing',
      //   titleCode: 'Billing',
      //   description: 'Account Billing',
      //   path: '/account/billing',
      //   isProtected: true,
      //   isEnabled: true,
      //   icon: BillingIcon,
      // },
    ],
  },
  {
    key: 'login',
    titleCode: 'Login',
    path: '/login',
    isProtected: false,
    isEnabled: true,
    component: Login,
    icon: UserIcon,
  },
  {
    key: 'register',
    titleCode: 'Register',
    path: '/register',
    isProtected: false,
    isEnabled: true,
    component: Login,
    icon: BookIcon,
  }
];

export default routes;
