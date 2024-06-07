/**
 * Fetch all `examples` from the database. Run `npx prisma db push` at least once for this to work.
 *
 * If you are using `tRPC` you can access the prisma-client by adding it to the context:
 * ```ts
 * export async function createContext(event: H3Event) {
 *   return { prisma: event.context.prisma }
 * }
 *
 * export type Context = inferAsyncReturnType<typeof createContext>
 * ```
 */
// import { getServerSession } from '#auth'

// export default defineEventHandler(async (event) => {
//   const session = await getServerSession(event)
//   console.log('session:', session)

//   return session
//   // event.context.prisma.example.findMany()
// })
import { PrismaClient } from '@prisma/client'
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
  // const query = await getQuery(event)
  const token = await getToken({ event })
  console.log('token:', token)
  // const query = await getQuery(event)
  // console.log('query:', query)
  const runtimeConfig = useRuntimeConfig()

  if (true) {
    try {
    // const obj = { users, clients }
    // const { users } = await import("../../../db/schema");
    // get id as function parameter from route params
    // const username_ = event.context.params?.username as string
    // const password_ = event.context.params?.password as string
    // console.log('----', userId);
      console.log('event.context.test', event.context.test)
      const body = await readBody(event)
      console.log('body.email:', body.email)

      const prisma = new PrismaClient()
      const usersResp = await prisma[body.type].findFirst({
        where: {
          email: body.email,
          password: body.password
        },
      })
      console.log('usersResp_loginUserCheck', usersResp)

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
    throw createError({ statusCode: 403, statusMessage: 'Need to pass valid Bearer-authorization header to access this endpoint' })
  }
})
