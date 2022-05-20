import { gql } from "@apollo/client";

export const CREATE_UPDATE_PERSON = gql`
  mutation (
    $partyId: Int
    $name: String!
    $surname: String!
    $preDegree: String
    $postDegree: String
    $birthday: DateTime
    $appUserGroupId: Int!
    $statusId: Int
  ) {
    createUpdatePerson(
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
