import * as React from 'react';
import {
    TextField,
    Autocomplete,
    CircularProgress
  } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

export const CustomFormField = ({controllerProps, fieldData, errors}) => {

    const {user} = useAuth();
    const [open, setOpen] = React.useState<boolean>(false);

    const getSelectOptions = () => {

        if (fieldData.name === 'statusId') {
          if (fieldData.apiRequest.data?.statusList?.length) {
            const statusList = fieldData.apiRequest.data.statusList;
            return statusList.map((item:any) => ({name:item.name, id:item.id}))
          }
    
        }
        
        if (fieldData.name === 'otherPartyId') {
          if (fieldData.apiRequest.data?.personsByAppUserGroup?.length) {
            const partyList = fieldData.apiRequest.data.personsByAppUserGroup;
            return partyList.map((item:any) => ({name:item.surname, id:item.id}))
          }
    
        }

        if (fieldData.name === 'partyRelationshipTypeId') {
          if (fieldData.apiRequest.data?.partyRelationshipTypeList?.length) {
            const partyRelationshipTypeList = fieldData.apiRequest.data.partyRelationshipTypeList;
            return partyRelationshipTypeList.map((item:any) => ({name:item.name, id:item.id}))
          }
    
        }

      }
    
      const getOptionLabel = (option: number | {id:string, name: string}) => {
    
        if (!option || !fieldData.apiRequest.data) return '';
    
        if ( typeof option === 'number') {
          

          if (fieldData.name === 'statusId') {
            if (fieldData.apiRequest.data?.statusList?.length) {
              const statusList = fieldData.apiRequest.data.statusList;
              const found = statusList.find((item:any) => (option === parseInt(item.id)))
              if (found) return found.name;
            }
        }

          
        }
        
        else return option.name;
       
    
        
      }

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
        options={getSelectOptions()}
        loading={fieldData.apiRequest.loading}
        renderInput={(params) => {
          
          return(
          <TextField
            {...params}
            label={fieldData.label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {fieldData.apiRequest.loading ? <CircularProgress color="inherit" size={20} /> : null}
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