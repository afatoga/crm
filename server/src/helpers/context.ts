import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { AppUser } from "../types/AppUser";

const prisma = new PrismaClient();

// this object has to be in => PrismaClient()
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

// prisma.$on("query", e => {
//   console.log("Query: " + e.query);
//   console.log("Duration: " + e.duration + "ms");
// });

interface IappUserGroupRelationship {
  appUserId: number;
  appUserGroupId: number;
  appUserRoleId: number;
}

export interface ICurrentUser extends Pick<AppUser, "email" | "id"> {
  appUserGroupRelationships: IappUserGroupRelationship[];
  currentAppUserGroupId: number;
}

export interface Context {
  prisma: PrismaClient;
  currentUser?: ICurrentUser;
  appRoles: string[];
  //req:any
  res: any;
}

const parseCookie = (str: string) =>
  str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc: any, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

export const context = async ({ req, res }: { req: any; res: Response }): Promise<Context> => {
  //const cookies = (req.headers?.cookie) && parseCookie(req.headers.cookie);
  const authHeader = req.headers?.authorization;
  const accessSecret = process.env.ACCESS_TOKEN_SECRET
    ? process.env.ACCESS_TOKEN_SECRET
    : "";

  // const accessToken = cookies && cookies['access-token'];
  if (authHeader && !authHeader.startsWith("Bearer ")) throw new Error("Invalid token");

  const accessToken = authHeader && authHeader.substring(7, authHeader.length);
  // To be implemented: refresh token has to be in request body

  let userData;
  if (accessToken) {
    try {
      userData = verify(accessToken, accessSecret) as ICurrentUser; //any;
      //(req as any).userId = data.userId;
    } catch {
      throw new Error("Authorization is invalid");
    }
  }

  //const appUserGroupId = cookies && cookies['current-group-id'];

  // local development!
  // userData = {
  //   id: 1,
  //   email: "fakemail@gmail.com",
  //   currentAppUserGroupId: 1, // application sets this setting on login
  //   appUserGroupRelationships: [
  //     {
  //       appUserGroupId: 1,
  //       appUserId: 4, //could be ommited
  //       appUserRoleId: 1,
  //     },
  //   ],
  // };

  if (authHeader && !userData) throw new Error("Invalid token");
  
  if (authHeader && userData) {
    const appUserGroupRelationships = await prisma.appUserGroupRelationship.findMany({ where: { appUserId: userData.id } })
    userData = {...userData, appUserGroupRelationships}; //ensure object is up to date
  }

  return {
    prisma: prisma,
    currentUser: userData ? userData : undefined,
    appRoles: ["ANONYMOUS", "ADMIN", "MOD", "MEMBER"], //retrieve like ctx.roles[ctx.currentUser.appUserRoleId]
    //req,
    res, //to send cookies
  };
};
