import * as React from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { Alert, AlertTitle, Stack, TextField,
  //CircularProgress,   
  FormGroup} from '@mui/material';

import Autocomplete from '@mui/material/Autocomplete';

import {useLocation } from "react-router"; //useParams
import {ModalContext} from '../../../contexts/ModalContext';
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {CustomFormField} from '../../Form/CustomFormField';

import { useAuth } from '../../../hooks/useAuth';
import { useReactiveVar } from '@apollo/client';
import {ORGANIZATION_PARTY_TYPE_ID, PERSON_PARTY_TYPE_ID,
  PARTY_RELATIONSHIP_CATEGORY_ORGANIZATION_ORGANIZATION, 
  PARTY_RELATIONSHIP_CATEGORY_ORGANIZATION_PERSON, 
  PARTY_RELATIONSHIP_CATEGORY_PERSON_PERSON} from '../../../utils/constants';
import { useTranslation } from 'react-i18next';
import { debounce } from '../../../utils/utilityFunctions';
import { useTag, filteredTagsVar, TagOption} from '../../../hooks/useTag';
// const _filterOptions = createFilterOptions();




export const NewTagPartyModal = () => {
    const {t} = useTranslation();
    const location = useLocation();
    let wholePath = location.pathname;
    const recordsPath = wholePath.split('/')[1]; // 'people' | 'organizations'
    const recordId = wholePath.replace(/^(?:[^\/]*\/){2}\s*/, '');
    //const { id: recordIdString } = useParams();

    const {user} = useAuth();
    let { handleModal } = React.useContext(ModalContext);  
    const {operations} = useTag();
    const [createTagPartyHandler, createTagPartyRequest] = operations.createTagParty;
    const [getTagsByNameHandler, getTagsByNameRequest] = operations.getTagsByName;

    const [open, setOpen] = React.useState<boolean>(false);
    const [searchedName, setSearchedName] = React.useState<string>('');
    //const [filteredParties, setfilteredParties] = React.useState<TagOption[]>([]);
    //const inputRef = React.useRef(null);

    const filteredTags = useReactiveVar(filteredTagsVar);



    const fields = [
          {
            label: t('userActions.lookForTag'),
            name: "tag",
            type: "autocomplete",
            // required: true,
          },
          {
            //label: "Other party",
            name: "tagId",
            type: "hidden",
            required: true,
            // apiHandler: getPartiesByNameHandler,
            // apiRequest: getPartiesByNameRequest
          } 
    ]

    const schema = yup.object().shape({
        tagId: yup.number().typeError(t(`form.isRequired`, {fieldName: t(`entityType.tag`)})).required(t(`form.isRequired`, {fieldName: t(`entityType.tag`)}))
        //partyRelationshipTypeId: yup.number().required()
        // secondPartyId: yup.number().notOneOf([yup.ref('firstPartyId')], 'Parties could not be equal').required(),
      });

    const { 
        control,
        handleSubmit,
        formState: { isSubmitting, errors },
        getValues,
        setValue
      } = useForm({
        resolver: yupResolver(schema),
        mode: "onTouched",
      });
    
    const onSubmit = React.useCallback((values) => {

          createTagPartyHandler({
            variables: {
              partyId: parseInt(recordId),
              tagId: values.tagId,
              appUserGroupId: user.currentAppUserGroupId
            },
        });
      
    }, []);

    React.useEffect(() => {
      filteredTagsVar([]) //reset
    }, [])

    React.useEffect(() => {
      if(searchedName.length > 0) {
        getTagsByNameHandler({variables: {searchedName: searchedName, appUserGroupId: user.currentAppUserGroupId}});
      }
      //inputRef.current.querySelector('input').focus();
    }, [searchedName])


    React.useEffect(() => {
      if (filteredTags.length > 0) {
        setOpen(true);
      }
    }, [filteredTags])

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

          const found = filteredTags.find((item:any) => (option === parseInt(item.id)))
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
        onOpen={() => {if(filteredTags.length > 0) setOpen(true)}}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(_event, newValue) => {
          controllerProps.onChange(newValue);
          
          if(newValue && newValue !== "string") {
            setValue('tagId', parseInt(newValue.id));
            //setValue('otherPartyTypeId', parseInt(newValue.typeId));
          }
          else if(!newValue) { //reset
            setValue('tagId', null);
            //setValue('otherPartyTypeId', null);
          }
        }}
        onInputChange={(_event, newInputValue) => {
          
          if (filteredTags.find((item: TagOption) => item.name === newInputValue)) {
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
        options={filteredTags}
        loading={getTagsByNameRequest.loading}
        
        // filterOptions={(options, state) => {

        //   if (!state.inputValue.length) return options;

        //   return options.filter((item: TagOption) => {
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
            label={t(`entityType.tag`)}
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
        if (createTagPartyRequest.data) {
          if (createTagPartyRequest.data.createTagParty.status === 'SUCCESS') {
            //status = SUCCESS
            handleModal() // && refetch relationshipList
          }
        }
    }, [createTagPartyRequest])

  return (
   <>
        <DialogContent dividers>

        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {fields.map((item, index) => {

                // if (item.name === 'isMainParty' && getValues('otherPartyTypeId') === ORGANIZATION_PARTY_TYPE_ID && recordsPath === 'people') return null;

                return (
                <Controller
                  key={index}
                  render={({ field }) => {

                    return field.name === 'tag' ?

                    <AutocompleteLoadOnInputField controllerProps={field} fieldData={item} /> :

                    <CustomFormField controllerProps={field} fieldData={item} errors={errors} />
                    }
                  }
                  control={control}
                  name={item.name}
                  //defaultValue={getRecordData(item.name)}
                />
              )})}

              <Button
                variant={"contained"}
                type="submit"
                sx={{ width: "120px" }}
                //onClick={submitRelationship}
              >
                {t('userActions.save')}
              </Button>
              {!isSubmitting && createTagPartyRequest.error && (
                <Alert severity="error">
                  <AlertTitle>{t('general.error')}</AlertTitle>
                  {createTagPartyRequest.error.message}
                </Alert>
              )}
            </Stack>
          </form>
        
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