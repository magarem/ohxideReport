import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const ret = await prisma.$queryRaw`select name, limite, date(substr(limite, 7, 4) || '-' || substr(limite, 4, 2) || '-' || substr(limite, 1, 2)) as vencimento from clients WHERE vencimento BETWEEN DATE('now') AND DATE('now', '+30 days') ORDER BY vencimento`
  console.log('ret:', ret)

  return ret
})
