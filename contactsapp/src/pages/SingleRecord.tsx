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
  MenuItem,
  Autocomplete,
  CircularProgress
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

import { PageTitle } from "../components/PageTitle";
//import { Email } from '@mui/icons-material';
import { appRoles } from "../config";
import { isEmptyObject } from "../utils/utilityFunctions";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParty } from "../hooks/useParty";


export const SingleRecord = () => {
  // Local state
  const [recordType, setRecordType] = React.useState<string>("");
  const [recordLoaded, setRecordLoaded] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);

  const { operations } = useParty();
  const [getPersonByIdHandler, getPersonByIdRequest] =
    operations.getPersonById;
  const [getStatusListHandler, getStatusListRequest] =
    operations.getStatusList;

  const getRecordData = (attrName: string = null) => {
    if (!recordLoaded) return null;

    let recordData = {};
    if (recordType === 'person') {
      recordData = getPersonByIdRequest.data.personById;
    }
    if (!attrName) return recordData;

    return (recordData[attrName]) ? recordData[attrName] : "";
  } 

  const [createUpdatePersonHandler, createUpdatePersonRequest] =
    operations.createUpdatePerson;

  const location: any = useLocation();
  const { id: recordIdString } = useParams();
  const recordId = parseInt(recordIdString);

  let navigate = useNavigate(); //save and view detail
  const { user } = useAuth();
  
  // console.log(user);

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
        required: false,
      },
      {
        label: "Post-degree",
        name: "postDegree",
        type: "text",
        required: false,
      },
      {
        label: "Birthday",
        name: "birthday",
        type: "text",
        required: false,
      },
      {
        label: "Status",
        name: "statusId",
        type: "autocomplete", //"select",
        required: true,
      },
    ],
    organization: [
      {
        label: "Name",
        name: "name",
        type: "text",
        required: true,
      },
    ],
    tag: [],
  };

  // Extend customFields with validation based on type
  const useCustomFieldsExtendValidation = (recordType: string, customFields: any) => {

    if (!recordType.length) return {};

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
  const dynamicFormData = useCustomFieldsExtendValidation(recordType, customFields);

  // Create schema based on added validations
  const customFieldsSchema = !isEmptyObject(dynamicFormData) && dynamicFormData.reduce(
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
    console.log(values)
    if (recordType === 'person') {
      createUpdatePersonHandler({
        variables: {
          ...values,
          partyId: recordId,
          birthday: values.birthday.length ? values.birthday : null,
          statusId: values.statusId ? values.statusId : null,
          preDegree: values.preDegree.length ? values.preDegree : null,
          postDegree: values.postDegree.length ? values.postDegree : null,
          appUserGroupId: user.currentAppUserGroupId,
        },
      });
    }
  }, [recordType]);

  React.useEffect(() => {
    getStatusListHandler();
  }, [])

  
  React.useEffect(() => {
    //get person's data

    if (recordType === 'person') { //hook for getStatusListRequest.data ?
      getPersonByIdHandler({variables:{
        id: recordId,
        appUserGroupId: user.currentAppUserGroupId
      }})
    }

  }, [recordId, recordType]);

  React.useEffect(() => {

    if (!recordLoaded && getPersonByIdRequest.data?.personById) { //exists

      const personData = getPersonByIdRequest.data.personById;
      setRecordLoaded(true);

      reset({values:{
        name: personData.name,
        statusId: personData.statusid
      }})
    }

  }, [getPersonByIdRequest])

  React.useEffect(() => {

      let recordTypeToSelect = "";
      const pathname = location.pathname;
      
      if (pathname.indexOf('/people/') === 0) {
        recordTypeToSelect = "person";
      }
      else if (pathname.indexOf('/organizations/') === 0) {
        recordTypeToSelect = "organization";
      }
      else if (pathname.indexOf('/tags/') === 0) {
        recordTypeToSelect = "tag";
      }

      setRecordType(recordTypeToSelect);
    
  }, [location]);


  const getSelectOptions = (fieldName: string) => {

    if (fieldName === 'statusId') {
      if (getStatusListRequest.data?.statusList?.length) {
        const statusList = getStatusListRequest.data.statusList;
        return statusList.map((item:any) => ({name:item.name, id:item.id}))
      }

      //return [];
    }

  }

  const getOptionLabel = (option: number | {id:string, name: string}) => {

    if (!option || !getStatusListRequest.data) return '';

    if (typeof option === 'number') {
      if (getStatusListRequest.data?.statusList?.length) {
        const statusList = getStatusListRequest.data.statusList;
        const found = statusList.find((item:any) => (option === parseInt(item.id)))
        if (found) return found.name;
      }
    }

    else return option.name;

    
  }

  const CustomFormField = ({controllerProps, fieldData}) => {
    
    if (fieldData.type === 'text') {
      return (
              <TextField
                name={fieldData.name}
                type={fieldData.type}
                value={controllerProps.value}
                onChange={controllerProps.onChange}
                onBlur={controllerProps.onBlur}
                label={fieldData.label}
                error={Boolean(errors[fieldData.name])}
                helperText={
                  errors[fieldData.name] ? errors[fieldData.name].message : ""
                }
                disabled={user.currentRole !== 'ADMIN' && user.currentRole !== "MOD"}
                //size={(item.name === 'name' || item.name === 'surname' ) ? 'medium' : 'small'}
              />
      )
    } 

        
        

    else if (fieldData.type === 'autocomplete') {
      return (
        <Autocomplete 
        id={fieldData.name}
        // sx={{ width: 300 }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        value={controllerProps.value ? controllerProps.value : ""}
        onChange={(event: any, newValue: {id: string, name: string;}) => {
          if (newValue) controllerProps.onChange(parseInt(newValue.id))}}
        isOptionEqualToValue={(option:any, value) => {if (!value.length) return true; return parseInt(option.id) === value}}
        getOptionLabel={getOptionLabel}
        //getOptionLabel={(option:any) => {return option.name}}
        options={getSelectOptions(fieldData.name)}
        loading={getStatusListRequest.loading}
        renderInput={(params) => {
          
          return(
          <TextField
            {...params}
            label={fieldData.label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {getStatusListRequest.loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
          )}
        }
        />
      )
    }

    return null;

  }

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

        <PageTitle
          title={
            "Person"
          }
        />
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
          {recordType.length && recordLoaded && getStatusListRequest.data &&  <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {customFields[recordType].map((item, index) => (
                <Controller
                  key={index}
                  render={({ field }) => (
                    <CustomFormField controllerProps={field} fieldData={item} />
                  )}
                  control={control}
                  name={item.name}
                  defaultValue={getRecordData(item.name)}
                />
              ))}

              <Button
                variant={"contained"}
                type="submit"
                sx={{ width: "120px" }}
              >
                Save
              </Button>
              {!isSubmitting && createUpdatePersonRequest.error && (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  {createUpdatePersonRequest.error.message}
                </Alert>
              )}
            </Stack>
          </form>}
        </Box>
      </Box>
    </>
  );
};
