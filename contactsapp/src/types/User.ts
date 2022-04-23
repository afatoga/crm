type AppUserGroupRelationship = {
  appUserId: number;
  appUserGroupId: number;
  appUserRoleId: number;
}

// export type AnonymousUser {
//   currentRole: string;
// }


/**
 * Represents a user.
 */
export type User = {
  /**
   * The user's unique identifier
   * @type {string}
   * @memberof User
   * @property id
   * @required
   * @example
   * "5e8d8hg8h8h8q8faf8g8f8f"
   */
  id: string;
  nickname: string;
  email: string;
  appUserGroupRelationships: AppUserGroupRelationship[]
  currentAppUserGroupId: number;
  currentRole: string; //'ANONYMOUS', 'ADMIN' ...


  // /**
  //  * The user's role
  //  * @type {boolean}
  //  * @memberof User
  //  * @property isAdmin
  //  * @required
  //  * @example
  //  * true
  //  * @default
  //  * false
  //  */
  // isAdmin: boolean;

  // /**
  //  * The user's verification status
  //  * @type {boolean}
  //  * @memberof User
  //  * @property isVerified
  //  * @required
  //  * @example
  //  * true
  //  * @default
  //  * false
  //  */
  // isVerified: boolean;
};
