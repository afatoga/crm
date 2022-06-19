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
// import { useTag, filteredTagsVar, TagOption} from '../../../hooks/useTag';
import { useContact } from '../../../hooks/useContact';
// const _filterOptions = createFilterOptions();




export const CreateUpdateContactModal = () => {
    const {t} = useTranslation();
    const location = useLocation();
    let wholePath = location.pathname;
    const recordsPath = wholePath.split('/')[1]; // 'people' | 'organizations'
    const recordId = wholePath.replace(/^(?:[^\/]*\/){2}\s*/, '');
    //const { id: recordIdString } = useParams();

    const {user} = useAuth();
    let { isShown,handleModal } = React.useContext(ModalContext);  
    const {operations} = useContact();
    const [createContactHandler, createContactRequest] = operations.createContact;
    const [updateContactHandler, updateContactRequest] = operations.updateContact;
    const [getContactTypeListHandler, getContactTypeListRequest] = operations.getContactTypeList;
    //const [getTagsByNameHandler, getTagsByNameRequest] = operations.getTagsByName;

    const [open, setOpen] = React.useState<boolean>(false);
    //const [searchedName, setSearchedName] = React.useState<string>('');
    //const [filteredParties, setfilteredParties] = React.useState<TagOption[]>([]);
    //const inputRef = React.useRef(null);

    //const filteredTags = useReactiveVar(filteredTagsVar);



    const fields = [
          // {
          //   label: t('contact.value'),
          //   name: "contactValue",
          //   type: "text",
          //   required: true,
          // },
            {
              label: t('contact.type'),
              name: "contactTypeId",
              type: "autocomplete", //"select",
              required: true,
              apiRequest: getContactTypeListRequest,
            },
        
          {
            label: t('contact.value'),
            name: "contactValue",
            type: "text",
            required: true,
          },
          {
            label: "status",
            name: "statusId",
            type: "autocomplete", //"select",
            required: true,
            apiRequest: operations.retrieveStatusListFromCache(),
          },
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

      createContactHandler({
            variables: {
              partyId: parseInt(recordId),
              value: values.contactValue,
              partyRelationshipId: values.partyRelationshipId,
              appUserGroupId: user.currentAppUserGroupId
            },
        });
      
    }, []);



    React.useEffect(() => {
      getContactTypeListHandler();
    }, [])

    // const filterOptions = React.useCallback((options, state) => {
    //   const results = _filterOptions(options, state);  
    //   return results;
    // }, []);


    // const debounceOnChange = React.useCallback(
    //   debounce(value => {
    //     setSearchedName(value);
    //   }, 400),
    //   []
    // );

    


    React.useEffect(( ) => {
        if (createContactRequest.data) {
          if (createContactRequest.data.createContact.id) {
            isShown && handleModal() 
          }
        }

        else if (updateContactRequest.data) {
          if (updateContactRequest.data.updateContact.id) {
            isShown && handleModal()
          }
        }
    }, [createContactRequest, updateContactRequest])

  return (
   <>
        <DialogContent dividers>

        {getContactTypeListRequest.data && <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {fields.map((item, index) => {

                // if (item.name === 'isMainParty' && getValues('otherPartyTypeId') === ORGANIZATION_PARTY_TYPE_ID && recordsPath === 'people') return null;

                return (
                <Controller
                  key={index}
                  render={({ field }) => (
                    <CustomFormField controllerProps={field} fieldData={item} errors={errors} />
                  )}
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
              {!isSubmitting && createContactRequest.error && (
                <Alert severity="error">
                  <AlertTitle>{t('general.error')}</AlertTitle>
                  {createContactRequest.error.message}
                </Alert>
              )}
              {!isSubmitting && updateContactRequest.error && (
                <Alert severity="error">
                  <AlertTitle>{t('general.error')}</AlertTitle>
                  {updateContactRequest.error.message}
                </Alert>
              )}
            </Stack>
          </form>}
        
        
        </DialogContent>

        </>
   
  );
}