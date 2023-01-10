import * as React from "react";
import { useTag } from "../../../hooks/useTag";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { MultiLevelList } from "../../List";
import { Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { StyledPaper } from "../../Container";
import { ExtendedTagParty } from "../../../types/codegen";

export const TaggedParties = () => {
  const { id: recordId } = useParams(); //always string
  const { user } = useAuth();
  const { t } = useTranslation();
  const { operations } = useTag();

  const [getTaggedPartiesHandler, getTaggedPartiesRequest] =
    operations.getTaggedParties;
  const [deleteTagPartyHandler] = operations.deleteTagParty;

  const untag = (partyId: string) => {
    deleteTagPartyHandler({
      variables: {
        partyId: parseInt(partyId),
        tagId: parseInt(recordId),
        appUserGroupId: user.currentAppUserGroupId,
      },
    });
  };

  React.useEffect(() => {
    getTaggedPartiesHandler({
      variables: {
        tagId: parseInt(recordId),
        appUserGroupId: user.currentAppUserGroupId,
      },
    });
  }, []);

  if (getTaggedPartiesRequest.loading) {
    return <div>loading...</div>;
  }

  const taggedParties: ExtendedTagParty[] =
    getTaggedPartiesRequest?.data && getTaggedPartiesRequest.data.taggedParties;

  return (
    <>
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
        <Box>
          <Typography variant="h6">{t("singleRecord.connections")}</Typography>

          {taggedParties?.length > 0 ? (
            <MultiLevelList
              listName="taggedParties"
              data={taggedParties}
              deleteItem={untag}
            />
          ) : (
            <Typography mt={2}>{t("general.noRecords")}</Typography>
          )}
        </Box>
      </StyledPaper>
    </>
  );
};
