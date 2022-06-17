import { gql } from "@apollo/client";

// export const GET_ALL_TAGS = gql`
//   query {
//     allTags {
//       partyId
//       name
//       surname
//     }
//   }
// `;
export const GET_TAGS = gql`
  query ($appUserGroupId: Int!, $statusId: Int) {
    tagsByAppUserGroup(
      data: { appUserGroupId: $appUserGroupId, statusId: $statusId }
    ) {
      id
      name
      statusName
    }
  }
`;

export const GET_TAGS_BY_NAME = gql`
  query ($searchedName: String!, $appUserGroupId: Int!, $statusId: Int) {
    tagsByName(
      data: { appUserGroupId: $appUserGroupId, statusId: $statusId, searchedName: $searchedName }
    ) {
      id
      name
    }
  }
`;
export const GET_TAG_BY_ID = gql`
  query ($appUserGroupId: Int!, $id: Int!) {
    tagById(data: { appUserGroupId: $appUserGroupId, id: $id }) {
      id
      name
      statusId
    }
  }
`;


export const GET_TAGPARTY = gql`
  query ($tagId: Int, $partyId: Int, $appUserGroupId: Int!) {
    getTaggedParties(partyId: $partyId, appUserGroupId: $appUserGroupId) {
      
        id
        partyId
        tagId
      
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
