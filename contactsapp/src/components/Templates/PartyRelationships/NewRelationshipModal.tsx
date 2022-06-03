import * as React from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { Alert, AlertTitle, Stack, TextField,
  
  CircularProgress,   
  FormGroup} from '@mui/material';

import Autocomplete from '@mui/material/Autocomplete';

import {useParams, useLocation } from "react-router";
import {ModalContext} from '../../../contexts/ModalContext';
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {CustomFormField} from '../../Form/CustomFormField';

import {useParty, filteredPartiesVar, PartyOption} from '../../../hooks/useParty';
import { useAuth } from '../../../hooks/useAuth';
import { useReactiveVar } from '@apollo/client';

// const _filterOptions = createFilterOptions();

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}


export const NewRelationshipModal = () => {
    
    const location = useLocation();
    let wholePath = location.pathname;
    const recordIdString = wholePath.replace(/^(?:[^\/]*\/){2}\s*/, '');
    //const { id: recordIdString } = useParams();

    const {user} = useAuth();
    let { handleModal } = React.useContext(ModalContext);  
    const {operations} = useParty();
    const [createPartyRelationshipHandler, createPartyRelationshipRequest] = operations.createPartyRelationship;
    const [getPartiesByNameHandler, getPartiesByNameRequest] = operations.getPartiesByName;
    const [getPartyRelationshipTypeListHandler, getPartyRelationshipTypeListRequest] = operations.getPartyRelationshipTypeList;

    const [open, setOpen] = React.useState<boolean>(false);
    const [searchedName, setSearchedName] = React.useState<string>('');
    //const [filteredParties, setfilteredParties] = React.useState<PartyOption[]>([]);
    //const inputRef = React.useRef(null);

    const filteredParties = useReactiveVar(filteredPartiesVar);

    const fields = [
          {
            label: "Other party",
            name: "otherParty",
            type: "autocomplete",
            // required: true,
          },
          {
            //label: "Other party",
            name: "otherPartyId",
            type: "hidden",
            required: true,
            // apiHandler: getPartiesByNameHandler,
            // apiRequest: getPartiesByNameRequest
          },
          {
            //label: "Other party",
            name: "otherPartyTypeId",
            type: "hidden",
            required: true,
            // apiHandler: getPartiesByNameHandler,
            // apiRequest: getPartiesByNameRequest
          },
          {
            label: "Above party is of higher priority",
            name: "isMainParty",
            type: "checkbox",
            // required: true,
          },
          {
            label: "Relation type",
            name: "partyRelationshipTypeId",
            type: "autocomplete",
            apiRequest: getPartyRelationshipTypeListRequest
          }
    ]

    const schema = yup.object().shape({
        otherPartyId: yup.number().typeError("Select other party").required()
        //partyRelationshipTypeId: yup.number().required()
        // secondPartyId: yup.number().notOneOf([yup.ref('firstPartyId')], 'Parties could not be equal').required(),
      });

    const { 
        control,
        handleSubmit,
        formState: { isSubmitting, errors },
        setValue
      } = useForm({
        resolver: yupResolver(schema),
        mode: "onTouched",
      });
    
    const onSubmit = React.useCallback((values) => {

      let dataToSubmit = {
        firstPartyId: parseInt(recordIdString),
        secondPartyId: values.otherPartyId,
        otherPartyTypeId: values.otherPartyTypeId,
        partyRelationshipTypeId: values.partyRelationshipTypeId,
      }

      if (values?.isMainParty === true) {
        dataToSubmit.firstPartyId = values.otherPartyId;
        dataToSubmit.secondPartyId = parseInt(recordIdString);
      }

     

          createPartyRelationshipHandler({
            variables: dataToSubmit,
        });
      
    }, []);

    React.useEffect(() => {
      getPartyRelationshipTypeListHandler();
      filteredPartiesVar([]) //reset
    }, [])

    React.useEffect(() => {
      if(searchedName.length > 0) {
        getPartiesByNameHandler({variables: {searchedName: searchedName, appUserGroupId: user.currentAppUserGroupId}});
      }
      //inputRef.current.querySelector('input').focus();
    }, [searchedName])


    React.useEffect(() => {
      if (filteredParties.length > 0) {
        setOpen(true);
      }
    }, [filteredParties])

    // const filterOptions = React.useCallback((options, state) => {
    //   const results = _filterOptions(options, state);  
    //   return results;
    // }, []);


    const debounceOnChange = React.useCallback(
      debounce(value => {
        setSearchedName(value);
      }, 400),
      []
    );

    const getOptionLabel = (option) => {

        if (typeof option === "number") {

          const found = filteredParties.find((item:any) => (option === parseInt(item.id)))
          if (found) return found.name;
        }

        else return (typeof option === "string") ? option : option.name
     
    }


    const AutocompleteLoadOnInputField = ({controllerProps, fieldData}) => {
      return (
        <FormGroup>
        <Autocomplete
        id={fieldData.name}
        //sx={{ width: 300 }}
        open={open}
        onOpen={() => {if(filteredParties.length > 0) setOpen(true)}}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(_event, newValue) => {
          controllerProps.onChange(newValue);
          
          if(newValue && newValue !== "string") {
            setValue('otherPartyId', parseInt(newValue.id));
            setValue('otherPartyTypeId', parseInt(newValue.typeId));
          }
          else if(!newValue) { //reset
            setValue('otherPartyId', null);
            setValue('otherPartyTypeId', null);
          }
        }}
        onInputChange={(_event, newInputValue) => {
          
          if (filteredParties.find((item: PartyOption) => item.name === newInputValue)) {
            controllerProps.onChange(newInputValue);
          }
          else {
            debounceOnChange(newInputValue);
            controllerProps.onChange(newInputValue);
          }
        }}
        value={controllerProps.value ? controllerProps.value : ""}
        isOptionEqualToValue={(option, value) => {
          if (option && typeof value === "string") {
          
            const loweCasedOptionLabel = option.name.toLowerCase();
            return loweCasedOptionLabel.indexOf(value.toLowerCase()) >= 0;
          }
          return value === option
          // return value === undefined || value === '' || option.id === value.id
        }}
        getOptionLabel={getOptionLabel}
        options={filteredParties}
        loading={getPartiesByNameRequest.loading}
        
        // filterOptions={(options, state) => {

        //   if (!state.inputValue.length) return options;

        //   return options.filter((item: PartyOption) => {
        //     const loweCasedOptionLabel = item.name.toLowerCase();
        //     return loweCasedOptionLabel.indexOf(state.inputValue.toLowerCase()) >= 0;
        //   })
        // }}
        //filterOptions={filterOptions}
        renderInput={(params) => (
          <TextField
            autoFocus
            //ref={inputRef}
            {...params}
            label="Other party"
            InputProps={{
              ...params.InputProps,
            }}
            helperText={
              errors["otherPartyId"] ? errors["otherPartyId"].message : ""
            }
          />
        )}
      />
      </FormGroup>
      )
    }


    React.useEffect(( ) => {
        if (createPartyRelationshipRequest.data) {
          if (createPartyRelationshipRequest.data.createPartyRelationship.id) {
            //status = SUCCESS
            handleModal() // && refetch relationshipList
          }
        }
    }, [createPartyRelationshipRequest])

  return (
   <>
        <DialogContent dividers>

        {getPartyRelationshipTypeListRequest.data && <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {fields.map((item, index) => (
                <Controller
                  key={index}
                  render={({ field }) => {

                    return field.name === 'otherParty' ?

                    <AutocompleteLoadOnInputField controllerProps={field} fieldData={item} /> :

                    <CustomFormField controllerProps={field} fieldData={item} errors={errors} />
                    }
                  }
                  control={control}
                  name={item.name}
                  //defaultValue={getRecordData(item.name)}
                />
              ))}

              <Button
                variant={"contained"}
                type="submit"
                sx={{ width: "120px" }}
                //onClick={submitRelationship}
              >
                Save
              </Button>
              {!isSubmitting && createPartyRelationshipRequest.error && (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  {createPartyRelationshipRequest.error.message}
                </Alert>
              )}
            </Stack>
          </form>}
        
          {/* <Typography gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
            magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
            ullamcorper nulla non metus auctor fringilla.
          </Typography> */}
        </DialogContent>
        {/* <DialogActions>
          <Button autoFocus onClick={handleModal}>
            Save changes
          </Button>
        </DialogActions> */}
        </>
   
  );
}