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
export const GET_PEOPLE = gql`
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
export const GET_PARTIES_BY_NAME = gql`
  query ($searchedName: String!, $appUserGroupId: Int!, $statusId: Int) {
    partiesByName(
      data: { appUserGroupId: $appUserGroupId, statusId: $statusId, searchedName: $searchedName }
    ) {
      id
      typeId
      name
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
  query ($partyId: Int!, $appUserGroupId: Int!) {
    partyRelationships(partyId: $partyId, appUserGroupId: $appUserGroupId) {
      organizationToOrganization{
        id
        typeId #type of relationship
        firstPartyId
        firstPartyName
        secondPartyId
        secondPartyName
      }
      personToOrganization{
        id
        typeId
        firstPartyId
        firstPartyName
        secondPartyId
        secondPartyName
      }
      personToPerson{
        id
        typeId
        firstPartyId
        firstPartyName
        secondPartyId
        secondPartyName
      }
    }
  }
`;
export const GET_PARTYRELATIONSHIP_TYPE_LIST = gql`
  query {
    partyRelationshipTypeList {
      id
      name
      category
    }
  }
`;
