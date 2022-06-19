import { gql } from "@apollo/client";

export const CREATE_CONTACT = gql`
  mutation (
    $partyId: Int!
    $partyRelationshipId: Int
    $name: String!
    $appUserGroupId: Int!
    $typeId: Int
    $statusId: Int
    $appUserGroupId: Int!
  ) {
    createContact(
      data: {
        mainPartyId: $partyId,
        partyRelationshipId: $partyRelationshipId,
        typeId: $typeId,
        value: $value,
        statusId: $statusId,
        appUserGroupId: $appUserGroupId
      }
    ) {
      id
    }
  }
`;
export const UPDATE_CONTACT = gql`
  mutation (
    $id: Int!
    $partyId: Int!
    $partyRelationshipId: Int
    $value: String!
    $typeId: Int
    $statusId: Int
    $appUserGroupId: Int!
  ) {
    updateContact(
      data: {
        id: $id,
        mainPartyId: $partyId,
        partyRelationshipId: $partyRelationshipId,
        typeId: $typeId,
        statusId: $statusId,
        value: $name,
        appUserGroupId: $appUserGroupId,
        statusId: $statusId
      }
    ) {
      id
    }
  }
`;
export const DELETE_CONTACT = gql`
  mutation (
    $id: Int!
    $appUserGroupId: Int!
  ) {
    deleteContact(
        data: {
          id: $id,
          appUserGroupId: $appUserGroupId
        }
    ) {
      status
      message
    }
  }
`;
