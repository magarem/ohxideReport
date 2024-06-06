import { PrismaClient } from '@prisma/client'
export default defineEventHandler(async (event) => {
  try {
    // const obj = { users, clients }
    // const { users } = await import("../../../db/schema");
    // get id as function parameter from route params
    const userId = event.context.params?.id as string;
    console.log('----', userId);
    
    const prisma = new PrismaClient()
    const usersResp = await prisma[event.context.params?.table].findUnique({
      where: {
        id: +userId,
      },
    })
    return usersResp;
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});