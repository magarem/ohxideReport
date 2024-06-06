<script setup>
import { useStorage } from '@vueuse/core'
import { crud } from '../composable/crud.ts'

definePageMeta({
  layout: 'defaultadmin'
})

const { status, data, signIn, signOut } = useAuth()

// persist state in localStorage
const dataUser = useStorage('user')
// console.log('store', store.value)

const crud_clients = crud('clients')

const retorno = ref()
const visible = ref(false)
const isDesabled = ref(false)

const clients = ref(await crud_clients.read())

const toast = useToast()
// const ret = ref({x: 100{})
const selectedEmailsOptions = ref()
const emailsOptions = ref([])

const config_report = ref({
  meta: {
    id: 'config_report',
    name: 'Relatório - marca d\'agua',
    table: 'config'
  },
  schema: {
    x: { name: 'Posição x', type: 'text' },
    y: { name: 'Posição y', type: 'text' },
    size: { name: 'Tamanho', type: 'text' },
    color: { name: 'Cor', type: 'text', help: 'Ex: #0000FF' },
    rotate: { name: 'Rotação', type: 'text', help: '0% - 100%' },
    opacity: { name: 'Densidade', type: 'text' }
  },
  bkpData: {
    x: '',
    y: '',
    size: '',
    rotate: '',
    txt: ''
  },
  data: {
    x: 100,
    y: '',
    size: '',
    rotate: '',
    txt: ''
  }
})

const config_emailsend = ref({
  meta: {
    id: 'config_emailsend',
    name: 'Envio de mensagem - dados do email',
    table: 'config'
  },
  schema: {
    subject: { name: 'Assunto', type: 'text' },
    body: { name: 'Texto', type: 'textarea' },
    linkTxt: { name: 'Texto do link', type: 'text' },
  },
  bkpData: {
    subject: '',
    body: '',
    linkTxt: ''
  },
  data: {
    subject: '',
    body: '',
    linkTxt: ''
  }
})

const emailSubject = computed(() => {
  if (selectedEmailsOptions.value?.data) {
    return JSON.parse(selectedEmailsOptions.value?.data).subject
  }
})

const emailBody = computed(() => {
  if (selectedEmailsOptions.value?.data) {
    return JSON.parse(selectedEmailsOptions.value?.data).body
  }
})

async function load(id) {
  emailsOptions.value = await crud('config').read('tipo=email')

  console.log('emailsOptions.value:', emailsOptions.value)

  const ret = await crud(eval(id).value.meta.table).read(`id=${eval(id).value.meta.id}`)
  console.log('ret:', ret)
  //   const ret = await db.get(
  //     `
  //     select * from ${eval(id).value.meta.table}
  //     where id LIKE '${eval(id).value.meta.id}'
  //     `
  //   )
  //   console.log('ret>>>', `
  //     select * from ${eval(id).value.meta.table}
  //     where id LIKE '${eval(id).value.meta.id}'
  //     `)
  eval(id).value.bkpData = JSON.parse(ret.data)
  eval(id).value.data = JSON.parse(ret.data)
}

function reset(id) {
  console.log('id:', id)
  eval(id).value.data = { ...eval(id).value.bkpData }
}

async function save(id) {
  console.log('id:', id)
  const ret = await db.update({
    table: eval(id).value.meta.table,
    data: {
      // id: eval(id).value.meta.id,
      data: JSON.stringify(eval(id).value.data)
    },
    where: `id LIKE '${eval(id).value.meta.id}'`
  })
  toast.add({ severity: 'secondary', summary: 'Configuração', detail: 'Arquivo salvo com sucesso!', life: 3000 })
}

onMounted(() => {
  console.log('-----')
  load('config_report')
  load('config_emailsend')
})
</script>

