import * as React from "react";
import { useTag } from "../../../hooks/useTag";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { MultiLevelList } from "../../List";
import { Typography, Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ModalContext } from "../../../contexts/ModalContext";
import { StyledPaper } from "../../Container";

export const SinglePartyTags = () => {
  const { id: recordId } = useParams(); //always string
  const { user } = useAuth();
  const { t } = useTranslation();
  const { handleModal } = React.useContext(ModalContext);

  const toggleNewTagPartyModal = () => {
    handleModal("NewTagParty");
  };

  const { operations } = useTag();

  const [getSinglePartyTagsHandler, getSinglePartyTagsRequest] =
    operations.getSinglePartyTags;
  const [deleteTagPartyHandler, deleteTagPartyRequest] =
    operations.deleteTagParty;

  const untag = (tagId: string) => {
    deleteTagPartyHandler({
      variables: {
        tagId: parseInt(tagId),
        partyId: parseInt(recordId),
        appUserGroupId: user.currentAppUserGroupId,
      },
    });
  };

  React.useEffect(() => {
    getSinglePartyTagsHandler({
      variables: {
        partyId: parseInt(recordId),
        appUserGroupId: user.currentAppUserGroupId,
      },
    });
  }, []);

  return (
    <>
      {getSinglePartyTagsRequest.data?.singlePartyTags && (
        <StyledPaper  sx={{
            width: {
              xs: "100%", // theme.breakpoints.up('xs')
              sm: "60%", //400, // theme.breakpoints.up('sm')
              // md: 300, // theme.breakpoints.up('md')
              lg: "360px", // theme.breakpoints.up('lg')
              //xl: 500, // theme.breakpoints.up('xl')
            },
          }}>
         
            <Typography variant="h6">{t("singleRecord.tags")}</Typography>

            <MultiLevelList
              listName="tagList"
              data={getSinglePartyTagsRequest.data.singlePartyTags}
              deleteItem={untag}
            />
            <Button
              variant={"contained"}
              sx={{ my: 3, width: "150px" }}
              onClick={toggleNewTagPartyModal}
            >
              {t("singleRecord.createNewTagParty")}
            </Button>
          
        </StyledPaper>
      )}
    </>
  );
};
