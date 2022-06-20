//import * as React from "react";

import {
  // Typography,
  // Box,
  // Button,
  // Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  styled
} from "@mui/material";

import { Edit as EditIcon, Delete as DeleteIcon} from "@mui/icons-material";

//import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {useParty} from '../../hooks/useParty';
import {ORGANIZATION_PARTY_TYPE_ID, PERSON_PARTY_TYPE_ID,
  } from '../../utils/constants';
import { useTranslation } from "react-i18next";

interface IMultiLevelList {
    currentRecordId?: string,
    currentRecordType?: string,
    data: any,
    deleteItem: (id: string) => void;
    editItem?: (id: string) => void;
    listName?: string;
}



export const MultiLevelList = ({currentRecordId, currentRecordType, data, deleteItem, editItem, listName}: IMultiLevelList) => {
    const navigate = useNavigate();
    const {t} = useTranslation();

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

         else if (listName === 'tagList') {
            return navigate(`/tags/${item.id}`);
         }
         else if (listName === 'taggedParties') {
            if (!item.personFullName || !item.personFullName.trim().length) {
              return navigate(`/organizations/${item.partyId}`);
            } else return navigate(`/people/${item.partyId}`);
            
         }
            
        
        return false;
    }

    const getLabel = (item: any) => {

        if (listName === 'organizationToOrganizationRelationships' 
         || listName === 'personToOrganizationRelationships'
         || listName === 'personToPersonRelationships' ) {
             return parseInt(currentRecordId) === item.firstPartyId ? item.secondPartyName : item.firstPartyName;
         }

        if (listName === 'taggedParties') {
          return (!item.personFullName || !item.personFullName.trim().length) ? item.organizationName: item.personFullName;
        }
        if (listName === 'privateContacts' || listName === 'partyRelationshipContacts') {
          return item.value;
        }

        return item.name;
    }
    const getSubtitle = (item: any) => {

        if (listName === 'organizationToOrganizationRelationships' 
         || listName === 'personToOrganizationRelationships'
         || listName === 'personToPersonRelationships' ) {
             const relationshipTypeList = operations.retrievePartyRelationshipTypesFromCache();
             const found = relationshipTypeList.find((relationshipType:any) => parseInt(relationshipType.id) === item.typeId);
             return (found) ? t(`partyRelationshipType.${found.category}.${found.name}`) : '';

        }

        if (listName === 'privateContacts') {
          return item.contactType?.name;
        }
        if (listName === 'partyRelationshipContacts') {
          return `${item.contactType?.name}, ${item.otherPartyName}`;
        }

        return undefined;
    }

    return (

        <List dense={false}>
        {data.map((item:any) => {


          return (
            <ListItem
              key={listName === 'taggedParties' ? item.partyId:item.id}
              secondaryAction={
                <>
                {(listName === 'privateContacts' || listName === 'partyRelationshipContacts') && 
                <IconButton edge="end" aria-label="edit" onClick={() => editItem(item.id)}>
                <EditIcon />
              </IconButton>}
                <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(listName === 'taggedParties' ? item.partyId:item.id)}>
                  <DeleteIcon />
                </IconButton>
                </>
              }
            >
              {/* <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar> */}
              <StyledListItemText
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

const StyledListItemText = styled(ListItemText)`
span.MuiTypography-root:hover {     cursor: pointer;   }
`;