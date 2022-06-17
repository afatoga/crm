import { gql } from "@apollo/client";

export const CREATE_TAG = gql`
  mutation (
    $name: String!
    $appUserGroupId: Int!
    $statusId: Int
  ) {
    createTag(
      data: {
        name: $name
        appUserGroupId: $appUserGroupId
        statusId: $statusId
      }
    ) {
      id
    }
  }
`;
export const UPDATE_TAG = gql`
  mutation (
    $id: Int!
    $name: String!
    $appUserGroupId: Int!
    $statusId: Int
  ) {
    updateTag(
      data: {
        id: $id
        name: $name
        appUserGroupId: $appUserGroupId
        statusId: $statusId
      }
    ) {
      id
    }
  }
`;
export const DELETE_TAG = gql`
  mutation (
    $partyId: Int!
    $appUserGroupId: Int!
  ) {
    deleteTag(
        data: {
          partyId: $partyId,
          appUserGroupId: $appUserGroupId
        }
    ) {
      status
      message
    }
  }
`;
export const CREATE_TAGPARTY = gql`
  mutation (
    $partyId: Int!
    $tagId: Int!
  ) {
    createTagParty(
      data: {
        partyId: $partyId,
        tagId: $tagId,
      }
    ) {
      message
      status
    }
  }
`;

export const DELETE_TAGPARTY = gql`
  mutation (
    $id: Int!
    $appUserGroupId: Int!
  ) {
    deleteTagParty(
      id: $id,
      appUserGroupId: $appUserGroupId
    ) {
      status
    }
  }
`;
