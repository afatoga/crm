import * as React from "react";
import { GroupedVirtuoso } from "react-virtuoso";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import { Box, Button, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useParty } from "../hooks/useParty";
import { useAuth } from "../hooks/useAuth";

import { PageTitle } from "../components/PageTitle";
import { groupBy } from "../utils/utilityFunctions";
import { useTranslation } from "react-i18next";

const userSorter = (a, b) => {
  return a.surname.localeCompare(b.surname);
};

export function getGroupedPeople(data) {
  if (!Array.isArray(data)) return false;

  const people = [...data].sort(userSorter);
  const groupedUsers = groupBy(people, (person) => person.surname[0]);
  const groupCounts = Object.values(groupedUsers).map(
    (persons: any) => persons.length
  );
  const groups = Object.keys(groupedUsers);

  return { people, groupCounts, groups };
}

export const People = () => {
  const { t } = useTranslation();
  const { operations } = useParty();
  const [getPeopleHandler, getPeopleRequest] = operations.getPeople;

  const location = useLocation();
  let navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    getPeopleHandler({
      variables: { appUserGroupId: user.currentAppUserGroupId },
    });
  }, []);

  const peopleData = getPeopleRequest.data
    ? getGroupedPeople(getPeopleRequest.data.personsByAppUserGroup)
    : false;

  return (
    <>
      <Box
        sx={{
          p: {
            xs: 0,
            md: 3,
          },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PageTitle title={t(`pageTitles.people`)} />

        <Stack
          sx={{
            width: {
              xs: "100%", // theme.breakpoints.up('xs')
              //sm: 400, // theme.breakpoints.up('sm')

              md: 800, // theme.breakpoints.up('md')
              //lg: 600, // theme.breakpoints.up('lg')
              xl: 680, // theme.breakpoints.up('xl')
            },
          }}
        >
          <Button
            variant={"contained"}
            sx={{ my: 3, width: "150px" }}
            onClick={() =>
              navigate("/new", {
                state: { from: { pathname: location.pathname } },
              })
            }
          >
            {t("userActions.addNew")}
          </Button>

          <Box sx={{ display: "block" }}>
            {peopleData && (
              <GroupedVirtuoso
                style={{ height: 800 }}
                groupCounts={peopleData.groupCounts}
                components={MUIComponents as any}
                groupContent={(index) => {
                  return <div>{peopleData.groups[index]}</div>;
                }}
                itemContent={(index) => {
                  const user = peopleData.people[index];
                  return (
                    <Box
                      sx={{ display: "flex", cursor: "pointer" }}
                      onClick={() => navigate(`/people/${user.partyId}`)}
                    >
                      <ListItemAvatar>
                        <Avatar>{user.initials}</Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={user.surname + " " + user.name}
                        secondary={<span>{user.description}</span>}
                      />
                    </Box>
                  );
                }}
              />
            )}
          </Box>
        </Stack>
      </Box>
    </>
  );
};

const MUIComponents = {
  List: React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    (props, listRef) => {
      return (
        <List
          style={{ padding: 0, ...props?.style, margin: 0 }}
          component="div"
          ref={listRef}
        >
          {props.children}
        </List>
      );
    }
  ),

  Item: ({ children, ...props }) => {
    return (
      <ListItem component="div" {...props} style={{ margin: 0 }}>
        {children}
      </ListItem>
    );
  },

  Group: ({ children, style, ...props }) => {
    return (
      <ListSubheader
        component="div"
        {...props}
        style={{
          ...style,
          margin: 0,
        }}
      >
        {children}
      </ListSubheader>
    );
  },
};
