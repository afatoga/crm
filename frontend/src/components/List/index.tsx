import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  styled,
} from "@mui/material";

import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useParty } from "../../hooks/useParty";
import {
  ORGANIZATION_PARTY_TYPE_ID,
  PERSON_PARTY_TYPE_ID,
} from "../../utils/constants";
import { useTranslation } from "react-i18next";

// Types
import {
  Tag,
  ExtendedTagParty,
  ExtendedPartyRelationship,
  ExtendedContact,
} from "../../types/codegen";

interface IMultiLevelList {
  currentRecordId?: string;
  currentRecordType?: string;
  data:
    | ExtendedTagParty[]
    | Tag[]
    | ExtendedPartyRelationship[]
    | ExtendedContact[];
  deleteItem?: (id: string) => void;
  editItem?: (id: string) => void;
  listName?: string;
}

export const MultiLevelList = ({
  currentRecordId,
  currentRecordType,
  data,
  deleteItem,
  editItem,
  listName,
}: IMultiLevelList) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { operations } = useParty();

  const navigateToItem = (item: any) => {
    if (
      listName === "organizationToOrganizationRelationships" ||
      listName === "personToOrganizationRelationships" ||
      listName === "personToPersonRelationships"
    ) {
      const otherPartyId =
        parseInt(currentRecordId) === item.firstPartyId
          ? item.secondPartyId
          : item.firstPartyId;

      let otherPartyTypeId = 1;
      if (listName === "organizationToOrganizationRelationships")
        otherPartyTypeId = ORGANIZATION_PARTY_TYPE_ID;
      else if (
        listName === "personToOrganizationRelationships" &&
        currentRecordType === "person"
      )
        otherPartyTypeId = ORGANIZATION_PARTY_TYPE_ID;
      else if (
        listName === "personToOrganizationRelationships" &&
        currentRecordType === "organization"
      )
        otherPartyTypeId = PERSON_PARTY_TYPE_ID;
      else if (listName === "personToPersonRelationships")
        otherPartyTypeId = PERSON_PARTY_TYPE_ID;

      return navigate(
        `/${
          otherPartyTypeId === PERSON_PARTY_TYPE_ID ? "people" : "organizations"
        }/${otherPartyId}`
      );
    } else if (listName === "tagList") {
      return navigate(`/tags/${item.id}`);
    } else if (listName === "taggedParties") {
      if (!item.personFullName || !item.personFullName.trim().length) {
        return navigate(`/organizations/${item.partyId}`);
      } else return navigate(`/people/${item.partyId}`);
    } else if (listName === "searchResults") {
      if (item.entity === "Contact") {
        return navigate(
          `${
            parseInt(item.contactPartyTypeId) === PERSON_PARTY_TYPE_ID
              ? "/people/"
              : "/organizations/"
          }${item.contactPartyId}`
        );
      } else if (item.entity === "Person") {
        return navigate(`/people/${item.entityId}`);
      } else if (item.entity === "Organization") {
        return navigate(`/organizations/${item.entityId}`);
      } else if (item.entity === "Tag") {
        return navigate(`/tags/${item.entityId}`);
      }
    }

    return false;
  };

  const getLabel = (item: any) => {
    if (
      listName === "organizationToOrganizationRelationships" ||
      listName === "personToOrganizationRelationships" ||
      listName === "personToPersonRelationships"
    ) {
      return parseInt(currentRecordId) === item.firstPartyId
        ? item.secondPartyName
        : item.firstPartyName;
    } else if (listName === "taggedParties") {
      return !item.personFullName || !item.personFullName.trim().length
        ? item.organizationName
        : item.personFullName;
    } else if (
      listName === "privateContacts" ||
      listName === "partyRelationshipContacts"
    ) {
      return item.value;
    } else if (listName === "searchResults") {
      return item.searchedValue;
    }

    return item.name;
  };
  const getSubtitle = (item: any) => {
    if (
      listName === "organizationToOrganizationRelationships" ||
      listName === "personToOrganizationRelationships" ||
      listName === "personToPersonRelationships"
    ) {
      const relationshipTypeList =
        operations.retrievePartyRelationshipTypesFromCache();
      const found = relationshipTypeList.find(
        (relationshipType: any) => parseInt(relationshipType.id) === item.typeId
      );
      return found
        ? t(`partyRelationshipType.${found.category}.${found.name}`)
        : "";
    } else if (listName === "privateContacts") {
      return item.contactType?.name;
    } else if (listName === "partyRelationshipContacts") {
      return `${item.contactType?.name}, ${item.otherPartyName}`;
    } else if (listName === "searchResults") {
      return t(`entityType.${item.entity.toLowerCase()}`);
    }

    return undefined;
  };

  return (
    <List dense={false}>
      {data.map((item: any) => {
        let listItemKey: string = item.id;
        if (listName === "taggedParties") listItemKey = item.partyId;
        else if (listName === "searchResults")
          listItemKey = `${item.entity}_${item.entityId}`;

        return (
          <ListItem
            key={listItemKey}
            secondaryAction={
              <>
                {(listName === "privateContacts" ||
                  listName === "partyRelationshipContacts") && (
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => editItem(item.id)}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                {deleteItem && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() =>
                      deleteItem(
                        listName === "taggedParties" ? item.partyId : item.id
                      )
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </>
            }
          >
            <StyledListItemText
              primary={getLabel(item)}
              secondary={getSubtitle(item)}
              onClick={() => navigateToItem(item)}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

const StyledListItemText = styled(ListItemText)`
  span.MuiTypography-root:hover {
    cursor: pointer;
  }
`;
