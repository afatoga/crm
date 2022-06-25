import { gql } from "@apollo/client";

export const GET_SEARCH_RESULTS = gql`
  query ($searchedText: String!, $appUserGroupId: Int!) {
    searchResults(data: {
      searchedText: $searchedText,
      appUserGroupId: $appUserGroupId
    }) {
     status
     count
     results {
      #id
      entity
      entityId
      searchedValue
      contactPartyId
      contactPartyTypeId
     }
    }
  }
`;