import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  try {
    const prisma = new PrismaClient()
    const body = await readBody(event)
    console.log(body)
    const result = await prisma[event.context.params?.table].deleteMany({
      where: {
        ...body
      }
    })
    console.log(result)
    return result
  }
  catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    })
  }
})
