import * as React from "react";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import {
  Alert,
  AlertTitle,
  Stack,
  TextField,
  //CircularProgress,
  FormGroup,
} from "@mui/material";

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

import {
  contactToEditVar,
  useContact,
  extendedPartyRelationshipContactsVar,
} from "../../../hooks/useContact";
import { partyRelationshipListVar } from "../../../hooks/useParty";

export const CreateUpdateContactModal = () => {
  const { t } = useTranslation();
  const location = useLocation();
  let wholePath = location.pathname;
  const recordId = wholePath.replace(/^(?:[^\/]*\/){2}\s*/, ""); // caution! partyId not contactId

  const { user } = useAuth();
  let { isShown, handleModal } = React.useContext(ModalContext);
  const { operations } = useContact();
  const [createContactHandler, createContactRequest] = operations.createContact;
  const [updateContactHandler, updateContactRequest] = operations.updateContact;
  const [getContactTypeListHandler, getContactTypeListRequest] =
    operations.getContactTypeList;

  const partyRelationshipList = useReactiveVar(partyRelationshipListVar);
  const contactToEdit = useReactiveVar(contactToEditVar);

  const fields = [
    {
      label: t("contact.partyRelationship"),
      name: "partyRelationshipId",
      type: "autocomplete", //"select",
      required: false,
      apiRequest: partyRelationshipList,
      currentPartyId: recordId,
    },

    {
      label: t("contact.type"),
      name: "contactTypeId",
      type: "autocomplete", //"select",
      required: false,
      apiRequest: getContactTypeListRequest.data
        ? getContactTypeListRequest
        : { data: null },
    },

    {
      label: t("contact.value"),
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
  ];

  const schema = yup.object().shape({
    contactValue: yup
      .string()
      .typeError(t(`form.isRequired`, { fieldName: t(`contact.value`) }))
      .required(t(`form.isRequired`, { fieldName: t(`contact.value`) })),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = React.useCallback(
    (values) => {
      if (!contactToEdit.length)
        createContactHandler({
          variables: {
            partyId: parseInt(recordId),
            contactValue: values?.contactValue,
            typeId: values?.contactTypeId,
            statusId: values?.statusId,
            partyRelationshipId: values?.partyRelationshipId,
            appUserGroupId: user.currentAppUserGroupId,
          },
        });
      else {
        updateContactHandler({
          variables: {
            id: parseInt(contactToEdit),
            contactValue: values?.contactValue,
            typeId: values?.contactTypeId,
            statusId: values?.statusId,
            partyRelationshipId: values.partyRelationshipId,
            appUserGroupId: user.currentAppUserGroupId,
          },
        });
      }
    },
    [recordId, contactToEdit]
  );

  React.useEffect(() => {
    getContactTypeListHandler();
  }, []);

  React.useEffect(() => {
    if (contactToEdit.length) {
      const existingPrivateContacts =
        operations.retrievePartyPrivateContactsCache({
          appUserGroupId: user.currentAppUserGroupId,
          partyId: parseInt(recordId),
          // statusId
        });
      const existingPartyRelationshipContacts =
        extendedPartyRelationshipContactsVar();
      const allContacts = existingPrivateContacts.concat(
        existingPartyRelationshipContacts
      );

      if (allContacts.length) {
        const found = allContacts.find(
          (contact: any) => contact.id === contactToEdit
        );
        if (found) {
          reset({
            //id: found.id,
            contactValue: found.value,
            contactTypeId: found?.contactType
              ? parseInt(found?.contactType.id)
              : undefined,
            partyRelationshipId: found?.partyRelationshipId
              ? parseInt(found.partyRelationshipId)
              : undefined,
            statusId: found?.status ? parseInt(found.status.id) : undefined,
          });
        }
      }
    }
  }, [contactToEdit]);

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

  React.useEffect(() => {
    if (createContactRequest.data) {
      if (createContactRequest.data.createContact.id) {
        createContactRequest.reset();
        isShown && handleModal();
      }
    } else if (updateContactRequest.data) {
      if (updateContactRequest.data.updateContact.id) {
        contactToEditVar(""); //reset;
        updateContactRequest.reset();
        isShown && handleModal();
      }
    }
  }, [createContactRequest, updateContactRequest]);

  return (
    <>
      <DialogContent dividers>
        {getContactTypeListRequest.data && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {fields.map((item, index) => {
                return (
                  <Controller
                    key={index}
                    render={({ field }) => (
                      <CustomFormField
                        controllerProps={field}
                        fieldData={item}
                        errors={errors}
                      />
                    )}
                    control={control}
                    name={item.name}
                    //defaultValue={getRecordData(item.name)}
                  />
                );
              })}

              <Button
                variant={"contained"}
                type="submit"
                sx={{ width: "120px" }}
              >
                {t("userActions.save")}
              </Button>
              {!isSubmitting && createContactRequest.error && (
                <Alert severity="error">
                  <AlertTitle>{t("general.error")}</AlertTitle>
                  {createContactRequest.error.message}
                </Alert>
              )}
              {!isSubmitting && updateContactRequest.error && (
                <Alert severity="error">
                  <AlertTitle>{t("general.error")}</AlertTitle>
                  {updateContactRequest.error.message}
                </Alert>
              )}
            </Stack>
          </form>
        )}
      </DialogContent>
    </>
  );
};
