type AppUserGroupRelationship = {
  appUserId: number;
  appUserGroupId: number;
  appUserRoleId: number;
};

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
   */
  id: string;
  nickname: string;
  email: string;
  appUserGroupRelationships: AppUserGroupRelationship[];
  currentAppUserGroupId: number;
  currentRole: string; //'ANONYMOUS', 'ADMIN' ...
};
