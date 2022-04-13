import { AuthChecker } from "type-graphql";

import { Context, ICurrentUser } from "./context";

// create auth checker function
//({ args, context: { currentUser} }, roles)
export const authChecker: AuthChecker<Context> = ({ args, context: { currentUser, appRoles} }, roles) => {
 
  if (roles.length === 0) {
    // if `@Authorized()`, check only if currentUser exists
    return currentUser !== undefined;
  }
  // there are some roles defined now

  if (!currentUser) {
    // and if no user, restrict access
    return false;
  }

  // if (args.data.appUserGroupId !== user.appUserGroupId) return false;
  for (let i = 0; i<currentUser.appUserGroupRelationships.length; i++) {
    if (currentUser.appUserGroupRelationships[i].appUserGroupId === currentUser.currentAppUserGroupId) {
      if (roles.includes(appRoles[currentUser.appUserGroupRelationships[i].appUserRoleId])) return true;
      break;
    }
  }

  // no roles matched, restrict access
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
      appRoles[appUserGroups[i].appUserRoleId] === "ADMIN"
    ) {
      // user has admin role in the target group
      isAuthorized = true;
      break;
    }
  }

  return isAuthorized ? true : false;
};