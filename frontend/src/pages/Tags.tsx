import * as React from "react";

import { Box, Stack, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useTag } from "../hooks/useTag";
import { useAuth } from "../hooks/useAuth";
import { Edit as EditIcon } from "@mui/icons-material";
import { PageTitle } from "../components/PageTitle";
import { useTranslation } from "react-i18next";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export const Tags = () => {
  const { t } = useTranslation();
  const { operations } = useTag();
  const [getTagsHandler, getTagsRequest] = operations.getTags;

  const location = useLocation();
  let navigate = useNavigate();
  const { user } = useAuth();

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      sortable: true,
      type: "number",
    },
    {
      field: "name",
      headerName: t("singleRecord.name"),
      width: 200,
      sortable: true,
      type: "string",
    },
    {
      field: "statusName",
      headerName: "status",
      type: "string",
      sortable: true,
      width: 150,
    },
    {
      field: "edit",
      headerName: t("general.actions"),
      sortable: false,
      width: 130,
      renderCell: ({ id }) => {
        return (
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/tags/${id}`)}
          >
            {t("userActions.edit")}
          </Button>
        );
      },
    },
  ];

  React.useEffect(() => {
    getTagsHandler({
      variables: { appUserGroupId: user.currentAppUserGroupId },
    });
  }, []);

  const tagsData = getTagsRequest.data
    ? getTagsRequest.data.tagsByAppUserGroup
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
            {tagsData && (
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={tagsData}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  columnBuffer={8}
                  autoHeight
                  disableSelectionOnClick
                />
              </div>
            )}
          </Box>
        </Stack>
      </Box>
    </>
  );
};
