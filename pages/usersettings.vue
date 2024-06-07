<script setup>
import 'primeflex/primeflex.css'
import moment from 'moment'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { crud } from '../composable/crud.ts'

const confirm = useConfirm()
const toast = useToast()

function confirm1() {
  confirm.require({
    message: 'Confirma alteração de dados?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Cancela',
    acceptLabel: 'Sim',
    accept: () => {
      toast.add({ severity: 'info', summary: 'Confirmado', detail: 'Dados de usuário registrados com sucesso', life: 3000 })
      updateUserData()
    }
    //   ,
    // reject: () => {
    //     toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    // }
  })
}
const router = useRouter()
const dataUser = toRaw(useCookie('user'))
const flag_mostra_link = ref(false)
const user = ref({
  username: 'fidelitico',
  email: 'fidel@teste.com',
  password: '2323'
})
const vai = ref(null)
const accessOk = ref(true)
const data2 = []
const tableFilter = ref({
  year: null,
  month: null
})

console.log('authenticated.value:', authenticated.value)

async function updateUserData() {
  // alert(JSON.stringify(user.value, null, 2))

  const data2 = await $fetch('/api/dbservices', {
    method: 'PATCH',
    body: JSON.stringify({ table: 'clients', data: user.value, where: `id like '${dataUser.value.id}'` })
  })

  logUserOut()
  navigateTo('/login')
}

const sql = `
  select 
    *
  from 
    clients 
  where 
    id like '${dataUser.value.id}'
`

const data = await $fetch(`/api/dbservices?sql=${sql.replace(/\s+/g, ' ').trim()}`)

user.value = data[0]
console.log('data:', data)
</script>

<template>
  <Toast />
  <ConfirmDialog />
  <div v-if="dataUser" class="m-0" style="display: grid; place-items: center;">
    <div v-if="accessOk">
      <Card class="mt-5" style="width: 100%;">
        <template #content>
          <h3>Configurações do usuário</h3>

          <div class="flex flex-column gap-2 mb-5">
            <label for="username">Nome de usuário</label>
            <InputText id="username" v-model="user.username" aria-describedby="username-help" />
            <small id="username-help">Seu nome de identificação no sistema</small>
          </div>

          <div class="flex flex-column gap-2 mb-5">
            <label for="email">Email</label>
            <InputText id="email" v-model="user.email" aria-describedby="email-help" readonly="" />
            <small id="email-help">Para alterar entre em contato com o administrador do sistema</small>
          </div>

          <div class="flex flex-column gap-2 mb-5">
            <label for="password">Senha</label>
            <InputText id="password" v-model="user.password" aria-describedby="password-help" />
            <small id="password-help">Sua senha de acesso ao sistema</small>
          </div>

          <div class="flex flex-column gap-2 mb-5">
            <Button label="Atulizar dados" @click="confirm1" />
          </div>
        </template>
      </Card>
    </div>
    <div v-else _class="m-5">
      <h2>Acesso suspenso<br> Entre em contato com o administrador</h2>
    </div>
  </div>
</template>

<style scoped>
td {
  height: 35px;
}
.field_name {
  text-align: right;
  font-weight: bold;
}

.field_value {
  width: 200px;
  margin-left: 10px;
  text-align: left;
}
</style>
