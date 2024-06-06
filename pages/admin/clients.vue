<script setup>
import { crud } from '../composable/crud.ts'

definePageMeta({
  layout: 'defaultadmin'
})

const myCrud0 = crud('tags')
const tags = await myCrud0.read()
console.log('tags:', tags)
const Array_tags = []
tags.forEach((element) => {
  Array_tags.push({ name: element.name, id: element.id })
})
console.log('Array_tags:', Array_tags)

const schema = {
  table: 'clients',
  title: 'Clientes',
  desc: 'Gerenciamento de clientes',
  schema: {
    id: {
      label: 'ID',
      type: 'STRING',
      extra: 'PRIMARY KEY'
    },
    name: {
      label: 'Nome completo',
      type: 'STRING',
      null: false
    },
    email: {
      label: 'E-mail',
      type: 'STRING',
      null: true
    },
    username: {
      label: 'Nome de usuário',
      type: 'STRING',
      null: false
    },
    password: {
      label: 'Senha',
      type: 'STRING',
      null: false
    },
    status: {
      label: 'Status',
      type: 'STRING',
      null: true
    },
    tags: {
      label: 'Etiqueta',
      type: 'MULTISELECT',
      null: true,
      placeholder: 'Selecione',
      options: Array_tags
    }
  }
}

const myCrud = crud('clients')
const data = await myCrud.read()
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
