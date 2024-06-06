import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {

  const go = async () => {
      try {
      const prisma = new PrismaClient()
      const usersResp = await prisma[event.context.params?.table].findMany()
      // const usersResp = db.select().from(obj[event.context.params?.table]).all();
      return usersResp
    } catch (e: any) {
      throw createError({
        statusCode: 400,
        statusMessage: e.message,
      });
    }
  }
  // const isAuth = event.headers.get('authorization')
  // console.log('isAuth:', isAuth);
  
  // if (isAuth){
    console.log("!!!");
    return go()
  // }else{
  //   return "auth error"
  // }
  
});