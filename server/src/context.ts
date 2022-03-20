import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  user:{ //mock should be req.user
    id:number;
    name:string;
    roles: string[]
  }
  roles: string[],
  req:any //test
}

export const context = ({req}:any) => {
  console.log('reqHeaders:',req.headers);
  const context = {
                  prisma: prisma,
                  user: {
                    id: 1,
                    name: "Sample user",
                    roles: ["ANONYMOUS"],
                  },
                  roles: ['ADMIN','VISITOR','ANONYMOUS'],
                  req: req
                }
  
  return context};