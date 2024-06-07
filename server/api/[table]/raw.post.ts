import { PrismaClient } from '@prisma/client'
// import { users, InsertUser } from "@/db/schema";
import Database from 'better-sqlite3'

export default defineEventHandler(async (event) => {
  const db = new Database('prisma/db.sqlite')
  try {
    const prisma = new PrismaClient()
    const body = await readBody(event)

    console.log('1111111111>>>', body.sql)

    const result = db.prepare(body.sql.replace(/\s+/g, ' ').trim()).all()
    // const result = await prisma.$queryRaw`${body.sql}`
    // const usersResp = db.select().from(obj[event.context.params?.table]).all();
    console.log('1111result111111', result)
    return result
  }
  catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    })
  }
})
