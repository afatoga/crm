import * as React from "react";
import { GroupedVirtuoso } from 'react-virtuoso'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'
import { Typography, Box, TextField, Stack, Button, Alert, AlertTitle } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useParty } from "../hooks/useParty";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { DataGrid } from '@mui/x-data-grid';

import { PageTitle } from "../components/PageTitle";
import { appRoles } from "../config";
import { groupBy } from "../utils/utilityFunctions";
import { useTranslation } from "react-i18next";
//import * as yup from "yup";
//import { yupResolver } from "@hookform/resolvers/yup";

// export const getUser = (index) => {
//   if (!generated[index]) {
//     generated[index] = user(index)
//   }

//   return generated[index]
// }

const recordSorter = (a, b) => {

  return a.name.localeCompare(b.name);  
}

export function getGroupedParties(data) {

  if (!Array.isArray(data)) return false;

  const parties = [...data].sort(recordSorter)
  const groupedParties = groupBy(parties, (party) => party.name[0])
  const groupCounts = Object.values(groupedParties).map((parties: any) => parties.length)
  const groups = Object.keys(groupedParties)

  return { parties, groupCounts, groups }
}

export const Organizations = () => {
  const {t} = useTranslation();
  const { operations } = useParty();
  const [getOrganizationsHandler, getOrganizationsRequest] = operations.getOrganizations;

  const location = useLocation();
  let navigate = useNavigate();
  const {user} = useAuth()
  //const { signin } = useAuth();

  // const loadMore = React.useCallback(() => {
  //   return setTimeout(() => {
  //     alert('loads more...');
  //     //setUsers((users) => [...users, ...generateUsers(100, users.length)])
  //   }, 200)
  // }, []) //setUsers

 React.useEffect(() => {
  getOrganizationsHandler({variables:{appUserGroupId: user.currentAppUserGroupId}})
 }, [])

  // React.useEffect(() => {
  //   if (getOrganizationsRequest.called) {

  //     getOrganizationsRequest.refetch();

  //   }
  // }, [getOrganizationsRequest]);


  // React.useEffect(() => {
  //   const timeout = loadMore()
  //   return () => clearTimeout(timeout)
  // }, [])


  // const Footer = () => {
  //   return (
  //     <div
  //       style={{
  //         padding: '2rem',
  //         display: 'flex',
  //         justifyContent: 'center',
  //       }}
  //     >
  //       Loading...
  //     </div>
  //   )
  // }

  const partiesData = getOrganizationsRequest.data ? getGroupedParties(getOrganizationsRequest.data.organizationsByAppUserGroup) : false;

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
        <PageTitle title={t(`pageTitles.organizations`)} />


        <Stack
          sx={{
            width: {
              xs: "100%", // theme.breakpoints.up('xs')
              //sm: 400, // theme.breakpoints.up('sm')

              md: 800, // theme.breakpoints.up('md')
              //lg: 600, // theme.breakpoints.up('lg')
              xl: 680, // theme.breakpoints.up('xl')
            },
            //margin: "1.5rem auto 0",
          }}
        >

      
        <Button variant={"contained"} sx={{my: 3 ,width: '150px'}} onClick={() =>  navigate('/new', {state: {from: {pathname: location.pathname}}})}>
                {t('userActions.addNew')}
        </Button>
       

        <Box sx={{display:'block'}}>
          {partiesData &&
            <GroupedVirtuoso
              style={{ height: 800 }}
              groupCounts={partiesData.groupCounts}
              components={MUIComponents as any}
              groupContent={(index) => {
                return <div>{partiesData.groups[index]}</div>
              }}
              itemContent={(index) => {
                const party = partiesData.parties[index]
                return (
                  <Box sx={{display:'flex', cursor: 'pointer'}} onClick={() => navigate(`/organizations/${party.partyId}`)}>
                    <ListItemAvatar>
                      <Avatar>{party.initials}</Avatar>
                    </ListItemAvatar>

                    <ListItemText primary={party.name} /*secondary={<span>{user.description}</span>} */ />
                  </Box>
                )
              }}
            />}
          </Box>

        </Stack>
      </Box>
    </>
  );


};

//type DivProps = React.HTMLProps<HTMLDivElement>

const MUIComponents = {
  List: React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>((props, listRef) => {
    return (
      <List style={{ padding: 0, ...props?.style, margin: 0 }} component="div" ref={listRef}>
        {props.children}
      </List>
    )
  }),

  Item: ({ children, ...props }) => {
    return (
      <ListItem component="div" {...props} style={{ margin: 0 }} >
        {children}
      </ListItem>
    )
  },

  Group: ({ children, style, ...props }) => {
    return (
      <ListSubheader
        component="div"
        {...props}
        style={{
          ...style,
          //backgroundColor: 'white',
          margin: 0,
        }}
      >
        {children}
      </ListSubheader>
    )
  },
}