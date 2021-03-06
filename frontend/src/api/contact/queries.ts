import { gql } from "@apollo/client";

export const GET_CONTACTTYPE_LIST = gql`
  query {
    contactTypeList {
      id
      name
    }
  }
`;

export const GET_PARTY_PRIVATE_CONTACTS = gql`
  query ($appUserGroupId: Int!, $partyId: Int!, $statusId: Int) {
    partyPrivateContacts(
      data: {
        appUserGroupId: $appUserGroupId,
        partyId: $partyId,
        statusId: $statusId
      }
    ) {
      id
      typeId
      contactType {
        id
        name
      }
      value
      status {
        id
        name
      }
    }
  }
`;

export const GET_PARTYRELATIONSHIP_CONTACTS = gql`
  query (
    $partyId: Int!
    $partyRelationshipIdList: [Int!]!
    $statusId: Int
    $appUserGroupId: Int!
  ) {
    partyRelationshipContacts(
      data: {
        partyId: $partyId
        partyRelationshipIdList: $partyRelationshipIdList
        statusId: $statusId
        appUserGroupId: $appUserGroupId
      }
    ) {
      id
      mainPartyId
      partyRelationshipId
      contactType {
        id
        name
      }
      value
      status {
        id
        name
      }
    }
  }
`;
