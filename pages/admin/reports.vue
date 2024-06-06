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

const schema = {
  table: 'reports',
  title: 'Relatórios',
  desc: 'Gerenciamento de Relatórios',
  schema: {
    id: {
      label: 'ID',
      type: 'STRING',
      extra: 'PRIMARY KEY',
      null: false
    },
    year: {
      label: 'Ano',
      type: 'STRING',
      null: false
    },
    month: {
      label: 'Mês',
      type: 'STRING',
      null: false
    },
    name: {
      label: 'Nome',
      type: 'STRING',
      null: false
    },
    desc: {
      label: 'Descrição',
      type: 'STRING',
      null: true
    },
    file: {
      label: 'Arquivo',
      type: 'UPLOAD',
      null: true
    },
    tag: {
      label: 'Etiqueta',
      type: 'SELECT',
      null: false,
      placeholder: 'Selecione',
      options: Array_tags
    }
  }
}

const myCrud = crud('reports')
const data = await myCrud.read()
</script>

<template>
  <Magacrud
    reorder="true"
    :schema="schema"
    :data="data"
    @create="myCrud.create"
    @update="myCrud.update"
    @del="myCrud.del"
  />
</template>
