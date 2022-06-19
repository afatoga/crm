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
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';



export const Tags = () => {
  const {t} = useTranslation();
  const { operations } = useTag();
  const [getTagsHandler, getTagsRequest] = operations.getTags;

  const location = useLocation();
  let navigate = useNavigate();
  const {user} = useAuth()

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100, sortable: true, type: 'number'},
    { field: 'name', headerName: t('singleRecord.name'), width: 200, sortable: true, type: 'string' },
    {
      field: 'statusName',
      headerName: 'status',
      type: 'string',
      sortable: true,
      width: 150
    },
    {
      field: "edit",
      headerName: t('general.actions'),
      sortable: false,
      width: 130,
      // disableClickEventBubbling: true,
      renderCell: ({id}) => {
       
        return (
          <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => navigate(`/tags/${id}`)} >
            {t('userActions.edit')}
          </Button>
        );
      }
    },
    // { 
    //   field: '',
    //   headerName: 'action',
    //   width: 150,
    // }
    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params: GridValueGetterParams) =>
    //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    // },
  ];

 React.useEffect(() => {
  getTagsHandler({variables:{appUserGroupId: user.currentAppUserGroupId}})
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

  const tagsData = getTagsRequest.data ? getTagsRequest.data.tagsByAppUserGroup : false;

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
        <PageTitle title={t(`pageTitles.tags`)} />


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
          {tagsData &&
            <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={tagsData}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              // pageSize={10}
              columnBuffer={8}
              autoHeight
              disableSelectionOnClick
              //onRowClick={handleOnRowClick}
              //checkboxSelection
            />
          </div>
            }
          </Box>

        </Stack>
      </Box>
    </>
  );


};