import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  try {
    // const obj = { users, clients }
    // const { users } = await import("../../../db/schema");
    // get id as function parameter from route params
    const queryWhere = event.context.params?.id as string
    console.log('----', queryWhere)

    const prisma = new PrismaClient()
    const usersResp = await prisma[event.context.params?.table].findFirst({
      where: {
        queryWhere
      },
    })
    return usersResp
  }
  catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    })
  }
})
