import * as React from "react";

import { Typography, Button } from "@mui/material";

import { ModalContext } from "../../../contexts/ModalContext";
import { useParty } from "../../../hooks/useParty";
import { useParams } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { MultiLevelList } from "../../List";
import { useReactiveVar } from "@apollo/client";
import { actionResultVar } from "../../../App";
import { useTranslation } from "react-i18next";
import { StyledPaper } from "../../Container";

export const PartyRelationships: React.FC<{ recordType: string }> = ({
  recordType,
}) => {
  const { id: recordIdString } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedRelationshipId, setSelectedRelationshipId] =
    React.useState<string>("");

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
      getPartyRelationshipsRequest.refetch({
        partyId: parseInt(recordIdString),
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
    } else if (
      actionResult.code === "CANCEL" &&
      selectedRelationshipId.length
    ) {
      setSelectedRelationshipId(""); //reset
    }
  }, [actionResult]);

  React.useEffect(() => {
    if (deletePartyRelationshipRequest.data) {
      if (
        deletePartyRelationshipRequest.data.deletePartyRelationship.status ===
        "SUCCESS"
      ) {
        setSelectedRelationshipId(""); //reset
        getPartyRelationshipsRequest.refetch();
      } else {
        console.warn("error: removal request failed");
      }

      deletePartyRelationshipRequest.reset();
    }
  }, [deletePartyRelationshipRequest]);

  return (
    <StyledPaper
      sx={{
        width: {
          xs: "100%", // theme.breakpoints.up('xs')
          sm: "60%", //400, // theme.breakpoints.up('sm')
          // md: 300, // theme.breakpoints.up('md')
          lg: "360px", // theme.breakpoints.up('lg')
          //xl: 500, // theme.breakpoints.up('xl')
        },
        marginBottom: {
          xs: 2,
          lg: 0,
        },
      }}
    >
      <Typography variant="h6">{t("singleRecord.relationships")}</Typography>
      {getPartyRelationshipTypeListRequest.data && (
        <>
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
              <Typography variant="subtitle1">
                {recordType === "person"
                  ? t("entityType.organizations")
                  : t("entityType.people")}
              </Typography>
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
              <Typography variant="subtitle1">
                {t("entityType.people")}
              </Typography>
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
        </>
      )}
      {/* </Demo> */}
      {/* </Grid> */}

      <Button
        variant={"contained"}
        sx={{ my: 3, width: "150px" }}
        onClick={toggleNewRelationshipModal}
      >
        {t("singleRecord.createNewRelationship")}
      </Button>
    </StyledPaper>
  );
};
