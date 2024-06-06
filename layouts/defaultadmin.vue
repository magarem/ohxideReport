<script setup>
// # for local storage
// import { getData, setData } from 'nuxt-storage/local-storage';
import { useStorage } from '@vueuse/core'
import 'primeflex/primeflex.css'

const { status, data, signIn, signOut } = useAuth()
console.log(status.value)

if (status.value !== 'authenticated') { navigateTo('/admin/login') }

const { data: ret } = await useFetch('/api/listaUsers', {
  method: 'POST',
  body: {
    email: data.value.user.email
  },
})

const dataUser = useStorage('user', ret.value)

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    link: '/admin/'
  },
  {
    label: 'Usuários',
    icon: 'pi pi-users',
    link: '/admin/users'
  },
  {
    label: 'Clientes',
    icon: 'pi pi-id-card',
    link: '/admin/clients'
  },
  {
    label: 'Planos',
    icon: 'pi pi-id-card',
    link: '/admin/planos'
  },
  {
    label: 'Tags',
    icon: 'pi pi-id-card',
    link: '/admin/tags'
  },
  {
    label: 'Relatórios',
    icon: 'pi pi-file-pdf',
    link: '/admin/reports'
  },
  // },
  {
    label: 'Sistema',
    icon: 'pi pi-sliders-h',
    items: [
      {
        label: 'Configurações',
        icon: 'pi pi-bolt',
        link: '/admin/config'
      },
      {
        label: 'Enviar emails',
        icon: 'pi pi-server',
        link: '/admin/sendemail'
        // shortcut: '⌘+B'
      }
      // ,
      // {
      //     label: 'UI Kit',
      //     icon: 'pi pi-pencil',
      //     shortcut: '⌘+U'
      // },
      // {
      //     separator: true
      // },
      // {
      //     label: 'Templates',
      //     icon: 'pi pi-palette',
      //     items: [
      //         {
      //             label: 'Apollo',
      //             icon: 'pi pi-palette',
      //             badge: 2
      //         },
      //         {
      //             label: 'Ultima',
      //             icon: 'pi pi-palette',
      //             badge: 3
      //         }
      //     ]
      // }
    ]
  }
  // {
  //     label: 'Contact',
  //     icon: 'pi pi-envelope',
  //     badge: 3
  // }
])
</script>

<template>
  <Menubar :model="items">
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
        <Button label="Sair" severity="contrast" class="mr-5" @click="signOut" />
      </div>
    </template>
  </Menubar>

  <nav v-if="false" class="flex items-center justify-between flex-wrap p-1" style="background-color: #73a1a5;">
    <div class="flex items-center flex-shrink-0 text-white mr-2">
      <!-- <svg class="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg> -->
      <img src="/img/logo.jpeg" style="width: 70px;">
    <!-- <span class="font-semibold text-xl tracking-tight">Tailwind CSS</span> -->
    </div>
    <div class="block lg:hidden">
      <button class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
      </button>
    </div>
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm lg:flex-grow mt-0">
        <span class="text-[22px]" style="color: #514342; font-size: 22px;">WReport</span> admin<br>
        <div class="mt-1 ml-1">
          <NuxtLink class="block mt-4 lg:inline-block lg:mt-0  hover:text-white mr-4" to="/admin/">
            Início
          </NuxtLink>
          <NuxtLink v-if="dataUser?.status && dataUser?.status == 'root'" class="block mt-4 lg:inline-block lg:mt-0  hover:text-white mr-4" to="/admin/users">
            Usuários
          </NuxtLink>
          <NuxtLink class="block mt-4 lg:inline-block lg:mt-0  hover:text-white mr-4" to="/admin/clients">
            Clientes
          </NuxtLink>
          <NuxtLink class="block mt-4 lg:inline-block lg:mt-0  hover:text-white mr-4" to="/admin/products">
            Produtos
          </NuxtLink>
          <NuxtLink class="block mt-4 lg:inline-block lg:mt-0  hover:text-white mr-4" to="/admin/reports">
            Relatórios
          </NuxtLink>
          <NuxtLink class="block mt-4 lg:inline-block lg:mt-0  hover:text-white mr-4" to="/admin/client_planos">
            Planos
          </NuxtLink>
        </div>
      </div>
      <!-- <div class="mr-5">
        <a href="#" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Sair</a>
      </div> -->
    </div>
  </nav>
  <div v-if="true" class="p-2" style="background-color: #9f763a; border-radius: 8px;">
    Usuário: {{ dataUser?.email }} - {{ dataUser?.name }}
  </div>

  <div class="p-4">
    <slot />
  </div>
</template>

<style scoped>
.menulink {
	color: whitesmoke;
}
</style>
