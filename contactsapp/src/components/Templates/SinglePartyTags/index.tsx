import * as React from 'react';
import { useTag } from '../../../hooks/useTag';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { MultiLevelList } from "../../List";
import { Typography, Box, Button } from "@mui/material";
import { useTranslation } from 'react-i18next';

export const SinglePartyTags = () => {
    const { id: recordId } = useParams(); //always string
    const { user } = useAuth();
    const {t} = useTranslation();

    const {operations} = useTag();

    const [getSinglePartyTagsHandler, getSinglePartyTagsRequest] = operations.getSinglePartyTags;
    const [deleteTagPartyHandler, deleteTagPartyRequest] = operations.deleteTagParty;

    const untag = (tagId: string)=> {
        deleteTagPartyHandler({
            variables: {
                tagId: parseInt(tagId),
                partyId: parseInt(recordId),
                appUserGroupId: user.currentAppUserGroupId
            }
        })
    }

    React.useEffect(() => {
        getSinglePartyTagsHandler({variables: {
            partyId: parseInt(recordId),
            appUserGroupId: user.currentAppUserGroupId
        }})
    }, [])
    

    return (
        
        
        <>
         {getSinglePartyTagsRequest.data?.singlePartyTags &&
           <Box
      sx={{
        width: {
          xs: "100%", // theme.breakpoints.up('xs')
          md: "40%", // theme.breakpoints.up('sm')
          // md: 300, // theme.breakpoints.up('md')
          lg: 600, // theme.breakpoints.up('lg')
          //xl: 500, // theme.breakpoints.up('xl')
        },
        padding: {
          xs: "1rem 0",
          md: "1rem 2rem",
        },
      }}
    >
        <Typography variant="h6">{t('singleRecord.tags')}</Typography>

        <MultiLevelList data={getSinglePartyTagsRequest.data.singlePartyTags} deleteItem={untag}/>
        
        </Box> }
        </>
    )
}