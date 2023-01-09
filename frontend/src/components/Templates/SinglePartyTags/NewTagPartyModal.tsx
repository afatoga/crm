import * as React from "react";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import { Alert, AlertTitle, Stack, TextField, FormGroup } from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

import { useLocation } from "react-router"; //useParams
import { ModalContext } from "../../../contexts/ModalContext";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomFormField } from "../../Form/CustomFormField";

import { useAuth } from "../../../hooks/useAuth";
import { useReactiveVar } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { debounce } from "../../../utils/utilityFunctions";
import { useTag, filteredTagsVar, TagOption } from "../../../hooks/useTag";

export const NewTagPartyModal = () => {
  const { t } = useTranslation();
  const location = useLocation();
  let wholePath = location.pathname;
  const recordId = wholePath.replace(/^(?:[^\/]*\/){2}\s*/, "");

  const { user } = useAuth();
  let { handleModal } = React.useContext(ModalContext);
  const { operations } = useTag();
  const [createTagPartyHandler, createTagPartyRequest] =
    operations.createTagParty;
  const [getTagsByNameHandler, getTagsByNameRequest] = operations.getTagsByName;

  const [open, setOpen] = React.useState<boolean>(false);
  const [searchedName, setSearchedName] = React.useState<string>("");

  const filteredTags = useReactiveVar(filteredTagsVar);

  const fields = [
    {
      label: t("userActions.lookForTag"),
      name: "tag",
      type: "autocomplete",
    },
    {
      name: "tagId",
      type: "hidden",
      required: true,
    },
  ];

  const schema = yup.object().shape({
    tagId: yup
      .number()
      .typeError(t(`form.isRequired`, { fieldName: t(`entityType.tag`) }))
      .required(t(`form.isRequired`, { fieldName: t(`entityType.tag`) })),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = React.useCallback((values) => {
    createTagPartyHandler({
      variables: {
        partyId: parseInt(recordId),
        tagId: values.tagId,
        appUserGroupId: user.currentAppUserGroupId,
      },
    });
  }, []);

  React.useEffect(() => {
    filteredTagsVar([]); //reset
  }, []);

  React.useEffect(() => {
    if (searchedName.length > 2) {
      getTagsByNameHandler({
        variables: {
          searchedName: searchedName,
          appUserGroupId: user.currentAppUserGroupId,
        },
      });
    }
  }, [searchedName]);

  React.useEffect(() => {
    if (filteredTags.length > 0) {
      setOpen(true);
    }
  }, [filteredTags]);

  const debounceOnChange = React.useCallback(
    debounce((value) => {
      setSearchedName(value);
    }, 400),
    []
  );

  const getOptionLabel = (option) => {
    if (typeof option === "number") {
      const found = filteredTags.find(
        (item: any) => option === parseInt(item.id)
      );
      if (found) return found.name;
    } else return typeof option === "string" ? option : option.name;
  };

  const AutocompleteLoadOnInputField = ({ controllerProps, fieldData }) => {
    return (
      <FormGroup>
        <Autocomplete
          id={fieldData.name}
          open={open}
          onOpen={() => {
            if (filteredTags.length > 0) setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          onChange={(_event, newValue) => {
            controllerProps.onChange(newValue);

            if (newValue && newValue !== "string") {
              setValue("tagId", parseInt(newValue.id));
            } else if (!newValue) {
              //reset
              setValue("tagId", null);
            }
          }}
          onInputChange={(_event, newInputValue) => {
            if (
              filteredTags.find(
                (item: TagOption) => item.name === newInputValue
              )
            ) {
              controllerProps.onChange(newInputValue);
            } else {
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
            return value === option;
          }}
          getOptionLabel={getOptionLabel}
          options={filteredTags}
          loading={getTagsByNameRequest.loading}
          renderInput={(params) => (
            <TextField
              autoFocus
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
    );
  };

  React.useEffect(() => {
    if (createTagPartyRequest.data) {
      if (createTagPartyRequest.data.createTagParty.status === "SUCCESS") {
        handleModal();
      }
    }
  }, [createTagPartyRequest]);

  return (
    <>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {fields.map((item, index) => {
              return (
                <Controller
                  key={index}
                  render={({ field }) => {
                    return field.name === "tag" ? (
                      <AutocompleteLoadOnInputField
                        controllerProps={field}
                        fieldData={item}
                      />
                    ) : (
                      <CustomFormField
                        controllerProps={field}
                        fieldData={item}
                        errors={errors}
                      />
                    );
                  }}
                  control={control}
                  name={item.name}
                />
              );
            })}

            <Button variant={"contained"} type="submit" sx={{ width: "120px" }}>
              {t("userActions.save")}
            </Button>
            {!isSubmitting && createTagPartyRequest.error && (
              <Alert severity="error">
                <AlertTitle>{t("general.error")}</AlertTitle>
                {createTagPartyRequest.error.message}
              </Alert>
            )}
          </Stack>
        </form>
      </DialogContent>
    </>
  );
};
