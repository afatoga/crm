import * as React from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { Alert, AlertTitle, Stack } from '@mui/material';

import {ModalContext} from '../../../contexts/ModalContext';
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {CustomFormField} from '../../Form/CustomFormField';

import {useParty} from '../../../hooks/useParty';

export const NewRelationshipModal = () => {

    let { handleModal } = React.useContext(ModalContext);  
    const {operations} = useParty();
    const [createPartyRelationshipHandler, createPartyRelationshipRequest] = operations.createPartyRelationship;
    const [getPartiesHandler, getPartiesRequest] = operations.getPersonsByAppUserGroup;

    const fields = [
        {
            label: "Main party",
            name: "firstPartyId",
            type: "autocomplete",
            required: true,
            apiRequest: getPartiesRequest
          },
          {
            label: "Second party",
            name: "secondPartyId",
            type: "autocomplete",
            required: true,
            apiRequest: getPartiesRequest
          },
          {
            label: "Relation type",
            name: "typeId",
            type: "autocomplete",
            required: true,
          }
    ]

    const schema = yup.object().shape({
        firstPartyId: yup.number().required(),
        secondPartyId: yup.number().notOneOf([yup.ref('firstPartyId')], 'Parties could not be equal').required(),
      }).required();

    const { 
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
      } = useForm({
        resolver: yupResolver(schema),
        mode: "onTouched",
      });
    
      const onSubmit = React.useCallback((values) => {
        console.log(values)
  
            createPartyRelationshipHandler({
            variables: {
              ...values,
              
            },
          });
        
      }, []);

      React.useEffect(() => {
        getPartiesHandler();
      }, [])

  return (
   <>
        <DialogContent dividers>

        {<form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {fields.map((item, index) => (
                <Controller
                  key={index}
                  render={({ field }) => (
                    <CustomFormField controllerProps={field} fieldData={item} errors={errors} />
                  )}
                  control={control}
                  name={item.name}
                  //defaultValue={getRecordData(item.name)}
                />
              ))}

              <Button
                variant={"contained"}
                type="submit"
                sx={{ width: "120px" }}
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
        
          <Typography gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
            magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
            ullamcorper nulla non metus auctor fringilla.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleModal}>
            Save changes
          </Button>
        </DialogActions>
        </>
   
  );
}