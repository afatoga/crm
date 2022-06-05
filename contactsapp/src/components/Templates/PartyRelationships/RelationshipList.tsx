import * as React from "react";

import {
  Typography,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { ModalContext } from "../../../contexts/ModalContext";
import { useParty } from "../../../hooks/useParty";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";


export const RelationshipList = () => {
    
    //const location = useLocation();
    let wholePath = location.pathname;
    const recordIdString = wholePath.replace(/^(?:[^\/]*\/){2}\s*/, '');
    //const { id: recordIdString } = useParams();

    const {user} = useAuth();
    let { handleModal } = React.useContext(ModalContext);  
    const {operations} = useParty();

    return (null);
}
