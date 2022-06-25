import { gql } from "@apollo/client";

export const GET_STATUS_LIST = gql`
  query {
    statusList {
      id
      name
    }
  }
`;