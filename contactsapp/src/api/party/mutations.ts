import { gql } from "@apollo/client";

export const CREATE_PERSON = gql`
  mutation (
    $name: String!
    $surname: String!
    $preDegree: String
    $postDegree: String
    $birthday: DateTime
    $appUserGroupId: Int!
    $statusId: Int
  ) {
    createPerson(
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
export const UPDATE_PERSON = gql`
  mutation (
    $partyId: Int!
    $name: String!
    $surname: String!
    $preDegree: String
    $postDegree: String
    $birthday: DateTime
    $appUserGroupId: Int!
    $statusId: Int
  ) {
    updatePerson(
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
export const DELETE_PERSON = gql`
  mutation (
    $partyId: Int!
    $appUserGroupId: Int!
  ) {
    deletePerson(
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
export const CREATE_PARTYRELATIONSHIP = gql`
  mutation (
    $firstPartyId: Int!
    $secondPartyId: Int!
    $typeId: Int
  ) {
    createPartyRelationship(
      data: {
        firstPartyId: $firstPartyId,
        secondPartyId: $secondPartyId,
        typeId: $typeId
      }
    ) {
      id
      typeId
      firstPartyId
      secondPartyId
    }
  }
`;

export const DELETE_PARTYRELATIONSHIP = gql`
  mutation (
    $id: Int!
    $appUserGroupId: Int!
  ) {
    deletePartyRelationship(
      id: $id,
      appUserGroupId: $appUserGroupId
    ) {
      status
    }
  }
`;
