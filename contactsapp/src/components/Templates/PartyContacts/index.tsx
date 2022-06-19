import * as React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { MultiLevelList } from "../../List";
import { Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ModalContext } from "../../../contexts/ModalContext";
import { useContact, extendedPartyRelationshipContactsVar } from "../../../hooks/useContact";
import { StyledPaper } from "../../Container";
import { useReactiveVar } from "@apollo/client";
import { IPartyRelationship, partyRelationshipListVar } from "../../../hooks/useParty";

export const PartyContacts = () => {
  const { id: recordId } = useParams(); //always string
  const { user } = useAuth();
  const { t } = useTranslation();
  const { handleModal } = React.useContext(ModalContext);

  const toggleCreateUpdateContactModal = () => {
    handleModal("CreateUpdateContact");
  };

  const { operations } = useContact();

  const [getPartyPrivateContactsHandler, getPartyPrivateContactsRequest] =
    operations.getPartyPrivateContacts;
  const [getPartyRelationshipContactsHandler, getPartyRelationshipContactsRequest] =
    operations.getPartyRelationshipContacts;
  const [deleteContactHandler, deleteContactRequest] = operations.deleteContact;

  const removeContact = (contactId: string) => {
    deleteContactHandler({
      variables: {
        id: parseInt(contactId),
        appUserGroupId: user.currentAppUserGroupId,
      },
    });
  };


  const partyRelationshipList = useReactiveVar(partyRelationshipListVar); 
  const extendedPartyRelationshipContacts = useReactiveVar(extendedPartyRelationshipContactsVar); 

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
             />
           </>
          }              

          <Button
            variant={"contained"}
            sx={{ my: 3, width: "160px" }}
            onClick={toggleCreateUpdateContactModal}
          >
            {t("singleRecord.createNewContact")}
          </Button>
      
      </StyledPaper>
    </>
  );
};
