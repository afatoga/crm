import { AuthChecker } from "type-graphql";

import { Context, ICurrentUser } from "./context";

export const authChecker: AuthChecker<Context> = (
  { args, context: { currentUser, appRoles } },
  roles
) => {
  if (roles.length === 0) {
    // if `@Authorized()`, check only if currentUser exists
    return currentUser !== undefined;
  }

  if (!currentUser) {
    return false;
  }

  for (let i = 0; i < currentUser.appUserGroupRelationships.length; i++) {
    if (
      roles.includes(
        appRoles[currentUser.appUserGroupRelationships[i].appUserRoleId]
      )
    )
      return true;
    break;
  }

  return false;
};

export const isUserAuthorized = (
  currentUser: ICurrentUser,
  targetGroupId: number,
  appRoles: string[]
): boolean => {
  let isAuthorized = false;
  let appUserGroups = currentUser.appUserGroupRelationships;

  for (let i = 0; i < appUserGroups.length; i++) {
    if (
      appUserGroups[i].appUserGroupId === targetGroupId &&
      (appRoles[appUserGroups[i].appUserRoleId] === "ADMIN" ||
        appRoles[appUserGroups[i].appUserRoleId] === "MOD")
    ) {
      // user has admin role in the target group
      isAuthorized = true;
      break;
    }
  }

  return isAuthorized ? true : false;
};
