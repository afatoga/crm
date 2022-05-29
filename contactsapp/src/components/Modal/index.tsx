import React, { FC, useEffect } from "react";
// import FocusLock from "react-focus-lock";
import ReactDOM from "react-dom";
import { ModalContext } from "../../contexts/ModalContext";
import { NewRelationshipModal } from "../Templates/PartyRelationships/NewRelationshipModal";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
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

  const getModalTitle = (): JSX.Element => {
    if (template === "NewRelationship")
      return (
        <BootstrapDialogTitle
          // id="customized-dialog-title"
          onClose={handleModal}
        >
          Create new relationship
        </BootstrapDialogTitle>
      );
    return null;
  };

  const getModalContent = (): JSX.Element => {
    if (template === "NewRelationship") return <NewRelationshipModal />;
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
        aria-labelledby="customized-dialog-title"
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
