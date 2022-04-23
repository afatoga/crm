import { gql } from '@apollo/client';

export const LOGIN = gql`
query(
        $email: String!,
        $password: String!
    ) {
  login(data: { email: $email, password: $password }) {
    appUser {
      id
      email
      nickname
    appUserGroupRelationships {
      appUserGroupId
      appUserId
      appUserRoleId
    }
    }
    accessToken
    #refreshToken
  }
}
`;