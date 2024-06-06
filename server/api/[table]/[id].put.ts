import { PrismaClient } from '@prisma/client'
export default defineEventHandler(async (event) => {
  try {
    const prisma = new PrismaClient()
    const tableId = event.context.params?.id as string;
    const body = await readBody(event);
    console.log('body:', body);
    
    const editRecord: any = {
      ...body
    }
    const tableResp = await prisma[event.context.params?.table].update({
      where: {
        id: event.context.params?.id,
      },
      data: {
        ...body
      },
    })
   
    return tableResp;
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});