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
import {useParty} from '../../hooks/useParty';
import {ORGANIZATION_PARTY_TYPE_ID, PERSON_PARTY_TYPE_ID,
  } from '../../utils/constants';

interface IMultiLevelList {
    currentRecordId?: string,
    currentRecordType?: string,
    data: any,
    deleteItem: (id: string) => void;
    listName?: string;
}



export const MultiLevelList = ({currentRecordId = undefined, currentRecordType, data, deleteItem, listName}: IMultiLevelList) => {
    const navigate = useNavigate();

    const {operations} = useParty();

    const navigateToItem = (item: any) => {
        if (listName === 'organizationToOrganizationRelationships' 
         || listName === 'personToOrganizationRelationships'
         || listName === 'personToPersonRelationships') {

            const otherPartyId = parseInt(currentRecordId) === item.firstPartyId ? item.secondPartyId : item.firstPartyId;
            
            let otherPartyTypeId = 1;
            if (listName === 'organizationToOrganizationRelationships') otherPartyTypeId = ORGANIZATION_PARTY_TYPE_ID;
            else if (listName === 'personToOrganizationRelationships' && currentRecordType === 'person') otherPartyTypeId = ORGANIZATION_PARTY_TYPE_ID;
            else if (listName === 'personToOrganizationRelationships' && currentRecordType === 'organization') otherPartyTypeId = PERSON_PARTY_TYPE_ID;
            else if (listName === 'personToPersonRelationships') otherPartyTypeId = PERSON_PARTY_TYPE_ID;

            return navigate(`/${otherPartyTypeId === PERSON_PARTY_TYPE_ID ? 'people' : 'organizations'}/${otherPartyId}`);
         }
            
        
        return false;
    }

    const getLabel = (item: any) => {
        // console.log(item, currentRecordId)

        if (listName === 'organizationToOrganizationRelationships' 
         || listName === 'personToOrganizationRelationships'
         || listName === 'personToPersonRelationships' ) {
             return parseInt(currentRecordId) === item.firstPartyId ? item.secondPartyName : item.firstPartyName;
         }

        return item.name;
    }
    const getSubtitle = (item: any) => {
        // console.log(item, currentRecordId)

        if (listName === 'organizationToOrganizationRelationships' 
         || listName === 'personToOrganizationRelationships'
         || listName === 'personToPersonRelationships' ) {
             const relationshipTypeList = operations.retrievePartyRelationshipTypesFromCache();
             const found = relationshipTypeList.find((relationshipType:any) => parseInt(relationshipType.id) === item.typeId);
             return found?.name;

        }

        return undefined;
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
                secondary={getSubtitle(item)}
                onClick={() => navigateToItem(item)}
                //secondary={secondary ? 'Secondary text' : null}
              />
            </ListItem>
          );
        })}
      </List>

    )
}