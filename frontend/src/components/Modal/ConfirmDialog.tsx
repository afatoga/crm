import * as React from "react";
import { ModalContext } from "../../contexts/ModalContext";
import { actionResultVar } from "../../App";

import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useTranslation } from "react-i18next";

export const ConfirmDialog: React.FC = () => {
  const { handleModal } = React.useContext(ModalContext);
  const { t } = useTranslation();

  const confirmAction = () => {
    actionResultVar({ code: "CONFIRM" });
    handleModal();
  };
  const cancelAction = () => {
    actionResultVar({ code: "CANCEL" });
    handleModal();
  };

  return (
    <>
      <DialogContent>{t("form.confirmYourAction")}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={confirmAction} color={"success"}>
          {t("userActions.confirm")}
        </Button>
        <Button onClick={cancelAction} color={"error"}>
          {t("userActions.cancel")}
        </Button>
      </DialogActions>
    </>
  );
};
