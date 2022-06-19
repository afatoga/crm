import * as React from 'react';
import { useTag } from '../../../hooks/useTag';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { MultiLevelList } from "../../List";
import { Typography, Box, Button} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { ModalContext } from "../../../contexts/ModalContext";
import { useContact } from '../../../hooks/useContact';
import { StyledPaper } from '../../Container';

export const PartyContacts = () => {
    const { id: recordId } = useParams(); //always string
    const { user } = useAuth();
    const {t} = useTranslation();
    const {handleModal} = React.useContext(ModalContext);

    const toggleCreateUpdateContactModal = () => {
        handleModal("CreateUpdateContact");
      };
    

    const {operations} = useContact();

    const [getPartyPrivateContactsHandler, getPartyPrivateContactsRequest] = operations.getPartyPrivateContacts;
    const [deleteContactHandler, deleteContactRequest] = operations.deleteContact;

    const removeContact = (contactId: string)=> {
      deleteContactHandler({
            variables: {
                id: parseInt(contactId),
                appUserGroupId: user.currentAppUserGroupId
            }
        })
    }

    React.useEffect(() => {
      getPartyPrivateContactsHandler({variables: {
            partyId: parseInt(recordId),
            appUserGroupId: user.currentAppUserGroupId,
            //statusId: 1
        }})
    }, [])
    

    return (
        
        
        <>
        <StyledPaper>
           <Box
      sx={{
        width: {
            xs: "100%", // theme.breakpoints.up('xs')
            sm: "60%", //400, // theme.breakpoints.up('sm')
            // md: 300, // theme.breakpoints.up('md')
            lg: "360px", // theme.breakpoints.up('lg')
            //xl: 500, // theme.breakpoints.up('xl')
          },
        padding: {
          //xs: "1rem 0",
          //md: "1rem 2rem",
        },
        margin: {
          lg: "0 1rem"
        }
      }}
    >
        <Typography variant="h6">{t('entityType.contacts')}</Typography>

        {getPartyPrivateContactsRequest.data?.partyPrivateContacts?.length && <> 
          <Typography>{t('singleRecord.privateContacts')}</Typography>
        <MultiLevelList listName="privateContacts"  data={getPartyPrivateContactsRequest.data.partyPrivateContacts} deleteItem={removeContact}/>
        </>
      }
        <Button
        variant={"contained"}
        sx={{ my: 3, width: "150px" }}
        onClick={toggleCreateUpdateContactModal}
      >
        {t('singleRecord.createNewContact')}
      </Button>
        </Box>
        </StyledPaper>
        </>
    )
}

