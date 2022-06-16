import { gql } from "@apollo/client";

export const CREATE_TAG = gql`
  mutation (
    $name: String!
    $surname: String!
    $preDegree: String
    $postDegree: String
    $birthday: DateTime
    $appUserGroupId: Int!
    $statusId: Int
  ) {
    createTag(
      data: {
        name: $name
        surname: $surname
        preDegree: $preDegree
        postDegree: $postDegree
        birthday: $birthday
        appUserGroupId: $appUserGroupId
        statusId: $statusId
      }
    ) {
      partyId
    }
  }
`;
export const UPDATE_TAG = gql`
  mutation (
    $partyId: Int!
    $name: String!
    $appUserGroupId: Int!
    $statusId: Int
  ) {
    updateTag(
      data: {
        partyId: $partyId
        name: $name
        surname: $surname
        preDegree: $preDegree
        postDegree: $postDegree
        birthday: $birthday
        appUserGroupId: $appUserGroupId
        statusId: $statusId
      }
    ) {
      partyId
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
