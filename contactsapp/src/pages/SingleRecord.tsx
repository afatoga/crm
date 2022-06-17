import * as React from "react";
import {
  Box,
  Stack,
  Button,
  Alert,
  AlertTitle
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
import { useTag } from "../hooks/useTag";
import { PartyRelationships } from "../components/Templates/PartyRelationships";
import {CustomFormField} from '../components/Form/CustomFormField';

export const SingleRecord = () => {
  // Local state
  const [recordType, setRecordType] = React.useState<string>("");
  const [recordLoaded, setRecordLoaded] = React.useState<boolean>(false);
 

  
  const { operations } = useParty();
  const { operations:tagOperations } = useTag();


  const [getPersonByIdHandler, getPersonByIdRequest] =
    operations.getPersonById;
  const [getOrganizationByIdHandler, getOrganizationByIdRequest] =
    operations.getOrganizationById;
  const [getTagByIdHandler, getTagByIdRequest] =
    tagOperations.getTagById;
  const [getStatusListHandler, getStatusListRequest] =
    operations.getStatusList;

  const getRecordData = (attrName: string = null) => {
    if (!recordLoaded) return "";

    let recordData = {};

    if (recordType === 'person') {
      recordData = getPersonByIdRequest.data?.personById;
    }
    else if (recordType === 'organization') {
      recordData = getOrganizationByIdRequest.data?.organizationById;
    }
    else if (recordType === 'tag') {
      recordData = getTagByIdRequest.data?.tagById;
    }

    if (!recordData || isEmptyObject(recordData)) return ""; //recordData is undefined

    console.log(recordLoaded, 'attr:',attrName,'recordData:', recordData);
    return (recordData?.hasOwnProperty(attrName)) ? recordData[attrName] === null ? "" : recordData[attrName] : "";

    //return (typeof recordData[attrName] !== 'undefined') ? recordData[attrName] : "";
  } 

  const [updatePersonHandler, updatePersonRequest] =
    operations.updatePerson;
  const [deletePersonHandler, deletePersonRequest] =
    operations.deletePerson;
  const [updateOrganizationHandler, updateOrganizationRequest] =
    operations.updateOrganization;
  const [deleteOrganizationHandler, deleteOrganizationRequest] =
    operations.deleteOrganization;
  const [updateTagHandler, updateTagRequest] =
    tagOperations.updateTag;
  const [deleteTagHandler, deleteTagRequest] =
    tagOperations.deleteTag;

  const location: any = useLocation();
  const { id: recordIdString } = useParams();
  const recordId = parseInt(recordIdString);

  let navigate = useNavigate(); //save and view detail
  const { user } = useAuth();
  
  const deleteRecord = () => {
    if (recordType === 'person') {
      deletePersonHandler({variables: {
        partyId: recordId,
        appUserGroupId: user.currentAppUserGroupId
      }})
    }
  }

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
        apiRequest: getStatusListRequest
      },
    ],
    organization: [
      {
        label: "Name",
        name: "name",
        type: "text",
        required: true,
      },
      {
        label: "Status",
        name: "statusId",
        type: "autocomplete", //"select",
        required: true,
        apiRequest: getStatusListRequest
      },
    ],
    tag: [
      {
        label: "Name",
        name: "name",
        type: "text",
        required: true,
      },
      {
        label: "Status",
        name: "statusId",
        type: "autocomplete", //"select",
        required: true,
        apiRequest: getStatusListRequest
      },
    ],
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
                type: customField.required ? "required" : "nullable",
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
      updatePersonHandler({
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
    //get data of single record

    setRecordLoaded(false);

    const variables = {
      id: recordId,
      appUserGroupId: user.currentAppUserGroupId
    }

    if (recordType === 'person') { //hook for getStatusListRequest.data ?
      getPersonByIdHandler({variables:variables});
    }

    
    if (recordType === 'organization') {
      getOrganizationByIdHandler({variables:variables})
    }

    if (recordType === 'tag') {
      getTagByIdHandler({variables:variables})
    }

  }, [recordId, recordType]);

  React.useEffect(() => {

    if (!recordLoaded && getPersonByIdRequest.data?.personById && recordType === "person") { //exists
     
      const loadedData = getPersonByIdRequest.data.personById;
      setRecordLoaded(true);

      reset({values:{
        name: loadedData.name,
        surname: loadedData.surname,
        statusId: loadedData.statusId
      }})
    }

    if (!recordLoaded && getOrganizationByIdRequest.data?.organizationById && recordType === "organization") { //exists
 
      const loadedData = getOrganizationByIdRequest.data.organizationById;

      setRecordLoaded(true);
      reset({values:{
        name: loadedData.name,
        statusId: loadedData.statusId
      }})

    }
    // if (!recordLoaded && getOrganizationByIdRequest.data?.organizationById) { //exists
     
    //   const loadedData = getOrganizationByIdRequest.data.organizationById;
    //   setRecordLoaded(true);
    //   reset({values:{
    //     name: loadedData.name,
    //     statusId: loadedData.statusid
    //   }})

    // }

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
            recordType
          }
        />
        {/* <Typography paragraph textAlign={'center'} fontSize={'1.6rem'}>
          Welcome to ContactsApp.
        </Typography> */}

        {/* this is row for md, col for  */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          paddingTop: '1rem'
        }}>


        <Box
          sx={{
            width: {
              xs: "100%", // theme.breakpoints.up('xs')
              sm: "60%", //400, // theme.breakpoints.up('sm')
              // md: 300, // theme.breakpoints.up('md')
              lg: 360, // theme.breakpoints.up('lg')
              //xl: 500, // theme.breakpoints.up('xl')
            }
          }}
        >
          {recordType.length && recordLoaded && getStatusListRequest.data &&  <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {customFields[recordType].map((item, index) => (
                <Controller
                  key={index}
                  render={({ field }) => (
                    <CustomFormField controllerProps={field} fieldData={item} errors={errors} />
                  )}
                  control={control}
                  name={item.name}
                  defaultValue={() => getRecordData(item.name)}
                />
              ))}

              <Button
                variant={"contained"}
                type="submit"
                sx={{ width: "120px" }}
              >
                Save
              </Button>
              <Button
                //variant={"contained"}
                type="button"
                sx={{ width: "120px" }}
                onClick={deleteRecord}
              >
                Delete
              </Button>
              {!isSubmitting && updatePersonRequest.error && (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  {updatePersonRequest.error.message}
                </Alert>
              )}
            </Stack>
          </form>}
        </Box>

          {(recordType === 'person' || recordType === 'organization') && <PartyRelationships recordType={recordType} />}

        </Box>
      </Box>
    </>
  );
};
