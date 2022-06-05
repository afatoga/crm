import * as React from "react";

import {
  Typography,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { ModalContext } from "../../../contexts/ModalContext";
import { useParty } from "../../../hooks/useParty";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";

type PartyRelationship = {
  id: string,
  otherPartyId: number,
  name: string,
  typeName: string
}


export const PartyRelationships = () => {
  const { id: recordIdString } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  // actions: create or delete (update is unnecessary)
  const { operations } = useParty();
  const [getPartyRelationshipsHandler, getPartyRelationshipsRequest] =
    operations.getPartyRelationships;
  const [deletePartyRelationshipHandler, deletePartyRelationshipRequest] =
    operations.deletePartyRelationship;
  let { handleModal, isShown } = React.useContext(ModalContext);

  const toggleNewRelationshipModal = () => {
    handleModal("NewRelationship");
  };

  const deleteRelationship = (partyRelationshipId: string) => {
    deletePartyRelationshipHandler({
      variables: {
        id: parseInt(partyRelationshipId),
        appUserGroupId: user.currentAppUserGroupId
      }
    })
  }

  React.useEffect(() => {
    getPartyRelationshipsHandler({
      variables: {
        partyId: parseInt(recordIdString),
        appUserGroupId: user.currentAppUserGroupId,
      },
    });
  }, []);

  React.useEffect(() => {
    if (getPartyRelationshipsRequest.called && !isShown) { //refetches on every modal closing
      getPartyRelationshipsRequest.refetch();
    }
  }, [isShown]);

  React.useEffect(() => {
    if (deletePartyRelationshipRequest.data) {
      if (deletePartyRelationshipRequest.data.deletePartyRelationship.status === 'SUCCESS') {
        getPartyRelationshipsRequest.refetch();
      }
      else {
        console.warn('error: removal request failed')
      }

      deletePartyRelationshipRequest.reset();
    }
  }, [deletePartyRelationshipRequest]);


  return (
    <Box
      sx={{
        width: {
          xs: "100%", // theme.breakpoints.up('xs')
          md: "40%", // theme.breakpoints.up('sm')
          // md: 300, // theme.breakpoints.up('md')
          lg: 360, // theme.breakpoints.up('lg')
          //xl: 500, // theme.breakpoints.up('xl')
        },
        padding: {
          xs: "1rem 0",
          md: "1rem 2rem",
        },
      }}
    >


      {/* <Grid item xs={12} md={6}> */}
      <Typography variant="h6">
            Relationships
            </Typography>
        {/* <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          Relationships
        </Typography> */}
        {/* <Demo> */}
        {getPartyRelationshipsRequest.data?.partyRelationships.length > 0 && (
          <List dense={false}>
            {getPartyRelationshipsRequest.data.partyRelationships.map((item:any) => {
              const recordId = parseInt(recordIdString);
              let itemToDisplay:PartyRelationship = {
                id: item.id,
                otherPartyId: 0,
                name: '',
                typeName: item.typeId ? item.typeId : '', // to retrieve!
              };

              if (item.firstPartyId === recordId) { //current record entity is priviledged.
                itemToDisplay = {
                  ...itemToDisplay,
                  otherPartyId: item.secondPartyId,
                  name: item.secondPartyPersonName
                    ? item.secondPartyPersonName
                    : item.secondPartyOrganizationName,
                };
              } else if (item.secondPartyId === recordId) {
                itemToDisplay = {
                  ...itemToDisplay,
                  otherPartyId: item.firstPartyId,
                  name: item.firstPartyPersonName
                    ? item.firstPartyPersonName
                    : item.firstPartyOrganizationName,
                };
              }

              return (
                <ListItem
                  key={itemToDisplay.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteRelationship(item.id)}>
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
                    primary={itemToDisplay.name}
                    onClick={() => navigate('')}
                    //secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
        {/* </Demo> */}
      {/* </Grid> */}

      <Button
        variant={"contained"}
        sx={{ my: 3, width: "120px" }}
        onClick={toggleNewRelationshipModal}
      >
        Add new
      </Button>
    </Box>
  );
};
