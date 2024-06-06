import { PrismaClient } from '@prisma/client'
// import { users, InsertUser } from "@/db/schema";


export default defineEventHandler(async (event) => {
  try {
    const prisma = new PrismaClient()
    const body = await readBody(event);
    const newReg: any = {
      ...body
    }
    // const result = db.insert(obj[event.context.params?.table]).values(newReg).run();
    const result = await prisma[event.context.params?.table].create({
      data: {
        ...body
      },
    })
    console.log(user)
    return result
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});