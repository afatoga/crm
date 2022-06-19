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
      data: {
        appUserGroupId: $appUserGroupId
        statusId: $statusId
        searchedName: $searchedName
      }
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

export const GET_SINGLE_PARTY_TAGS = gql`
  query ($partyId: Int!, $appUserGroupId: Int!) {
    singlePartyTags(
      data: { partyId: $partyId, appUserGroupId: $appUserGroupId }
    ) {
      id
      name
    }
  }
`;

export const GET_TAGGED_PARTIES = gql`
  query ($tagId: Int!, $appUserGroupId: Int!) {
    taggedParties(data: { tagId: $tagId, appUserGroupId: $appUserGroupId }) {
      personFullName
      organizationName
      typeId
      partyId
    }
  }
`;
