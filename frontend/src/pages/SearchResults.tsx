import * as React from "react";

import {  Box,  Stack, Typography} from "@mui/material";

import { PageTitle } from "../components/PageTitle";

import { useTranslation } from "react-i18next";
import { useSearch, foundResultsVar } from "../hooks/useSearch";
import { useReactiveVar,  } from "@apollo/client";
import { MultiLevelList } from "../components/List";
import { useAuth } from "../hooks/useAuth";
//import { GET_SEARCH_RESULTS } from "../api/search/queries";



export const SearchResults = () => {
  const {t} = useTranslation();
  //const { operations } = useSearch();
  //const [getSearchResultsHandler, getSearchResultsRequest] = operations.getSearchResults;

  //const location = useLocation();
  //let navigate = useNavigate();
  const {user} = useAuth();
  //const client = useApolloClient();

  const foundResults = useReactiveVar(foundResultsVar);
  //const [searchResults, setSearchResults] = React.useState<any[]>([]);


  

//  React.useEffect(() => {


//  }, [foundResults])


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

        
        <Box sx={{display:'block', padding: '0 0 1rem'}}>
          {foundResults.length > 0 ?
         <MultiLevelList data={foundResults} listName="searchResults" />
        : <Typography variant="subtitle1">{t('general.noRecords')}</Typography>}
          </Box>

        </Stack>
      </Box>
    </>
  );


};