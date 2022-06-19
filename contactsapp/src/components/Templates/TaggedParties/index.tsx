import * as React from 'react';
import { useTag } from '../../../hooks/useTag';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { MultiLevelList } from "../../List";
import { Typography, Box, Button } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { ModalContext } from "../../../contexts/ModalContext";
import { StyledPaper } from '../../Container';

export const TaggedParties = () => {
    const { id: recordId } = useParams(); //always string
    const { user } = useAuth();
    const {t} = useTranslation();
    //const {handleModal} = React.useContext(ModalContext);

    // const toggleNewTagPartyModal = () => {
    //     handleModal("NewTagParty");
    //   };
    

    const {operations} = useTag();

    const [getTaggedPartiesHandler, getTaggedPartiesRequest] = operations.getTaggedParties;
    const [deleteTagPartyHandler, deleteTagPartyRequest] = operations.deleteTagParty;

    const untag = (partyId: string)=> {
        deleteTagPartyHandler({
            variables: {
                partyId: parseInt(partyId),
                tagId: parseInt(recordId),
                appUserGroupId: user.currentAppUserGroupId
            }
        })
    }

    React.useEffect(() => {
        getTaggedPartiesHandler({variables: {
            tagId: parseInt(recordId),
            appUserGroupId: user.currentAppUserGroupId
        }})
    }, [])
    

    return (
        
        
        <>
         {getTaggedPartiesRequest.data?.taggedParties &&
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
        <Typography variant="h6">{t('singleRecord.connections')}</Typography>

        {getTaggedPartiesRequest.data.taggedParties.length > 0  ? 
        <MultiLevelList listName="taggedParties"  data={getTaggedPartiesRequest.data.taggedParties} deleteItem={untag}/>
        : 
        <Typography mt={2}>{t('general.noRecords')}</Typography>
        }
        {/* <Button
        variant={"contained"}
        sx={{ my: 3, width: "150px" }}
        onClick={toggleNewTagPartyModal}
      >
        {t('singleRecord.createNewTagParty')}
      </Button> */}
        </Box> 
        </StyledPaper>}
        </>
    )
}