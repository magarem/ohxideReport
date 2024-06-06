<script setup>
import { crud } from '../composable/crud.ts'

definePageMeta({
  layout: 'defaultadmin'
})

const schema = {
  table: 'tags',
  title: 'Tags',
  desc: 'Gerenciamento de tags',
  schema: {
    id: {
      label: 'ID',
      type: 'STRING',
      extra: 'PRIMARY KEY'
    },
    name: {
      label: 'Nome',
      type: 'STRING',
      null: false
    },
    desc: {
      label: 'desc',
      type: 'STRING',
      null: true
    }
  }
}

const myCrud = crud('tags')
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
