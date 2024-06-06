// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@bg-dev/nuxt-naiveui',
    '@sidebase/nuxt-auth',
    'nuxt-primevue',
  ],
  // pages: false,
  // build: {
  //   transpile: [
  //     'trpc-nuxt'
  //   ]
  // },
  typescript: {
    shim: false
  },
  css: ['primevue/resources/themes/aura-dark-green/theme.css']

})
