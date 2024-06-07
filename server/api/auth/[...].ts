import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
  // TODO: SET A STRONG SECRET, SEE https://sidebase.io/nuxt-auth/configuration/nuxt-auth-handler#secret
  secret: process.env.AUTH_SECRET,
  // TODO: ADD YOUR OWN AUTHENTICATION PROVIDER HERE, READ THE DOCS FOR MORE: https://sidebase.io/nuxt-auth
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    // GithubProvider.default({
    //   clientId: process.env.GITHUB_CLIENT_ID || 'enter-your-client-id-here',
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET || 'enter-your-client-secret-here', // TODO: Replace this with an env var like "process.env.GITHUB_CLIENT_SECRET". The secret should never end up in your github repository
    // }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: '(hint: jsmith)' },
        password: { label: 'Password', type: 'password', placeholder: '(hint: hunter2)' },
      },
      async authorize(credentials: any) {
        // console.warn('ATTENTION: You should replace this with your real providers or credential provider logic! The current setup is not safe')
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!

        // const user = { id: '1', name: 'Fidelagem', email: 'teste@teste.com', username: 'fidelis', password: '12345', role: 'admin' }
        console.log('--!!--')
        const user = await $fetch('/api/loginUserCheck', {
          method: 'POST',
          body: {
            type: credentials?.type,
            email: credentials?.email,
            password: credentials?.password
          },
        })

        console.log('user:', user)

        // if (credentials?.username === user.username && credentials?.password === user.password) {
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          // const ret = await $fetch('/api/cookieAdmin', {
          //   method: 'POST',
          //   body: {
          //     user
          //   },
          // })
          return user
        }
        else {
          console.error('Warning: Malicious login attempt registered, bad credentials provided')

          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  callbacks_: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('signIn callback', user)
      if (user) {
        return null
      }
      else {
        return null
      }
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token
    }
  }
})
