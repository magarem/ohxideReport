import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare module 'h3' {
  interface H3EventContext {
    prisma: PrismaClient
  }
}

export default eventHandler((event) => {
  console.log('-----!-----')

  if (!prisma) {
    prisma = new PrismaClient()
  }
  event.context.test = 'fidelanti!!'
  event.context.prisma = prisma
})
