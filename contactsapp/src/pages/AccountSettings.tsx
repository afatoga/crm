import * as React from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Typography, Box, TextField, Stack, Button, Alert, AlertTitle } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useParty } from "../hooks/useParty";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { DataGrid } from '@mui/x-data-grid';
import {getPageTitleCode} from '../utils/utilityFunctions';
import { PageTitle } from "../components/PageTitle";
import { appRoles } from "../config";
import { useTranslation } from "react-i18next";
// import {PageProps} from "../types/Route";



export const AccountSettings = () => {
  
  //const { operations } = useParty();
  //const [getPeopleHandler, getPeopleRequest] = operations.getPeople;
  const {i18n, t} = useTranslation();
  const location = useLocation();
  let navigate = useNavigate();
  const {user} = useAuth();
  const titleCode = getPageTitleCode(location.pathname);
  const [language, setLanguage] = React.useState<string>('cs');

  const handleChange = (event: SelectChangeEvent) => {
    const lang = event.target.value;
    if (lang!== 'cs' && lang!== 'en') return;
    
    setLanguage(lang);
    localStorage.setItem('af-lang', lang);
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
          <Box sx={{display:'block'}}>
          {t('accountSettings.currentAppUserGroup')}: {user.currentAppUserGroupId}
          </Box>
          <Box sx={{display:'block'}}>
          {t('accountSettings.currentPermissions')}: {user.currentRole}
          </Box>

        <Box sx={{display:'block'}}>
        <FormControl sx={{ mt: 4, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small">{t('accountSettings.language.label')}</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={language}
        label="{t('accountSettings.language.label')}"
        onChange={handleChange}
      >
        <MenuItem value="cs">
          <em>{t('accountSettings.language.cs')}</em>
        </MenuItem>
        <MenuItem value="en">{t('accountSettings.language.en')}</MenuItem>
      </Select>
    </FormControl>
          </Box>

        </Stack>
      </Box>
    </>
  );


};
