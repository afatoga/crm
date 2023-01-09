import { Icon, IconButton } from "@mui/material";
import { useState } from "react";
import { Menu } from "@mui/icons-material";

interface HamburgerProps {
  toggleNavigation: () => void;
}

export const Hamburger = ({ toggleNavigation }: HamburgerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
    toggleNavigation();
  };

  return (
    <IconButton size="small" onClick={toggle}>
      <Icon component={Menu} />
    </IconButton>
  );
};