<template>
  <h3>Configurações</h3>
  <Toast />
  <ConfirmDialog />
  <Accordion :active-index="0" expand-icon="pi pi-plus" collapse-icon="pi pi-minus">
    <AccordionTab>
      <template #header>
        <span class="flex align-items-center gap-2 w-full">
          <!-- <Avatar shape="circle" ><i class="pi file-o" style="font-size: 3em"></i></Avatar> -->
          <span class="font-bold white-space-nowrap" style="font-size: 20px;">{{ config_report.meta.name }}</span>
          <!-- <Badge value="3" class="ml-auto mr-2" /> -->
        </span>
      </template>
      <Card style="width: 100%; overflow: hidden" class="mt-0">
        <template #content>
          <!-- <h3>{{ config_report.meta.name }}</h3> -->
          <div class="formgrid grid">
            <!-- {{ config_report.data }} -->
            <table style="width: 100%;">
              <tr v-for="item in Object.entries(config_report.schema)" :key="item[0]" style="width: 100%;" _class="field col-12">
                <td style="width: 20%; text-align: right; padding-right: 10px;">
                  <label style="font-size: 17px; font-weight:350;" :for="item[1].name">{{ item[1].name }}</label>
                </td>
                <td style="width: 30%;">
                  <input v-if="item[1].type == 'text'" :id="item[1].name" v-model="config_report.data[item[0]]" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full">
                  <div v-if="item[1].type == 'textarea'">
                    <Textarea v-model="config_report.data[item[0]]" rows="5" style="width: 100%" />
                  </div>
                </td>
                <td style="width: 50%;">
                  <span style="padding-left:10px; font-style: italic;">{{ item[1].help }}</span>
                </td>
              </tr>
              <tr>
                <td />
                <td colspan="2" class="pt-3">
                  <Button class="mr-2" style="width: 200px;" :disabled="isDesabled" label="Salvar" _class="w-50" @click="save('config_report')" />
                  <Button style="width: 200px;" label="Cancel" severity="secondary" outlined _class="w-50" @click="reset('config_report')" />
                </td>
              </tr>
            </table>
          </div>
        </template>
      </Card>
    </AccordionTab>

    <AccordionTab>
      <template #header>
        <span class="flex align-items-center gap-2 w-full">
          <!-- <Avatar shape="circle" ><i class="pi file-o" style="font-size: 3em"></i></Avatar> -->
          <span class="font-bold white-space-nowrap" style="font-size: 20px;">{{ config_emailsend.meta.name }}</span>
          <!-- <Badge value="3" class="ml-auto mr-2" /> -->
        </span>
      </template>
      <Card style="width: 100%; overflow: hidden" class="mt-0">
        <template #content>
          <!-- <h3>{{ config_emailsend.meta.name }}</h3> -->
          <div class="formgrid grid">
            <table style="width: 100%;">
              <!-- <tr>
                                <td style="width: 20%; text-align: right; padding-right: 10px;">Tipo</td>
                                <td>
                                    <div _class="card flex justify-content-center">
                                        <Listbox v-model="selectedEmailsOptions" :options="emailsOptions" optionLabel="id" class="w-full md:w-14rem" />
                                    </div>
                                </td>
                            </tr>
                            <tr><td></td>
                                <td style="width: 20%; padding-right: 10px;">
                                    <Button class="mr-2" style="width: 200px;" @click="newEmail" :disabled="isDesabled" label="Novo" _class="w-50" />
                                </td>
                            </tr> -->
              <!-- <tr style="width: 100%;" _class="field col-12" >
                                <td style="width: 20%; text-align: right; padding-right: 10px;">
                                    <label style="font-size: 17px; font-weight:350;" for="emailSubject">Assunto</label>
                                </td>
                                <td style="width: 30%;">
                                    <input id="emailSubject" v-model="emailSubject" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full">
                                </td>

                                <td style="width: 50%;">
                                <span style="padding-left:10px; font-style: italic;">{{ item[1].help }}</span>
                                </td>
                            </tr> -->

              <tr v-for="item in Object.entries(config_emailsend.schema)" :key="item[0]" style="width: 100%;" _class="field col-12">
                <td style="width: 20%; text-align: right; padding-right: 10px;">
                  <label style="font-size: 17px; font-weight:350;" :for="item[1].name">{{ item[1].name }}</label>
                </td>
                <td style="width: 30%;">
                  <input v-if="item[1].type == 'text'" :id="item[1].name" v-model="config_emailsend.data[item[0]]" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full">
                  <div v-if="item[1].type == 'textarea'">
                    <Textarea v-model="config_emailsend.data[item[0]]" rows="5" style="width: 100%" />
                  </div>
                </td>
                <!-- <td style="width: 50%;">
                                    <Button style="width: 200px;" @click="reset('config_emailsend')" label="Cancel" severity="secondary" outlined _class="w-50" />

                                </td> -->
                <td style="width: 50%;">
                  <span style="padding-left:10px; font-style: italic;">{{ item[1].help }}</span>
                </td>
              </tr>
              <tr>
                <td />
                <td colspan="2" class="pt-3">
                  <Button class="mr-2" style="width: 200px;" :disabled="isDesabled" label="Salvar" _class="w-50" @click="save('config_emailsend')" />
                  <Button style="width: 200px;" label="Cancel" severity="secondary" outlined _class="w-50" @click="reset('config_emailsend')" />
                </td>
              </tr>
            </table>
          </div>
        </template>
      </Card>
    </AccordionTab>
  </Accordion>
</template>
