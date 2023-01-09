import { Box, Stack, Typography } from "@mui/material";

import { PageTitle } from "../components/PageTitle";

import { useTranslation } from "react-i18next";
import { foundResultsVar } from "../hooks/useSearch";
import { useReactiveVar } from "@apollo/client";
import { MultiLevelList } from "../components/List";

export const SearchResults = () => {
  const { t } = useTranslation();

  const foundResults = useReactiveVar(foundResultsVar);

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
          <Box sx={{ display: "block", padding: "0 0 1rem" }}>
            {foundResults.length > 0 ? (
              <MultiLevelList data={foundResults} listName="searchResults" />
            ) : (
              <Typography variant="subtitle1">
                {t("general.noRecords")}
              </Typography>
            )}
          </Box>
        </Stack>
      </Box>
    </>
  );
};
