export default defineNuxtRouteMiddleware(async (_to, from) => {
  console.log('admin-only middleware')
  //   const { status, data, signIn, signOut } = useAuth()
//   const { userAdmin } = useAuth()
//   if (!userAdmin.value) {
//     return navigateTo({ name: 'login' })
//   }
})
