import { Icon, IconButton } from '@mui/material';
import { useState } from 'react';
import {Menu} from '@mui/icons-material'
//import { , IconButton, lighten, ListItemButton, ListItemIcon, ListItemText, styled, Tooltip } from '@mui/material';
//import { Divide as HamburgerMenu } from 'hamburger-react';

interface HamburgerProps {
  toggleNavigation: () => void;
}

export const Hamburger = ({ toggleNavigation }: HamburgerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
    toggleNavigation();
  };

  return (<IconButton size="small" onClick={toggle}>
  <Icon component={Menu} />
</IconButton>
    // <div onClick={toggle}>hamburger {isOpen}</div>
  )
  //return <HamburgerMenu size={24} onToggle={toggle} toggled={isOpen} />;
};
