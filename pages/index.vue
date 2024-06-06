<script setup>
import { useStorage } from '@vueuse/core'

// definePageMeta({
//   layout: 'defaultadmin',
// })

const { status, data, signIn, signOut } = useAuth()
console.log(status.value)
if (status.value !== 'authenticated') { navigateTo({ name: 'login' }) }
// watch(status, () => {
// //   console.log('tttt')
//   if (status !== 'authenticated') { return navigateTo({ name: '/' }) }
// //   console.log("::>>>", authUser.value)
// })

const { data: ret } = await useFetch('/api/listaUsers', {
  method: 'POST',
  body: {
    email: data.value.user.email
  },
})

const store = useStorage('user', ret.value)
</script>

<template>
  <h1>Hi! i am protected.</h1>
  {{ status }}
  <pre>
    [{{ ret }}]
  </pre>
</template>
