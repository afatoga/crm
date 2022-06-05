import * as React from "react";

import {
  Typography,
  Box,
  Button
} from "@mui/material";

import { ModalContext } from "../../../contexts/ModalContext";
import { useParty } from "../../../hooks/useParty";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { MultiLevelList } from "../../List";

// type PartyRelationship = {
//   id: string,
//   otherPartyId: number,
//   name: string,
//   typeName: string
// }


export const PartyRelationships = () => {
  const { id: recordIdString } = useParams();
  //const navigate = useNavigate();
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
        {getPartyRelationshipsRequest.data?.partyRelationships.organizationToOrganization.length > 0 && (
          <>
            <Typography variant="subtitle1">
              Organizations
            </Typography>
            <MultiLevelList currentRecordId={recordIdString} data={getPartyRelationshipsRequest.data?.partyRelationships.organizationToOrganization} listName="organizationToOrganizationRelationships" deleteItem={deleteRelationship} />
          </>
        )}
        {getPartyRelationshipsRequest.data?.partyRelationships.personToOrganization.length > 0 && (
          <>
            <Typography variant="subtitle1">
              Organizations
            </Typography>
            <MultiLevelList currentRecordId={recordIdString} data={getPartyRelationshipsRequest.data?.partyRelationships.personToOrganization} listName="personToOrganizationRelationships" deleteItem={deleteRelationship} />
          </>
        )}
        {getPartyRelationshipsRequest.data?.partyRelationships.personToPerson.length > 0 && (
          <>
            <Typography variant="subtitle1">
              People
            </Typography>
            <MultiLevelList currentRecordId={recordIdString} data={getPartyRelationshipsRequest.data?.partyRelationships.personToPerson} listName="personToPersonRelationships" deleteItem={deleteRelationship} />
          </>
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
