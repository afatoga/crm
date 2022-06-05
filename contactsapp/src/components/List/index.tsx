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
import { useNavigate } from "react-router-dom";

interface IMultiLevelList {
    currentRecordId?: string,
    data: any,
    deleteItem: (id: string) => void;
    listName?: string;
}



export const MultiLevelList = ({currentRecordId = undefined, data, deleteItem, listName}: IMultiLevelList) => {
    const navigate = useNavigate();

    const navigateToItem = (id: string) => {
        if (listName === 'personToPersonRelationships') {
            return navigate('/people/'+id);
        }
        return false;
    }

    const getLabel = (item: any) => {
        console.log(item, currentRecordId)

        if (listName === 'organizationToOrganizationRelationships' 
         || listName === 'personToOrganizationRelationships'
         || listName === 'personToPersonRelationships' ) {
             return parseInt(currentRecordId) === item.firstPartyId ? item.secondPartyName : item.firstPartyName;
         }

        return item.name;
    }

    return (

        <List dense={false}>
        {data.map((item:any) => {
        //   const recordId = parseInt(recordIdString);
        //   let itemToDisplay:PartyRelationship = {
        //     id: item.id,
        //     otherPartyId: 0,
        //     name: '',
        //     typeName: item.typeId ? item.typeId : '', // to retrieve!
        //   };

        //   if (item.firstPartyId === recordId) { //current record entity is priviledged.
        //     itemToDisplay = {
        //       ...itemToDisplay,
        //       otherPartyId: item.secondPartyId,
        //       name: item.secondPartyPersonName
        //         ? item.secondPartyPersonName
        //         : item.secondPartyOrganizationName,
        //     };
        //   } else if (item.secondPartyId === recordId) {
        //     itemToDisplay = {
        //       ...itemToDisplay,
        //       otherPartyId: item.firstPartyId,
        //       name: item.firstPartyPersonName
        //         ? item.firstPartyPersonName
        //         : item.firstPartyOrganizationName,
        //     };
        //   }

          return (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              {/* <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar> */}
              <ListItemText
                primary={getLabel(item)}
                onClick={() => navigateToItem(item.id)}
                //secondary={secondary ? 'Secondary text' : null}
              />
            </ListItem>
          );
        })}
      </List>

    )
}