<script setup>
import { crud } from '../composable/crud.ts'

definePageMeta({
  layout: 'defaultadmin'
})

const schema = {
  table: 'users',
  title: 'Usuários',
  desc: 'Gerenciamento de usuários',
  schema: {
    id: {
      label: 'ID',
      type: 'INTEGER',
      extra: 'PRIMARY KEY'
    },
    name: {
      label: 'Nome completo',
      type: 'STRING',
      extra: 'NOT NULL'
    },
    email: {
      label: 'E-mail',
      type: 'STRING',
      extra: 'NOT NULL'
    },
    username: {
      label: 'Nome de usuário',
      type: 'STRING',
      extra: 'NOT NULL'
    },
    password: {
      label: 'Senha',
      type: 'STRING',
      extra: 'NOT NULL'
    },
    role: {
      label: 'Credênciais',
      type: 'STRING',
      extra: 'NOT NULL'
    },
    status: {
      label: 'Status',
      type: 'STRING',
      extra: 'NOT NULL'
    }
  }
}

const myCrud = crud('users')
const data = await myCrud.read()
console.log('data22:', data)
</script>

<template>
  <Magacrud
    :schema="schema"
    :data="data"
    @create="myCrud.create"
    @update="myCrud.update"
    @del="myCrud.del"
  />
</template>
