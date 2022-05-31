import { gql } from "@apollo/client";

export const GET_ALL_PERSONS = gql`
  query {
    allPersons {
      partyId
      name
      surname
    }
  }
`;
export const GET_PERSONS_BY_APPUSERGROUP = gql`
  query ($appUserGroupId: Int!, $statusId: Int) {
    personsByAppUserGroup(
      data: { appUserGroupId: $appUserGroupId, statusId: $statusId }
    ) {
      partyId
      name
      surname
    }
  }
`;
export const GET_PERSON_BY_ID = gql`
  query ($appUserGroupId: Int!, $id: Int!) {
    personById(data: { appUserGroupId: $appUserGroupId, id: $id }) {
      partyId
      name
      surname
      preDegree
      postDegree
      birthday
      statusId
    }
  }
`;

export const GET_PARTYRELATIONSHIPS = gql`
  query ($partyId: Int!) {
    partyRelationships(partyId: $partyId) {
      id
      firstPartyId
      secondPartyId
      typeId
    }
  }
`;
export const GET_PARTYRELATIONSHIP_TYPE_LIST = gql`
  query {
    partyRelationshipTypeList {
      id
      name
    }
  }
`;
