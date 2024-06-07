<template>
    <h3>Enviar emails</h3>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <div class="grid">
        <div class="col-12 lg:col-6" >
            <Card style="width: 100%; overflow: hidden" class="mt-0">
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
                            <textarea id="address" v-model="sendEmailForm.message" type="text" rows="4" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"></textarea>
                        </div>
                        <div class="field col-12">
                            <label for="lastname6">Texto do link</label>
                            <input id="lastname6" v-model="sendEmailForm.linktext" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full">
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="state">Clientes</label>
                            <MultiSelect v-model="sendEmailForm.clients" display="chip" :options="clients" optionLabel="name" optionValue="id" placeholder="Selecione os clientes"
                                :maxSelectedLabels="3" class="w-full md:w-28rem" />
                        </div>
                        <!-- <div class="field col-12 md:col-3">
                            <label for="zip">Zip</label>
                            <input id="zip" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full">
                        </div> -->
                    </div>
                </template>
                <template #footer>
                    <div class="flex gap-3 mt-1">
                        <!-- <Button @click="visible = false" label="Cancel" severity="secondary" outlined class="w-full" /> -->
                        <Button @click="sendMails" :disabled="!(sendEmailForm.clients.length)" label="Enviar" class="w-full" />
                    </div>
                </template>
            </Card>
        </div>
        <div class="col-12 lg:col-6" >
            <Card style="width: 100%; height: 100%; overflow: hidden" class="mt-0">
                <template #content>
                    <div class="formgrid grid">
                       
                        <div class="field col-12">
                            <label for="monitor">Operações</label>
                            <textarea id="monitor" disabled v-model="monitor" type="text" rows="4" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"  style="height: 350px; background-color: grey;"></textarea>
                        </div>
                      
                    </div>
                </template>
               
            </Card>
        </div>
    </div>
    
</template>
<script setup>
definePageMeta({
    layout: 'defaultadmin'
})
import { useAuthStore } from '~/store/auth';
import {db} from "~/data/db_cmds"
const router = useRouter();
const dataUser = useCookie('dataUser')
const { logUserOut } = useAuthStore();
const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
let retorno = ref()
const visible = ref(false);
const isDesabled = ref(false);
const monitor = ref("");
const clients = ref(await db.get("select * from clients"))
const toast = useToast();
const ret = await db.get("select * from config where id like 'config_emailsend'")
const emailSendData = JSON.parse(ret[0].data)
console.log('emailSendData:', emailSendData);

const sendEmailForm = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth()+1,
  subject: emailSendData.subject,
  message: emailSendData.body,
  linktext: emailSendData.linkTxt,
  clients: []
});

const sendMails = async () => {
  console.log("sendEmailForm.value:", sendEmailForm.value);
  monitor.value = "Processando...\n"
  if (sendEmailForm.value.clients.length>0){
    const ret = await $fetch('/api/sendemail', {
        method: 'POST',
        body: sendEmailForm.value
    });
    
        if (ret) {
            console.log('ret:', ret);
            // visible.value = false
            monitor.value += ret.join("\n") + '\nOperação finalizada.' 
            // toast.add({ severity: 'secondary', summary: 'E-mails', detail: ret.join(""), life: 3000 });
            // isDesabled.value=true
        }
  }
}

</script>