import { PrismaClient } from '@prisma/client'
import { verify } from "jsonwebtoken"

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

export interface Context {
  prisma: PrismaClient
  user: { 
    id: number | null;
    email: string | null;
    roles: string[];
    appUserGroupId: number | null;
  }
  roles: string[],
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

  return {
    prisma: prisma,
    user: {
      id: userData ? userData.id : null,
      email: userData ? userData.email : null,
      appUserGroupId: userData ? userData.appUserGroupId : null,
      roles: accessToken ? ['USER'] : ["ANONYMOUS"]
    },
    roles: ['ADMIN', 'USER', 'ANONYMOUS'],
    //req,
    res //to send cookies
  }

}