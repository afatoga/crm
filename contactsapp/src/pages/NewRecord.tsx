import * as React from "react";
import { Typography, Box, TextField, Stack, Button, Alert, AlertTitle, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

import { PageTitle } from "../components/PageTitle";
//import { Email } from '@mui/icons-material';
import { appRoles } from "../config";
import { isEmptyObject } from "../utils/utilityFunctions";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParty } from "../hooks/useParty";


// interface ILocation {
//   hash: string;
//   key: string;
//   pathname: string;
//   search: string;
//   state: {
//     from: { pathname: string }
//   }
  
// }

export const NewRecord = () => {

  // Local state
  const [recordType, setRecordType] = React.useState<string>('person');

  const {operations} = useParty();
  const [createUpdatePersonHandler, createUpdatePersonRequest] = operations.createUpdatePerson;

  const location:any = useLocation();

  React.useEffect(() => {
    if (location.state?.from.pathname.length) {
      let recordTypeToSelect = '';
      const prevPage = location.state.from.pathname;

      switch(prevPage) {
        case '/people': recordTypeToSelect = 'person';
          break;
        case '/organizations': recordTypeToSelect = 'organization';
          break;
        case '/tags': recordTypeToSelect = 'tag';
          break;
        default: recordTypeToSelect = 'person';
      }

      setRecordType(recordTypeToSelect);
      
    }
  }, [location]);


  let navigate = useNavigate(); //save and view detail
  const { user } = useAuth();

  const customFields = {
    person: [
      {
        label: "Firstname",
        name: "name",
        type: "text",
        required: true,
      },
      {
        label: "Surname",
        name: "surname",
        type: "text",
        required: true,
      },
      {
        label: "Pre-degree",
        name: "preDegree",
        type: "text",
        required: false
      },
      {
        label: "Post-degree",
        name: "postDegree",
        type: "text",
        required: false
      },
      {
        label: "Birthday",
        name: "birthday",
        type: "text",
        required: false
      },
      {
        label: "Status",
        name: "statusId",
        type: "number",//"select",
        required: true
      }
    ],
    organization: [
      {
        label: "Name",
        name: "name",
        type: "text",
        required: true,
      }
    ],
    tag: [

    ]
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
                type: customField.required ? "required" : null,
                params: ["Required"],
              },
              {
                type: "trim",
                params: [],
              },
              {
                type: customField.required ? "min" : null,
                params: [2, "Minimalal length is 2 characters."]
              }
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

  const onSubmit = React.useCallback((values) => {
    if(recordType === 'person') createUpdatePersonHandler({ variables:
       {...values, appUserGroupId: user.currentAppUserGroupId} });
    //reset();
  }, []);

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

  const handleChangeRecordType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecordType((event.target as HTMLInputElement).value);
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
          justifyContent: "center",
        }}
      >
        <Box margin={'0 0 2rem'}>
        <Typography margin={'0 0 0.5rem'}>Switch to: </Typography>
        <FormControl>
      
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        defaultValue={recordType}
        onChange={handleChangeRecordType}
      >
        <FormControlLabel value="person" control={<Radio />} label="Person" />
        <FormControlLabel value="organization" control={<Radio />} label="Organization" />
        <FormControlLabel value="tag" control={<Radio />} label="Tag" />
        
      </RadioGroup>
    </FormControl>
    </Box>

        <PageTitle title={location.pathname.replaceAll("/", " ").trimStart() + " " + recordType} />
        {/* <Typography paragraph textAlign={'center'} fontSize={'1.6rem'}>
          Welcome to ContactsApp.
        </Typography> */}

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

              <Button variant={"contained"} type="submit" sx={{width:'120px'}}>
                Save
              </Button>
              {!isSubmitting && createUpdatePersonRequest.error && <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {createUpdatePersonRequest.error.message}
              </Alert>}
            </Stack>
       
          </form>
        </Box>
      </Box>
    </>
  );
};
