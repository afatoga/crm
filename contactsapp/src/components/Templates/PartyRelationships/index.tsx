import * as React from 'react';

import {
    Typography,
    Box,
    Button,
    Grid,
    List,
    ListItem,
    ListItemText,
    IconButton
} from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';

import {ModalContext} from '../../../contexts/ModalContext';
import { useParty } from '../../../hooks/useParty';
import {useParams } from "react-router";
import { useAuth } from '../../../hooks/useAuth';

export const PartyRelationships = () => {
    const { id: recordIdString } = useParams();
    const {user} = useAuth();
    // actions: create or delete (update is unnecessary)
    const {operations} = useParty();
    const [getPartyRelationshipsHandler, getPartyRelationshipsRequest] = operations.getPartyRelationships;
    let { handleModal } = React.useContext(ModalContext);  

    const toggleNewRelationshipModal = () => {
        handleModal('NewRelationship');
    }

    React.useEffect(() => {
        getPartyRelationshipsHandler({
            variables: {
                partyId: parseInt(recordIdString),
                appUserGroupId: user.currentAppUserGroupId
            }
        })
    }, []);
    // React.useEffect(() => {
    //     getPartyRelationshipsRequest
    // }, [getPartyRelationshipsRequest]);

    return (
        <Box sx={{
            width: {
              xs: "100%", // theme.breakpoints.up('xs')
              md: "40%", // theme.breakpoints.up('sm')
              // md: 300, // theme.breakpoints.up('md')
              lg: 360, // theme.breakpoints.up('lg')
              //xl: 500, // theme.breakpoints.up('xl')
            },
            padding: {
                xs: '1rem 0',
                md: '1rem 2rem'
            }
          }}>

            {/* <Typography variant="h6">
            Relationships
            </Typography> */}

            <Grid item xs={12} md={6}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          Relationships
          </Typography>
          {/* <Demo> */}
           {getPartyRelationshipsRequest.data?.partyRelationships.length > 0 &&  
            <List dense={false}>
              {getPartyRelationshipsRequest.data.partyRelationships.map((item) => (
                <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                }
              >
                {/* <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar> */}
                <ListItemText
                  primary={item.name}
                  //secondary={secondary ? 'Secondary text' : null}
                />
              </ListItem>
                ))
              }
            </List>}
          {/* </Demo> */}
        </Grid>

            <Button variant={"contained"} sx={{my: 3 ,width: '120px'}} onClick={toggleNewRelationshipModal}>
                Add new
            </Button>

        </Box>
    )
}