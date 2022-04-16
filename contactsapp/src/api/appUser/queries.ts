import { gql } from '@apollo/client';

export const LOGIN = gql`
query(
        $email: String!,
        $password: String!
    ) {
  login(data: { email: $email, password: $password }) {
    id
    appUserGroupRelationships {
      appUserGroupId
      appUserId
      appUserRoleId
    }
  }
}
`;