import { NavLink } from "react-router-dom";
import {
  Icon,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import { Route } from "../../../../types";

interface RouteItemProps {
  route: Route;
  nested?: boolean;
  hasChildren?: boolean;
  handleMenuClick?: (route: Route) => void;
}

export const RouteItem = ({
  route,
  nested = false,
  hasChildren = false,
  handleMenuClick = () => {},
}: RouteItemProps) => {
  const { t } = useTranslation();

  const handleNavigate = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (!route.isEnabled || hasChildren) e.preventDefault();
  };

  const item = (
    <ListItemButton
      sx={{ pl: nested ? 3 : 1 }}
      onClick={() => handleMenuClick(route)}
    >
      <ListItemIcon>
        <IconButton size="small">
          {route.icon && <Icon component={route.icon} />}
        </IconButton>
      </ListItemIcon>
      <ListItemText primary={t(route.titleCode)} />
      {hasChildren && (route.expanded ? <ExpandLess /> : <ExpandMore />)}
    </ListItemButton>
  );

  return (
    <StyledNavLink
      to={`${route.path}`}
      key={route.key}
      onClick={handleNavigate}
    >
      {route.description ? (
        <Tooltip
          title={`${route.description}${
            !route.isEnabled ? " (Not Allowed)" : ""
          }`}
          placement="right"
        >
          {item}
        </Tooltip>
      ) : (
        item
      )}
    </StyledNavLink>
  );
};

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;
`;
