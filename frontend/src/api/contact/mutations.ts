import { gql } from "@apollo/client";

export const CREATE_CONTACT = gql`
  mutation (
    $partyId: Int!
    $partyRelationshipId: Int
    $typeId: Int
    $contactValue: String!
    $statusId: Int
    $appUserGroupId: Int!
  ) {
    createContact(
      data: {
        mainPartyId: $partyId,
        partyRelationshipId: $partyRelationshipId,
        typeId: $typeId,
        value: $contactValue,
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
    #$partyId: Int!
    $partyRelationshipId: Int
    $contactValue: String!
    $typeId: Int
    $statusId: Int
    $appUserGroupId: Int!
  ) {
    updateContact(
      data: {
        id: $id,
        #mainPartyId: $partyId,
        partyRelationshipId: $partyRelationshipId,
        typeId: $typeId,
        statusId: $statusId,
        value: $contactValue,
        appUserGroupId: $appUserGroupId
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
