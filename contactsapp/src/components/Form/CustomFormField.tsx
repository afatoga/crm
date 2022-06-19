import * as React from "react";
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

export const CustomFormField = ({ controllerProps, fieldData, errors }) => {
  const { user } = useAuth();
  const [open, setOpen] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>('');

  const partyRelationshipTypeList = (fieldData.name === "partyRelationshipTypeId") ?
          fieldData.apiRequest() : [];

  const getSelectOptions = () => {
    if (fieldData.name === "statusId") {
      if (fieldData.apiRequest.data?.statusList?.length) {
        const statusList = fieldData.apiRequest.data.statusList;
        return statusList.map((item: any) => ({
          name: item.name,
          id: item.id,
        }));
      }
    }
    if (fieldData.name === "contactTypeId") {
      if (fieldData.apiRequest.data?.contactTypeList?.length) {
        const list = fieldData.apiRequest.data.contactTypeList;
        return list.map((item: any) => ({
          name: item.name,
          id: item.id,
        }));
      }
    }

    // if (fieldData.name === 'otherPartyId') {
    //   if (fieldData.apiRequest.called) {
    //     if (fieldData.apiRequest.data?.partiesByName?.length) {
    //       const partyList = fieldData.apiRequest.data.partiesByName;
    //       return partyList.map((item:any) => ({name:item.name, id:item.id}))
    //     }
    //   }

    //   else return [];
    // }

    if (fieldData.name === "partyRelationshipTypeId") {
      if (partyRelationshipTypeList.length > 0) {

        const options = partyRelationshipTypeList.map((item: any) => ({
          id: item.id,
          name: item.name
        }));

        return [{ id: 0, name: " - " }, ...options];

      } else return [{ id: 0, name: " - " }];
    }
  };

  const getOptionLabel = (option: number | { id: string; name: string }) => {
    if (!option || (!fieldData.apiRequest.data && fieldData.name !== "partyRelationshipTypeId")) return "";

    // console.log(option);
    if (typeof option === "number") {
      if (fieldData.name === "statusId") {
        if (fieldData.apiRequest.data?.statusList?.length) {
          const statusList = fieldData.apiRequest.data.statusList;
          const found = statusList.find(
            (item: any) => option === parseInt(item.id)
          );
          if (found) return found.name;
        }
      } else if (fieldData.name === "partyRelationshipTypeId") {

        if (partyRelationshipTypeList.length > 0) {
          
          const found = partyRelationshipTypeList.find(
            (item: any) => option === parseInt(item.id)
          );
          if (found) return found.name;
        }
      } else if (fieldData.name === "contactTypeId") {
        if (fieldData.apiRequest.data?.contactTypeList?.length) {
          const list = fieldData.apiRequest.data.contactTypeList;
          const found = list.find(
            (item: any) => option === parseInt(item.id)
          );
          if (found) return found.name;
        }
      }
    } else return option.name;
  };

  const filterOptions = (optionList) => {
    
    return optionList.filter((option) => {
     
      if (typeof option.name === "string" && searchText.length > 0) {
      const optionName = option.name.toLowerCase();
      const inputValue = searchText.toLowerCase();

      if (optionName.indexOf(inputValue) >= 0) return true;
      }

      else if (!searchText.length) return true;

      return false;
    })
  }


  if (fieldData.type === "text") {
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
        disabled={user.currentRole !== "ADMIN" && user.currentRole !== "MOD"}
        //size={(item.name === 'name' || item.name === 'surname' ) ? 'medium' : 'small'}
      />
    );
  }

  if (fieldData.type === "checkbox") {
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name={fieldData.name}
              //type={fieldData.type}
              value={controllerProps.value}
              onChange={controllerProps.onChange}
              onBlur={controllerProps.onBlur}
              //disabled={user.currentRole !== 'ADMIN' && user.currentRole !== "MOD"}
              //size={(item.name === 'name' || item.name === 'surname' ) ? 'medium' : 'small'}
            />
          }
          label={fieldData.label}
        />
      </FormGroup>
    );
  } else if (fieldData.type === "autocomplete") {
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
        onChange={(event: any, newValue: { id: string; name: string }) => {
      
          if (newValue) {
            newValue?.id
              ? controllerProps.onChange(parseInt(newValue.id))
              : controllerProps.onChange(undefined);
          }
        }}
        onInputChange={(_event, newInputValue) => {
          if (typeof newInputValue === 'string' && !newInputValue.length) {
            controllerProps.onChange(undefined)
          }
          setSearchText(newInputValue);
        }}
        isOptionEqualToValue={(option: any, value) => {
          if (!value.length) return true;
          return parseInt(option.id) === value;
        }}
        getOptionLabel={getOptionLabel}
        //getOptionLabel={(option:any) => {return option.name}}
        options={getSelectOptions()}
        loading={fieldData.apiRequest?.loading}
        filterOptions={filterOptions}
        renderInput={(params) => {

          return (
            <TextField
              {...params}
              label={fieldData.label}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {fieldData.apiRequest.loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          );
        }}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          );
        }}
      />
    );
  }

  return null;
};
