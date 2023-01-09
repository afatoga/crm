import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router";

import { useAuth } from "../hooks/useAuth";

import { getPageTitleCode } from "../utils/utilityFunctions";
import { PageTitle } from "../components/PageTitle";

import { useTranslation } from "react-i18next";

export const AccountSettings = () => {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const titleCode = getPageTitleCode(location.pathname);

  const initValue = localStorage.getItem("af-lang")
    ? localStorage.getItem("af-lang")
    : "en";
  const [language, setLanguage] = React.useState<string>(initValue);

  const handleChange = (event: SelectChangeEvent) => {
    const lang = event.target.value;
    if (lang !== "cs" && lang !== "en") return;

    setLanguage(lang);
    localStorage.setItem("af-lang", lang);
    i18n.changeLanguage(lang);
  };
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
        <PageTitle title={t(titleCode)} />

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
          <Box sx={{ display: "block" }}>
            {t("accountSettings.currentAppUserGroup")}:{" "}
            {user.currentAppUserGroupId}
          </Box>
          <Box sx={{ display: "block" }}>
            {t("accountSettings.currentPermissions")}: {user.currentRole}
          </Box>

          <Box sx={{ display: "block" }}>
            <FormControl sx={{ mt: 4, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small">
                {t("accountSettings.language.label")}
              </InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={language}
                label="{t('accountSettings.language.label')}"
                onChange={handleChange}
              >
                <MenuItem value="cs">
                  <em>{t("accountSettings.language.cs")}</em>
                </MenuItem>
                <MenuItem value="en">
                  {t("accountSettings.language.en")}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Box>
    </>
  );
};
