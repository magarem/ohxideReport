import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log('query:', query)

  const go = async () => {
    const prisma = new PrismaClient()
    if (query) {
      console.log('!!!!!---!!!', query)
      let usersResp = null
      try {
        usersResp = await prisma[event.context.params?.table].findFirst({
          where: query
        })
        // const usersResp = db.select().from(obj[event.context.params?.table]).all();
        return usersResp
      }
      catch (e: any) {
        throw createError({
          statusCode: 400,
          statusMessage: e.message,
        })
      }
    }
    else {
      try {
        console.log('11111111111111111')

        usersResp = await prisma[event.context.params?.table].findMany()
        // const usersResp = db.select().from(obj[event.context.params?.table]).all();
        return usersResp
      }
      catch (e: any) {
        throw createError({
          statusCode: 400,
          statusMessage: e.message,
        })
      }
    }
  }
  // const isAuth = event.headers.get('authorization')
  // console.log('isAuth:', isAuth);

  // if (isAuth){
  console.log('!!!')
  return go()
  // }else{
  //   return "auth error"
  // }
})
