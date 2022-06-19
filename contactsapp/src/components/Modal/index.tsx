import React, { FC, useEffect } from "react";
// import FocusLock from "react-focus-lock";
import ReactDOM from "react-dom";
import { ModalContext } from "../../contexts/ModalContext";
import { ConfirmDialog } from "./ConfirmDialog";
import { NewRelationshipModal } from "../Templates/PartyRelationships/NewRelationshipModal";
import { NewTagPartyModal } from "../Templates/SinglePartyTags/NewTagPartyModal";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { CreateUpdateContactModal } from "../Templates/PartyContacts/CreateUpdateContactModal";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface DialogTitleProps {
  id?: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        m: 0,
        p: 2,
        width: {
          xs: "100%", // theme.breakpoints.up('xs')
          md: "460px", // theme.breakpoints.up('sm')
          // md: 300, // theme.breakpoints.up('md')
          //lg: 380, // theme.breakpoints.up('lg')
          //xl: 500, // theme.breakpoints.up('xl')
        },
        minWidth: {
          xs: '310px'
        }
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export const Modal: FC = () => {
  let { isShown, handleModal, template } = React.useContext(ModalContext);
  const { t } = useTranslation();

  const getModalTitle = (): JSX.Element => {
    if (template === "NewRelationship")
      return (
        <BootstrapDialogTitle
          // id="customized-dialog-title"
          onClose={handleModal}
        >
          {t("singleRecord.createNewRelationship")}
        </BootstrapDialogTitle>
      );
    else if (template === "NewTagParty")
      return (
        <BootstrapDialogTitle
          onClose={handleModal}
        >
          {t("singleRecord.createNewTagParty")}
        </BootstrapDialogTitle>
      );
    else if (template === "CreateUpdateContact")
      return (
        <BootstrapDialogTitle
          onClose={handleModal}
        >
          {t("singleRecord.createUpdateContact")}
        </BootstrapDialogTitle>
      );
    return null;
  };

  const getModalContent = (): JSX.Element => {
    if (template === "ConfirmDialog") return <ConfirmDialog />;
    else if (template === "NewRelationship") return <NewRelationshipModal />;
    else if (template === "NewTagParty") return <NewTagPartyModal />;
    else if (template === "CreateUpdateContact") return <CreateUpdateContactModal />;

    return null;
  };

  // const onKeyDown = (event: KeyboardEvent) => {
  //   if (event.key === 'Escape' && isShown) {
  //     handleModal();
  //   }
  // };

  // useEffect(() => {
  //   isShown
  //     ? (document.body.style.overflow = "hidden")
  //     : (document.body.style.overflow = "unset");
  //   document.addEventListener("keydown", onKeyDown, false);
  //   return () => {
  //     document.removeEventListener("keydown", onKeyDown, false);
  //   };
  // }, [isShown]);

  const modal = (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleModal}
        // aria-labelledby="customized-dialog-title"
        open={isShown}
      >
        {getModalTitle()}
        {getModalContent()}
      </BootstrapDialog>
      {/* <Backdrop onClick={hide} /> */}
      {/* <FocusLock> */}
      {/* <Wrapper
          aria-modal
          aria-labelledby={headerText}
          tabIndex={-1}
          role="dialog"
        >
          <StyledModal>
            <Header>
              <HeaderText>{headerText}</HeaderText>
              <CloseButton onClick={hide}>X</CloseButton>
            </Header>
            <Content>{modalContent}</Content>
          </StyledModal>
        </Wrapper> */}
      {/* </FocusLock> */}
    </React.Fragment>
  );

  return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};
