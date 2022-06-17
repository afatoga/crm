import * as React from "react";

import { Typography, Box, Button } from "@mui/material";

import { ModalContext } from "../../../contexts/ModalContext";
import { useParty } from "../../../hooks/useParty";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { MultiLevelList } from "../../List";
import { useReactiveVar } from "@apollo/client";
import { actionResultVar } from "../../../App";
import { useTranslation } from "react-i18next";

// type PartyRelationship = {
//   id: string,
//   otherPartyId: number,
//   name: string,
//   typeName: string
// }

export const PartyRelationships: React.FC<{recordType: string}> = ({recordType}) => {
  const { id: recordIdString } = useParams();
  const {t} = useTranslation();
  //const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedRelationshipId,setSelectedRelationshipId] = React.useState<string>('');

  // actions: create or delete (update is unnecessary)
  const { operations } = useParty();
  const [getPartyRelationshipsHandler, getPartyRelationshipsRequest] =
    operations.getPartyRelationships;
  const [deletePartyRelationshipHandler, deletePartyRelationshipRequest] =
    operations.deletePartyRelationship;
  const [
    getPartyRelationshipTypeListHandler,
    getPartyRelationshipTypeListRequest,
  ] = operations.getPartyRelationshipTypeList;

  let { handleModal, isShown } = React.useContext(ModalContext);

  const toggleNewRelationshipModal = () => {
    handleModal("NewRelationship");
  };

  const deleteRelationship = (partyRelationshipId: string) => {
    handleModal("ConfirmDialog");
    setSelectedRelationshipId(partyRelationshipId);
  };

  const actionResult = useReactiveVar(actionResultVar);

  React.useEffect(() => {
    getPartyRelationshipsHandler({
      variables: {
        partyId: parseInt(recordIdString),
        appUserGroupId: user.currentAppUserGroupId,
      },
    });

    getPartyRelationshipTypeListHandler();
  }, []);

  React.useEffect(() => {
    if (getPartyRelationshipsRequest.called && !isShown) {
      //refetches on every modal closing
      getPartyRelationshipsRequest.refetch({
        partyId: parseInt(recordIdString)
    });
    }
  }, [isShown, recordIdString]);

  React.useEffect(() => {
    if (actionResult.code === "CONFIRM" && selectedRelationshipId.length) {

      deletePartyRelationshipHandler({
        variables: {
          id: parseInt(selectedRelationshipId),
          appUserGroupId: user.currentAppUserGroupId,
        },
      });

      actionResultVar({});
  
    }

    else if (actionResult.code === "CANCEL" && selectedRelationshipId.length) {

      setSelectedRelationshipId(''); //reset
  
    }
  }, [actionResult]);

  React.useEffect(() => {
    if (deletePartyRelationshipRequest.data) {
      if (
        deletePartyRelationshipRequest.data.deletePartyRelationship.status ===
        "SUCCESS"
      ) {
        setSelectedRelationshipId(''); //reset
        getPartyRelationshipsRequest.refetch();
      } else {
        console.warn("error: removal request failed");
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
      <Typography variant="h6">{t('singleRecord.relationships')}</Typography>
      {/* <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          Relationships
        </Typography> */}
      {/* <Demo> */}
      {getPartyRelationshipTypeListRequest.data && <>
      {getPartyRelationshipsRequest.data?.partyRelationships
        .organizationToOrganization.length > 0 && (
        <>
          <Typography variant="subtitle1">Organizations</Typography>
          <MultiLevelList
            currentRecordId={recordIdString}
            currentRecordType={recordType}
            data={
              getPartyRelationshipsRequest.data?.partyRelationships
                .organizationToOrganization
            }
            listName="organizationToOrganizationRelationships"
            deleteItem={deleteRelationship}
          />
        </>
      )}
      {getPartyRelationshipsRequest.data?.partyRelationships
        .personToOrganization.length > 0 && (
        <>
          <Typography variant="subtitle1">{recordType === 'person' ? t('partyType.organizations') : t('partyType.people') }</Typography>
          <MultiLevelList
            currentRecordId={recordIdString}
            currentRecordType={recordType}
            data={
              getPartyRelationshipsRequest.data?.partyRelationships
                .personToOrganization
            }
            listName="personToOrganizationRelationships"
            deleteItem={deleteRelationship}
          />
        </>
      )}
      {getPartyRelationshipsRequest.data?.partyRelationships.personToPerson
        .length > 0 && (
        <>
          <Typography variant="subtitle1">{t('partyType.people')}</Typography>
          <MultiLevelList
            currentRecordId={recordIdString}
            currentRecordType={recordType}
            data={
              getPartyRelationshipsRequest.data?.partyRelationships
                .personToPerson
            }
            listName="personToPersonRelationships"
            deleteItem={deleteRelationship}
          />
        </>
      )}
      </>}
      {/* </Demo> */}
      {/* </Grid> */}

      <Button
        variant={"contained"}
        sx={{ my: 3, width: "150px" }}
        onClick={toggleNewRelationshipModal}
      >
        {t('singleRecord.createNewRelationship')}
      </Button>
    </Box>
  );
};
