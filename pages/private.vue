<script lang="ts" setup>
import { useStorage } from '@vueuse/core'

const { status, data, signIn, signOut } = useAuth()

// persist state in localStorage
const store = useStorage('user')

console.log('store', store.value)
</script>

<template>
  <div>Private</div>
  <div>
    This page is only visible for user who logged in current user:
    {{ status }}<br>
    {{ store }}
  </div>
  <button @click="signOut">
    Log out
  </button>
  <button @click="signIn">
    signIn
  </button>
</template>
