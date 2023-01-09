import { Drawer, styled } from "@mui/material";

import { Routes } from "./Routes";

import { DRAWER_WIDTH } from "../../utils/constants";

interface NavigationProps {
  open: boolean | undefined;
  handleClose: () => void;
}

export const Navigation = ({ open, handleClose }: NavigationProps) => {
  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader />
      <Routes />
    </Drawer>
  );
};

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
