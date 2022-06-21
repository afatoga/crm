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
import { useTag } from "../hooks/useTag";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { Edit as EditIcon } from "@mui/icons-material";
import { PageTitle } from "../components/PageTitle";
import { appRoles } from "../config";
import { groupBy } from "../utils/utilityFunctions";
import { useTranslation } from "react-i18next";
import { useSearch } from "../hooks/useSearch";



export const SearchResults = () => {
  const {t} = useTranslation();
  const { operations } = useSearch();
  // const [getSearchResultsHandler, getSearchResultsRequest] = operations.getSearchResults;

  const location = useLocation();
  let navigate = useNavigate();
  const {user} = useAuth()

  

 React.useEffect(() => {
  //getTagsHandler({variables:{appUserGroupId: user.currentAppUserGroupId}})
 }, [])

//  const handleOnRowClick = (params) => {
//   console.log(params);
// };

  // React.useEffect(() => {
  //   if (getTagsRequest.called) {

  //     getTagsRequest.refetch();

  //   }
  // }, [getTagsRequest]);


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

  // const tagsData = getTagsRequest.data ? getTagsRequest.data.tagsByAppUserGroup : false;

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
        <PageTitle title={t(`pageTitles.searchResults`)} />


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


        <Box sx={{display:'block'}}>
         
          </Box>

        </Stack>
      </Box>
    </>
  );


};