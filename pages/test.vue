<script setup lang="ts">
import { useLocalStorage, useMouse, usePreferredDark } from '@vueuse/core'

// persist state in localStorage
const store = useLocalStorage('my-storage')

console.log('store22:', JSON.parse(store.value).name)
</script>

<template>
  <h1 class="text-3xl font-bold">
    Welcome home.
  </h1>
</template>
