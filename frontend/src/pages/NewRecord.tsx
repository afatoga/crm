import * as React from "react";
import {
  Typography,
  Box,
  TextField,
  Stack,
  Button,
  Alert,
  AlertTitle,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

import { PageTitle } from "../components/PageTitle";
import { capitalizeString } from "../utils/utilityFunctions";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParty } from "../hooks/useParty";
import { useTag } from "../hooks/useTag";
import { useTranslation } from "react-i18next";

export const NewRecord = () => {
  const { t } = useTranslation();
  const [recordType, setRecordType] = React.useState<string>("person");

  const { operations } = useParty();
  const { operations: tagOperations } = useTag();
  const [createPersonHandler, createPersonRequest] = operations.createPerson;
  const [createOrganizationHandler, createOrganizationRequest] =
    operations.createOrganization;
  const [createTagHandler, createTagRequest] = tagOperations.createTag;

  const location: any = useLocation();

  React.useEffect(() => {
    if (location.state?.from.pathname.length) {
      let recordTypeToSelect = "";
      const prevPage = location.state.from.pathname;

      switch (prevPage) {
        case "/people":
          recordTypeToSelect = "person";
          break;
        case "/organizations":
          recordTypeToSelect = "organization";
          break;
        case "/tags":
          recordTypeToSelect = "tag";
          break;
        default:
          recordTypeToSelect = "person";
      }

      setRecordType(recordTypeToSelect);
    }
  }, [location]);

  let navigate = useNavigate();
  const { user } = useAuth();

  const customFields = {
    person: [
      {
        label: t("singleRecord.firstname"),
        name: "name",
        type: "text",
        required: true,
      },
      {
        label: t("singleRecord.surname"),
        name: "surname",
        type: "text",
        required: true,
      },
      {
        label: t("singleRecord.preDegree"),
        name: "preDegree",
        type: "text",
        required: false,
      },
      {
        label: t("singleRecord.postDegree"),
        name: "postDegree",
        type: "text",
        required: false,
      },
      {
        label: t("singleRecord.birthday"),
        name: "birthday",
        type: "text",
        required: false,
      },
    ],
    organization: [
      {
        label: t("singleRecord.name"),
        name: "name",
        type: "text",
        required: true,
      },
    ],
    tag: [
      {
        label: t("singleRecord.name"),
        name: "name",
        type: "text",
        required: true,
      },
    ],
  };

  // Extend customFields with validation based on type
  const useCustomFieldsExtendValidation = (customFields) => {
    return customFields[recordType].map((customField) => {
      switch (customField.type) {
        case "text":
          return {
            ...customField,
            validationType: "string",
            validations: [
              {
                type: customField.required ? "required" : "nullable",
                params: [
                  t(`form.isRequired`, {
                    fieldName: t(`singleRecord.${customField.name}`),
                  }),
                ],
              },
              {
                type: "trim",
                params: [],
              },
              {
                type: customField.required ? "min" : null,
                params: [2, "Minimalal length is 2 characters."],
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

  const onSubmit = React.useCallback(
    (values: any) => {
      if (recordType === "person")
        createPersonHandler({
          variables: {
            ...values,
            birthday: values.birthday.length ? values.birthday : null,
            appUserGroupId: user.currentAppUserGroupId,
          },
        });
      if (recordType === "organization")
        createOrganizationHandler({
          variables: {
            ...values,
            appUserGroupId: user.currentAppUserGroupId,
          },
        });
      if (recordType === "tag")
        createTagHandler({
          variables: {
            ...values,
            appUserGroupId: user.currentAppUserGroupId,
          },
        });
    },
    [recordType]
  );

  const handleChangeRecordType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRecordType((event.target as HTMLInputElement).value);
  };

  React.useEffect(() => {
    reset();
  }, [recordType]);
  React.useEffect(() => {
    if (createPersonRequest.data?.createPerson.partyId) {
      const newRecordId = createPersonRequest.data?.createPerson.partyId;
      navigate("/people/" + newRecordId);
    } else if (createOrganizationRequest.data?.createOrganization.partyId) {
      const newRecordId =
        createOrganizationRequest.data?.createOrganization.partyId;
      navigate("/organizations/" + newRecordId);
    } else if (createTagRequest.data?.createTag.id) {
      const newRecordId = createTagRequest.data?.createTag.id;
      navigate("/tags/" + newRecordId);
    }
  }, [createPersonRequest, createOrganizationRequest, createTagRequest]);

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
        <Box margin={"0 0 2rem"}>
          <Typography margin={"0 0 0.5rem"}>
            {t("userActions.switchTo")}:
          </Typography>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={recordType}
              onChange={handleChangeRecordType}
            >
              <FormControlLabel
                value="person"
                control={<Radio />}
                label={t("entityType.person")}
              />
              <FormControlLabel
                value="organization"
                control={<Radio />}
                label={t("entityType.organization")}
              />
              <FormControlLabel
                value="tag"
                control={<Radio />}
                label={t("entityType.tag")}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <PageTitle title={t(`pageTitles.new${capitalizeString(recordType)}`)} />

        <Box
          sx={{
            width: {
              xs: "100%", // theme.breakpoints.up('xs')
              sm: 400, // theme.breakpoints.up('sm')
              // md: 300, // theme.breakpoints.up('md')
              lg: 360, // theme.breakpoints.up('lg')
              //xl: 500, // theme.breakpoints.up('xl')
            },
            margin: "1.5rem 0",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {customFields[recordType].map((item, index) => (
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

              <Button
                variant={"contained"}
                type="submit"
                sx={{ width: "120px" }}
              >
                {t("userActions.save")}
              </Button>
              {!isSubmitting && createPersonRequest.error && (
                <Alert severity="error">
                  <AlertTitle>{t("general.error")}</AlertTitle>
                  {createPersonRequest.error.message}
                </Alert>
              )}
            </Stack>
          </form>
        </Box>
      </Box>
    </>
  );
};
