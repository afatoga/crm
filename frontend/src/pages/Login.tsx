import { useCallback, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Stack,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useAppUser } from "../hooks/useAppUser";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { appRoles } from "../config";
import { capitalizeString, isEmptyObject } from "../utils/utilityFunctions";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";

export const Login = () => {
  const { t } = useTranslation();
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
      label: capitalizeString(t(`form.password`)),
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
                params: [t(`form.isRequired`, { fieldName: "email" })],
              },
              {
                type: "trim",
                params: [],
              },
              {
                type: "email",
                params: [t(`form.invalidEmail`)],
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
                params: [
                  t(`form.isRequired`, { fieldName: t(`form.password`) }),
                ],
              },
              {
                type: "trim",
                params: [],
              },
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
          : "/"
      );
    }
  }, [loginRequest, navigate]);

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
        <Typography paragraph textAlign={"center"} fontSize={"1.6rem"}>
          {t("general.welcomeAndLogin")}
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
                />
              ))}

              <Button variant={"contained"} type="submit">
                {t("userActions.login")}
              </Button>
              {!isSubmitting && loginRequest.error && (
                <Alert severity="error">
                  <AlertTitle>{t("general.error")}</AlertTitle>
                  {loginRequest.error.message}
                </Alert>
              )}
            </Stack>
          </form>
        </Box>
      </Box>
    </>
  );
};
