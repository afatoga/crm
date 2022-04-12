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

interface IUser extends Pick<AppUser, 'email'|'id'> {
  appUserGroupRelationships: IappUserGroupRelationship[];
}

export interface Context {
  prisma: PrismaClient
  currentUser?: IUser
  appRoles: string[],
  //req:any //test
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

  // development!
  userData = {
    id: 4,
    email: 'fakemail@gmail.com',
    appUserGroupRelationships: [
      {appUserGroupId: 2,
        appUserId: 4, //could be ommited
        appUserRoleId: 1}
    ]
  }

  return {
    prisma: prisma,
    currentUser: userData ? userData : undefined,
    appRoles: ['ANONYMOUS', 'ADMIN', 'MOD', 'MEMBER'], //retrieve like ctx.roles[ctx.currentUser.appUserRoleId]
    //req,
    res //to send cookies
  }

}