import { useCallback, useContext, useEffect } from "react";
import { Typography, Box, TextField, Stack, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useAppUser } from "../hooks/useAppUser";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

import { PageTitle } from "../components/PageTitle";
//import { Email } from '@mui/icons-material';
import { appRoles } from "../config";
import { isEmptyObject } from "../utils/utilityFunctions";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export const Login = () => {
  const { operations } = useAppUser();
  const [loginHandler, loginRequest] = operations.login;

  const location = useLocation();
  let navigate = useNavigate();
  const { signin } = useAuth();

  const customFields = [
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

  // Extend customFields with validation based on type
  const useCustomFieldsExtendValidation = (customFields) => {
    return customFields.map((customField) => {
      switch (customField.type) {
        case "email":
          return {
            ...customField,
            validationType: "string",
            validations: [
              {
                type: "required",
                params: ["Required"],
              },
              {
                type: "trim",
                params: [],
              },
              {
                type: "email",
                params: ["Not a valid email"],
              },
            ],
          };
        case "password":
          return {
            ...customField,
            validationType: "string",
            validations: [
              {
                type: "required",
                params: ["Required"],
              },
              {
                type: "trim",
                params: [],
              },
              // {
              //   type: "min",
              //   params: [6, "Minimal length is 6 characters"]
              // },
              // {
              //   type: "matches",
              //   params: [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,  "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"]
              // }
            ],
          };
        default:
          return customField;
      }
    });
  };

  // This function creates the dynamic Yup schema, thanks to vijayranghar (https://github.com/jquense/yup/issues/559)
  const useCustomFieldsDynamicSchema = (schema, config) => {
    const { name, validationType, validations = [] } = config;
    if (!yup[validationType]) {
      return schema;
    }
    let validator = yup[validationType]();
    validations.forEach((validation) => {
      const { params, type } = validation;
      if (!validator[type]) {
        return;
      }
      validator = validator[type](...params);
    });
    schema[name] = validator;
    return schema;
  };

  // Create the dynamic form
  // Split out for readability

  // First extend the data with our validations
  const dynamicFormData = useCustomFieldsExtendValidation(customFields);

  // Create schema based on added validations
  const customFieldsSchema = dynamicFormData.reduce(
    useCustomFieldsDynamicSchema,
    {}
  );

  // Create Yup schema
  const dynamicValidationSchema = yup.object().shape(customFieldsSchema);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(dynamicValidationSchema),
    mode: "onTouched",
  });

  const onSubmit = useCallback((values) => {
    loginHandler({ variables: values });
    //reset();
  }, []);


  useEffect(() => {
    if (loginRequest.data) {
      const userData = loginRequest.data.login?.appUser;
      if (!userData || isEmptyObject(userData)) return;

      //localStorage.setItem('accessToken', loginRequest.data.login.accessToken);
      const token = loginRequest.data.login.accessToken;
      signin(token, {
        ...userData,
        currentAppUserGroupId:
          userData.appUserGroupRelationships.length &&
          userData.appUserGroupRelationships[0].appUserGroupId,
        currentRole:
          userData.appUserGroupRelationships.length &&
          appRoles[userData.appUserGroupRelationships[0].appUserRoleId],
      });

      navigate(
        (location as any).state?.from
          ? (location as any).state.from.pathname
          : "/dashboard"
      );
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
      <Box
        sx={{
          p: {
            xs: 0,
            md: 3,
          },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* <PageTitle title={location.pathname.replaceAll("/", " ").trimStart()} /> */}
        <Typography paragraph textAlign={'center'} fontSize={'1.6rem'}>
          Welcome to ContactsApp.
        </Typography>

        <Box
          sx={{
            width: {
              xs: "100%", // theme.breakpoints.up('xs')
              sm: 400, // theme.breakpoints.up('sm')
              // md: 300, // theme.breakpoints.up('md')
              lg: 360, // theme.breakpoints.up('lg')
              //xl: 500, // theme.breakpoints.up('xl')
            },
            margin: "1.5rem auto 0",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {customFields.map((item, index) => (
                <Controller
                  key={index}
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <TextField
                      name={name}
                      type={item.type}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
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
                  // rules={{ required: { value: true, message: "Invalid input" } }}
                />
              ))}

              <Button variant={"contained"} type="submit">
                Login
              </Button>
            </Stack>
            {!isSubmitting && loginRequest.error && loginRequest.error.message}
          </form>
        </Box>
      </Box>
    </>
  );
};
