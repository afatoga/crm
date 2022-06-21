import * as React from "react";
import { useTag } from "../../../hooks/useTag";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { MultiLevelList } from "../../List";
import { Typography, Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ModalContext } from "../../../contexts/ModalContext";
import { StyledPaper } from "../../Container";
import { actionResultVar } from "../../../App";
import { useReactiveVar } from "@apollo/client";

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

const [selectedTagId, setSelectedTagId] = React.useState<string>(''); 
const actionResult = useReactiveVar(actionResultVar);

  const untag = (tagId: string) => {
    handleModal("ConfirmDialog");
    setSelectedTagId(tagId);

   
  };

  React.useEffect(() => {
    if (actionResult.code === "CONFIRM" && selectedTagId.length) {

        deleteTagPartyHandler({
            variables: {
              tagId: parseInt(selectedTagId),
              partyId: parseInt(recordId),
              appUserGroupId: user.currentAppUserGroupId,
            },
          });

      actionResultVar({});
  
    }
  }, [actionResult])

  React.useEffect(() => {
    getSinglePartyTagsHandler({
      variables: {
        partyId: parseInt(recordId),
        appUserGroupId: user.currentAppUserGroupId,
      },
    });
  }, [recordId]);

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
            marginBottom: {
              xs: 2,
              lg: 0
            }
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
