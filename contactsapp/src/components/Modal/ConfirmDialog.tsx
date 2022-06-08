import * as React from 'react';
import { ModalContext } from "../../contexts/ModalContext";
import { actionResultVar } from '../../App';

import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

export const ConfirmDialog: React.FC = () => {
    let { isShown, handleModal, template } = React.useContext(ModalContext);
    
    const confirmAction = () => {
        actionResultVar({code:"CONFIRM"});
        handleModal();
    }
    const cancelAction = () => {
        actionResultVar({code:"CANCEL"});
        handleModal();
    }

    return (
        <><DialogContent>
            Do you really want to remove this item?
        </DialogContent>
          <DialogActions>
          <Button autoFocus onClick={confirmAction} color={"success"}>
            Confirm
          </Button>
          <Button onClick={cancelAction} color={"error"}>
            Cancel
          </Button>
        </DialogActions>
        </>
    )
}