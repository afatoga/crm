import { PrismaClient } from '@prisma/client'
import { verify } from "jsonwebtoken"
import {AppUser} from './AppUser'

const prisma = new PrismaClient(
  // {
  //   log: [
  //     {
  //       emit: "event",
  //       level: "query",
  //     },
  //     "info",
  //     "warn",
  //     "error",
  //   ],
  // }
)

// prisma.$on("query", e => {
//   console.log("Query: " + e.query);
//   console.log("Duration: " + e.duration + "ms");
// });

interface IappUserGroupRelationship {
  appUserId: number;
  appUserGroupId: number;
  appUserRoleId: number;
}

export interface ICurrentUser extends Pick<AppUser, 'email'|'id'> {
  appUserGroupRelationships: IappUserGroupRelationship[];
  currentAppUserGroupId: number;
}

export interface Context {
  prisma: PrismaClient
  currentUser?: ICurrentUser
  appRoles: string[],
  //req:any
  res: any
}

const parseCookie = (str: string) =>
  str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc: any, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

export const context = ({ req, res }: {req:any, res:Response}): Context => {

  const cookies = (req.headers?.cookie) && parseCookie(req.headers.cookie);


  const access_secret = process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET : '';

  const accessToken = cookies && cookies['access-token'];
  let userData;
  if (accessToken) {
    try {
      userData = verify(accessToken, access_secret) as any;
      //(req as any).userId = data.userId;
    } catch {
      throw new Error('Authorization is invalid')
    }
  }

  const appUserGroupId = cookies && cookies['current-group-id'];

  // development!
  userData = {
    id: 4,
    email: 'fakemail@gmail.com', // could be ommitted
    appUserGroupRelationships: [
      {appUserGroupId: 1,
        appUserId: 4, //could be ommited
        appUserRoleId: 1}
    ]
  }

  userData = {...userData, currentAppUserGroupId: appUserGroupId ? appUserGroupId : userData.appUserGroupRelationships[0].appUserGroupId}

  return {
    prisma: prisma,
    currentUser: userData ? userData : undefined,
    appRoles: ['ANONYMOUS', 'ADMIN', 'MOD', 'MEMBER'], //retrieve like ctx.roles[ctx.currentUser.appUserRoleId]
    //req,
    res //to send cookies
  }

}