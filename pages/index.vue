<script setup>
import 'primeflex/primeflex.css'
import moment from 'moment'
import { crud } from '../composable/crud.ts'

const { status, signIn, signOut } = useAuth()
const dataUser = toRaw(useCookie('user'))
console.log('dataUser----------->>>>>;>>', dataUser.value)

const flag_mostra_link = ref(false)
const vai = ref(null)
const accessOk = ref(true)
const data2 = []
const tableFilter = ref({
  year: null,
  month: null
})

onBeforeMount(() => {
  // if (!dataUser.value || dataUser.value.type !== 'clients') {
  //   signOut()
  //   router.push('/login')
  // }

  if (status) {
    console.log('data limite:', dataUser.value.data_limite)
    const dia = dataUser.value.data_limite.split('/')[0]
    const mes = dataUser.value.data_limite.split('/')[1]
    const ano = dataUser.value.data_limite.split('/')[2]

    if (dataUser.value.status === 'ativo') {
      const date_limit = moment(`${ano}-${mes}-${dia}`)
      const now = moment()

      if (now > date_limit) {
        accessOk.value = false
      }
      else {
        accessOk.value = true
      }
    }
  }
  if (!authenticated.value) {
    router.push('/login')
  }
})

const sql = `
  select 
      COUNT(reports.id), reports.year, reports.month, 
      GROUP_CONCAT(reports.name) as nome, 
      GROUP_CONCAT(reports.file) as files, 
      GROUP_CONCAT(tags.name) as tags 
  from 
      reports, tags, clients 
  where 
      reports.tag = tags.id AND 
      instr(clients.tags, reports.tag) > 0 AND
      clients.id like '${dataUser.value.id}'
  GROUP BY 
      reports.year, reports.month 
  order by 
      year DESC, month DESC 
`

// const myCrud = crud('raw')
// const data = await myCrud.raw(sql)
const data = await $fetch(`/api/raw/raw`, {
  method: 'POST',
  body: JSON.stringify({ sql })
})
// const data = await $fetch(`/api/dbservices?sql=${sql.replace(/\s+/g, ' ').trim()}`)
console.log('ret data raw', data)

async function merge(xx) {
  const { data: responseData } = await useFetch(`/api/myproxy`, {
    method: 'post',
    body: {
      year: xx.year,
      month: xx.month,
      client: dataUser.value,
      files: xx.files.split(',').map(x => `/home/maga/dev/ohxideReport/upload/${x}`).join(',')
    }
  })

  console.log('responseData.value//////////>', responseData.value)
  if (responseData.value) {
    flag_mostra_link.value = true
    await navigateTo(`file/${responseData.value}`, {
      open: {
        target: '_blank'
      }
    })
  }
  console.log('ret data:', data)
}

const aaa = computed(() => {
  return data.filter(x => x.year == (tableFilter.value.year || x.year) & x.month == (tableFilter.value.month || x.month))
})
</script>

<template>
  <div v-if="dataUser" class="m-0" style="display: grid; place-items: center;">
    <div v-if="accessOk">
      <Card class="mt-5" style="width: 100%;">
        <template #content>
          <h3>Relatórios</h3>
          <DataTable :value="aaa" table-style="width: 100%;" class="mb-4">
            <template #header>
              <div class="mb-3">
                Buscar:
                <!-- <label for="n'ame">Ano</label> -->
                <InputText id="tableFilter" v-model="tableFilter.year" autofocus placeholder="Ano" style="width: 100px;" class="mx-1" />
                <!-- <label for="name">Mês</label> -->
                <InputText id="tableFilter" v-model="tableFilter.month" autofocus placeholder="Mês" style="width: 100px;" class="mx-1" />
                <!-- <Button label="Ok" @click="tableFilter.do" style="width: 100px;" class="mx-1"/> -->
                <!-- <Button label="X"  _style="width: 100px;" class="mx-1"/> -->
                <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel" @click="tableFilter = {}" />
              </div>
            </template>
            <Column field="year" header="Ano" />
            <Column field="month" header="Mês" />
            <Column header-style="min-width:10rem;" header="Baixar">
              <template #body="slotProps">
                <Button ref="vai" severity="secondary" type="button" label="Baixar" @click="merge(slotProps.data)" />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
    <div v-else _class="m-5">
      <h2>Acesso suspenso<br> Entre em contato com o administrador</h2>
    </div>
  </div>
</template>
