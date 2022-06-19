import { gql } from "@apollo/client";

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
        name
      }
      value
      status {
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
        name
      }
      value
      status {
        name
      }
    }
  }
`;
