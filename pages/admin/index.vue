<script setup>
definePageMeta({
  layout: 'defaultadmin'
})

const retorno = ref()
const visible = ref(false)
const data = await $fetch('/api/admin_proximos_vencimentos')
const clients = ref(data)
const toast = useToast()
const sendEmailForm = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  subject: 'Novo relatório disponível',
  message: 'Olá!\nSeu relatório está pronto no link abaixo.',
  linktext: 'Baixar relatório'
})
async function sendMails() {
  if (sendEmailForm.value.clients.length > 0) {
    const ret = await $fetch('/api/sendemail', {
      method: 'POST',
      body: JSON.stringify(sendEmailForm.value)
    })
    if (ret) {
      visible.value = false
      toast.add({ severity: 'secondary', summary: 'E-mails', detail: ret.join(', '), life: 3000 })
    }
  }
}
</script>

<template>
  <div class="p-5">
    <div _class="flex">
      <Toast />
      <ConfirmDialog />
      <h4>Seções</h4>
      <NuxtLink v-if="dataUser?.status == 'root'" class="block mt-4  mb-3 lg:mt-0  hover:text-white mr-4" to="/admin/users">
        Usuários
      </NuxtLink>
      <NuxtLink class="block mt-4  mb-3 lg:mt-0  hover:text-white mr-4" to="/admin/clients">
        Clientes
      </NuxtLink>
      <NuxtLink class="block mt-4  mb-3 lg:mt-0  hover:text-white mr-4" to="/admin/tags">
        Tags
      </NuxtLink>
      <NuxtLink class="block mt-4  mb-3 lg:mt-0  hover:text-white mr-4" to="/admin/reports">
        Relatórios
      </NuxtLink>
      <h4>Próximos vencimentos</h4>
      <DataTable :value="clients" striped-rows table-style="width: 100%" class="mb-4">
        <Column field="name" header="Nome" />
        <Column field="data_limite" header="Vencimento" />
        <!-- <Column field="vencimento" header="Vencimento"></Column> -->
      </DataTable>
      {{ retorno }}
    </div>
  </div>

  <Dialog v-model:visible="visible" header="Envio de mensagens" :style="{ width: '35rem' }">
    <Card style="width: 31rem; overflow: hidden" class="mt-0">
      <template #content>
        <div class="formgrid grid">
          <div class="field col-12 md:col-3">
            <label for="firstname6">Ano</label>
            <input id="firstname6" v-model="sendEmailForm.year" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full">
          </div>
          <div class="field col-12 md:col-3">
            <label for="lastname6">Mês</label>
            <input id="lastname6" v-model="sendEmailForm.month" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full">
          </div>
          <div class="field col-12 md:col-6">
            <label for="lastname6">Assunto</label>
            <input id="lastname6" v-model="sendEmailForm.subject" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full">
          </div>
          <div class="field col-12">
            <label for="address">Mensagem</label>
            <textarea id="address" v-model="sendEmailForm.message" type="text" rows="4" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
          </div>
          <div class="field col-12">
            <label for="lastname6">Texto do link</label>
            <input id="lastname6" v-model="sendEmailForm.linktext" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full">
          </div>
          <div class="field col-12 md:col-3">
            <label for="state">Clientes</label>
            <MultiSelect
              v-model="sendEmailForm.clients" display="chip" :options="clients" option-label="name" option-value="id" placeholder="Selecione os clientes"
              :max-selected-labels="3" class="w-full md:w-28rem"
            />
          </div>
          <!-- <div class="field col-12 md:col-3">
                <label for="zip">Zip</label>
                <input id="zip" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full">
            </div> -->
        </div>
      </template>
      <template #footer>
        <div class="flex gap-3 mt-1">
          <Button label="Cancel" severity="secondary" outlined class="w-full" @click="visible = false" />
          <Button label="Enviar" class="w-full" @click="sendMails" />
        </div>
      </template>
    </Card>
  </Dialog>
</template>
