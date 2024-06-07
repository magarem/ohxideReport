export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('cookie body:', body)
  setCookie(event, 'user', body)
})
