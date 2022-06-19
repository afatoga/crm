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
    $partyRelationshipId: Int!
    $statusId: Int
    $appUserGroupId: Int!
  ) {
    partyRelationshipContacts(
      data: {
        partyId: $partyId
        partyRelationshipId: $partyRelationshipId
        statusId: $statusId
        appUserGroupId: $appUserGroupId
      }
    ) {
      id
      type {
        name
      }
      value
      status {
        name
      }
    }
  }
`;
