<script setup>
import 'primeflex/primeflex.css'
import { crud } from '../composable/crud.ts'

const dataUser = toRaw(useCookie('user'))
console.log('dataUser----->:', dataUser.value.email)

const myCrud0 = crud('planos')
const sqlret = await myCrud0.read(`id=${dataUser.value.plano}`)
console.log('sqlret:', sqlret)
// const sqlret = await db.get(`select * from client_planos where id = ${dataUser.value.plano}`)

const userPlanoName = sqlret.name

const menu = ref()
const items_0 = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    link: '/'
  },
  {
    label: 'Configurações',
    icon: 'pi pi-file',
    command: () => {
      router.push('/usersettings')
    }

  }
])
const items = ref([
  {
    label: 'Configurações',
    icon: 'pi pi-file',
    command: () => {
      router.push('/usersettings')
    }

  },
  {
    separator: true
  },
  {
    label: 'Sair',
    icon: 'pi pi-file-edit',
    command: () => {
      logOut()
    }
  }
])

function toggle(event) {
  menu.value.toggle(event)
}
</script>

<template>
  <Menubar :model="items_0">
    <template #start>
      <img src="/img/logo.jpeg" class="mr-5" style="width: 100px; border-radius: .3rem;">
    </template>
    <template #item="{ item, props, hasSubmenu, root }">
      <a v-ripple class="flex align-items-center" v-bind="props.action">
        <a :href="item.link">
          <span :class="item.icon" class="menulink" />
          <span class="ml-2 menulink">{{ item.label }}</span>
        </a>
        <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
        <span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{ item.shortcut }}</span>
        <i v-if="hasSubmenu" class="pi pi-angle-down" :class="[{ 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]" />
      </a>
    </template>
    <template #end>
      <div class="flex align-items-center gap-2">
        <span style="font-size: 18px;" class="mr-3">{{ dataUser?.username }}</span>
        <Button label="Sair" severity="contrast" class="mr-5" @click="logOut" />
      </div>
    </template>
  </Menubar>
  <div v-if="dataUser" class="mt-1 p-2" style="background-color: #9f763a; border-radius: 8px;">
    <span class="title">Email:</span> {{ dataUser.email }} /
    <span class="title">Plano:</span> {{ userPlanoName }} /
    <span class="title">Adesão:</span> {{ dataUser.adesao.split('/')[1] }}/{{ dataUser.adesao.split('/')[2] }}
    <!-- <span class="title">Encerramento:</span> {{dataUser?.data_limite}} -->
    <span v-if="dataUser?.products">| Produtos: {{ dataUser?.value.products.map(x => x.name).join(',') }}</span>
  <!-- | <Button label="Sair" @click="logOut" severity="contrast" text class="p-0"/> -->
  </div>
  <slot />
</template>

<style scoped>
a {
	color:rgb(10, 10, 62);
}

.title {
  font-weight: bold;
}
.menulink {
	color: whitesmoke;
}
</style>
