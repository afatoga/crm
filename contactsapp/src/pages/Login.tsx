import { useCallback, useContext, useEffect } from "react";
import { Typography, Box, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useAppUser } from "../hooks/useAppUser";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

import { PageTitle } from "../components/PageTitle";
//import { Email } from '@mui/icons-material';
import { appRoles } from '../config';
import {isEmptyObject} from "../utils/utilityFunctions";

export const Login = () => {
  const { operations } = useAppUser();
  const [loginHandler, loginRequest] = operations.login;

  const location = useLocation();
  let navigate = useNavigate();
  const { signin } = useAuth()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = useCallback((values) => {
    loginHandler({ variables: values });
    reset();
  }, []);

  const fields = [
    {
      label: "Email",
      name: "email",
      type: "email",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
    },
  ];

  useEffect(() => {

    if (loginRequest.data) {
      const userData = loginRequest.data.login?.appUser;
      if (!userData || isEmptyObject(userData)) return;

      //localStorage.setItem('accessToken', loginRequest.data.login.accessToken);
      const token = loginRequest.data.login.accessToken;
      signin(token, {...userData, 
        currentAppUserGroupId: userData.appUserGroupRelationships.length && userData.appUserGroupRelationships[0].appUserGroupId, 
        currentRole: userData.appUserGroupRelationships.length && appRoles[userData.appUserGroupRelationships[0].appUserRoleId]
      });

      navigate(((location as any).state?.from) ? (location as any).state.from.pathname : '/dashboard');
    }
  }, [loginRequest, navigate]);

//   {
//     "login": {
//         "appUser": {
//             "id": "2",
//             "appUserGroupRelationships": [],
//             "__typename": "AppUser"
//         },
//         "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhZmF0b2dhQGdtYWlsLmNvbSIsImlhdCI6MTY1MDY0MDI3NiwiZXhwIjoxNjUwNjQxMTc2fQ.f4tMiTcAx-LdvDC_-TiyMBQxMFEt0HKgd603LxGoVa4",
//         "__typename": "AppUserLoginResponse"
//     }
// }

  return (
    <>
      <PageTitle title={location.pathname.replaceAll("/", " ").trimStart()} />
      <Box sx={{ p: 3 }}>
        <Typography paragraph>
          This is our login page
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((item, index) => (
            <Controller
              key={index}
              render={({ field: { name, value, onChange } }) => (
                <TextField
                  name={name}
                  value={value}
                  onChange={onChange}
                  label={item.label}
                  error={Boolean(errors[item.name])}
                  helperText={
                    errors[item.name] ? errors[item.name].message : ""
                  }
                />
              )}
              control={control}
              name={item.name}
              defaultValue=""
              rules={{ required: { value: true, message: "Invalid input" } }}
            />
          ))}

          <input type="submit" />
        </form>
        {loginRequest.error && loginRequest.error.message}
      </Box>
    </>
  );
};
