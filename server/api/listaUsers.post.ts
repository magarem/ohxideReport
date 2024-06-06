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
  const query = await getQuery(event)
  console.log('query:', query)
  const runtimeConfig = useRuntimeConfig()

  // if (query.API_ROUTE_SECRET !== runtimeConfig.API_ROUTE_SECRET) {
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: 'You are not authorized to call this API.',
  //   })
  // }

  // const authHeaderValue = getRequestHeaders(event, 'authorization')
  // console.log('authHeaderValue.cookie:', authHeaderValue.cookie?.split('next-auth.session-token=')[1])

  // if (typeof authHeaderValue === 'undefined') {
  //   throw createError({ statusCode: 403, statusMessage: 'Need to pass valid Bearer-authorization header to access this endpoint' })
  // }

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
      console.log('username:', body.username)

      const prisma = new PrismaClient()
      const usersResp = await prisma.users.findFirst({
        where: {
          ...body
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
  }
  else {
    throw createError({ statusCode: 403, statusMessage: 'Need to pass valid Bearer-authorization header to access this endpoint' })
  }
})
