import * as React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { MultiLevelList } from "../../List";
import { Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ModalContext } from "../../../contexts/ModalContext";
import { useContact, extendedPartyRelationshipContactsVar, contactToEditVar } from "../../../hooks/useContact";
import { StyledPaper } from "../../Container";
import { useReactiveVar } from "@apollo/client";
import { IPartyRelationship, partyRelationshipListVar } from "../../../hooks/useParty";
import { actionResultVar } from "../../../App";

export const PartyContacts = () => {
  const { id: recordId } = useParams(); //always string
  const { user } = useAuth();
  const { t } = useTranslation();
  const { handleModal } = React.useContext(ModalContext);

  const createNewContact = () => {
    const contactToEdit = contactToEditVar();
    if (contactToEdit.length) contactToEditVar('') //reset
    handleModal("CreateUpdateContact");
  };

  const { operations } = useContact();

  const [getPartyPrivateContactsHandler, getPartyPrivateContactsRequest] =
    operations.getPartyPrivateContacts;
  const [getPartyRelationshipContactsHandler, getPartyRelationshipContactsRequest] =
    operations.getPartyRelationshipContacts;
  const [deleteContactHandler, deleteContactRequest] = operations.deleteContact;

  const [selectedContactId, setSelectedContactId] = React.useState<string>('');

  const removeContact = (contactId: string) => {

    handleModal("ConfirmDialog");
    setSelectedContactId(contactId);
    
  };
  const editContact = (contactId: string) => {
    if (contactId.length) {
    contactToEditVar(contactId);
    handleModal("CreateUpdateContact");
  }
    
  };


  const partyRelationshipList = useReactiveVar(partyRelationshipListVar); 
  const extendedPartyRelationshipContacts = useReactiveVar(extendedPartyRelationshipContactsVar); 
  const actionResult = useReactiveVar(actionResultVar);

  React.useEffect(() => {
    if (actionResult.code === "CONFIRM" && selectedContactId.length) {

      deleteContactHandler({
        variables: {
          id: parseInt(selectedContactId),
          appUserGroupId: user.currentAppUserGroupId,
        },
      });

      actionResultVar({});
  
    }
  }, [actionResult])

  React.useEffect(() => {
    getPartyPrivateContactsHandler({
      variables: {
        partyId: parseInt(recordId),
        appUserGroupId: user.currentAppUserGroupId,
        //statusId: 1
      },
    });
  }, [recordId]);

  React.useEffect(() => {
    if (partyRelationshipList.length) {
      
      const partyRelationshipIdList = partyRelationshipList.map((item: IPartyRelationship) => (parseInt(item.id))
      )

      getPartyRelationshipContactsHandler({
        variables: {
          partyId: parseInt(recordId),
          partyRelationshipIdList: partyRelationshipIdList,
          appUserGroupId: user.currentAppUserGroupId,
          //statusId: 1
        },
      });
        
    }
    
  }, [partyRelationshipList]);

  return (
    <>
      <StyledPaper sx={{
            width: {
              xs: "100%", // theme.breakpoints.up('xs')
              sm: "60%", //400, // theme.breakpoints.up('sm')
              // md: 300, // theme.breakpoints.up('md')
              lg: "360px", // theme.breakpoints.up('lg')
              //xl: 500, // theme.breakpoints.up('xl')
            }
          }}>
        
          <Typography variant="h6">{t("entityType.contacts")}</Typography>

          {getPartyPrivateContactsRequest.data?.partyPrivateContacts
            ?.length > 0 && (
            <>
              <Typography>{t("singleRecord.privateContacts")}</Typography>
              <MultiLevelList
                listName="privateContacts"
                data={getPartyPrivateContactsRequest.data.partyPrivateContacts}
                deleteItem={removeContact}
                editItem={editContact}
              />
            </>
          )}

          {extendedPartyRelationshipContacts.length > 0 &&
             <>
             <Typography>{t("singleRecord.partyRelationshipContacts")}</Typography>
             <MultiLevelList
               listName="partyRelationshipContacts"
               data={extendedPartyRelationshipContacts}
               deleteItem={removeContact}
               editItem={editContact}
             />
           </>
          }              

          <Button
            variant={"contained"}
            sx={{ my: 3, width: "160px" }}
            onClick={createNewContact}
          >
            {t("singleRecord.createNewContact")}
          </Button>
      
      </StyledPaper>
    </>
  );
};
