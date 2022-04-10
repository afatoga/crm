import { AuthChecker } from "type-graphql";

import { Context } from "./context";

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
    if (currentUser.appUserGroupRelationships[i].appUserGroupId === args.data.appUserGroupId) {
      if (roles.includes(appRoles[currentUser.appUserGroupRelationships[i].appUserRoleId])) return true;
      break;
    }
  }

  // no roles matched, restrict access
  return false;
};