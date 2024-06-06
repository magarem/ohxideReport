<script setup>
import { FilterMatchMode } from 'primevue/api'
// import DataItemService from '@/service/UserService';
import { useToast } from 'primevue/usetoast'
import '@/assets/styles.scss'

// const source = route.query.source
// const dataItemService = new DataItemService();

const props = defineProps(['schema', 'data', 'source2', 'reorder'])
const emit = defineEmits(['create', 'update', 'del', 'updateorder'])
const toast = useToast()
const dataItemDialog = ref(false)
const deleteDataItemDialog = ref(false)
const deleteDataItemsDialog = ref(false)
const selectedDataItems = ref(null)
const dt = ref(null)
const filters = ref({})
const submitted = ref(false)

const dataItem = ref({})

const dataItems = ref(null)
const dataTitle = ref(null)
const dataDesc = ref(null)
const dataGridColumns = ref([])

const dataItems2 = ref([])
const dataTitle2 = ref(null)
const dataDesc2 = ref(null)
const dataGridColumns2 = ref([])

const route = useRoute()
const schema = props.schema
const data = ref()
const source2 = props.source2
const files = ref()
const submitBtn = ref(null)

function onRowReorder(event) {
  data.value = event.value
  emit('updateorder', data.value)
  toast.add({ severity: 'success', summary: 'Rows Reordered', life: 3000 })
}

onBeforeMount(() => {
  initFilters()
})

onMounted(async () => {
  // await fetch(source)
  //     .then((res) => res.json())
  //     .then((data) => {
  // console.log("Schema:", props.schema.schema, "data:", props.data);
  dataTitle.value = schema.title
  dataDesc.value = schema.desc
  data.value = props.data
  Object.entries(props.schema.schema).map((x) => {
    dataGridColumns.value.push({
      id: x[0],
      label: x[1].label,
      type: x[1].type,
      null: x[1].null,
      hide: x[1].hide || false,
      options: x[1].options,
      placeholder: x[1].placeholder
    })
  })
  // dataGridColumns.value = schema.schema
  // console.log('dataGridColumns.value:', dataGridColumns.value);
  // dataGridColumns.value = schema.schema
  // console.log('dataGridColumns.value:', dataGridColumns.value);
  //     });
  // if (source2) {
  //     console.log('source2');
  //     await fetch(source2)
  //     .then((res) => res.json())
  //     .then((data) => {
  if (source2) {
    dataTitle2.value = source2.title
    dataDesc2.value = source2.desc
    dataItems2.value = source2.data
    dataGridColumns2.value = source2.schema
    console.log('dataItems2.value:', dataItems2.value)
  }

  // emit('updatedata', dataItems.value)
  //     });
  // }
})

function formatCurrency(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

function openNew() {
  dataItem.value = {}
  submitted.value = false
  dataItemDialog.value = true
}

function hideDialog() {
  dataItemDialog.value = false
  submitted.value = false
}

async function saveData() {
  // submitted.value = true;

  // if (dataItem.value.name && dataItem.value.name.trim() && dataItem.value.price) {
  if (dataItem.value.id) {
    // dataItem.value.inventoryStatus = dataItem.value.inventoryStatus.value ? dataItem.value.inventoryStatus.value : dataItem.value.inventoryStatus;
    data.value[findIndexById(dataItem.value.id)] = dataItem.value

    // array to cvs to save in sqlite3
    // Object.entries(schema).forEach(item=>{
    //     if (item[1].type?.toLowerCase()=="multiselect"){
    //         data.value[item[0]] = data.value[item[0]].join(',')
    //         console.log('lll>>', data.value[item[0]]);
    //     }
    // })

    toast.add({ severity: 'success', summary: 'Successful', detail: 'DataItem Updated', life: 3000 })
    emit('update', data.value[findIndexById(dataItem.value.id)])
    dataItem.value = {}
  }
  else {
    dataItem.value.id = createId()
    // console.log('dataItem.value:', dataItem.value);
    // dataItem.value.code = createId();
    // dataItem.value.image = 'dataItem-placeholder.svg';
    // dataItem.value.inventoryStatus = dataItem.value.inventoryStatus ? dataItem.value.inventoryStatus.value : 'INSTOCK';
    data.value.push(dataItem.value)
    toast.add({ severity: 'success', summary: 'Successful', detail: 'DataItem Created', life: 3000 })
    emit('create', dataItem.value)
    dataItem.value = {}
  }
  dataItemDialog.value = false
}

function editDataItem(editDataItem) {
  dataItem.value = { ...editDataItem }
  // console.log(dataItem);
  dataItemDialog.value = true
}

function confirmDeleteDataItem(editDataItem) {
  dataItem.value = editDataItem
  deleteDataItemDialog.value = true
}

async function deleteData() {
  data.value = data.value.filter(val => val.id !== dataItem.value.id)
  deleteDataItemDialog.value = false
  emit('del', dataItem.value)
  dataItem.value = {}
  toast.add({ severity: 'success', summary: 'Successful', detail: 'DataItem Deleted', life: 3000 })
}

function findIndexById(id) {
  let index = -1
  for (let i = 0; i < data.value.length; i++) {
    if (data.value[i].id === id) {
      index = i
      break
    }
  }
  return index
}

function createId() {
  let id = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

function exportCSV() {
  dt.value.exportCSV()
}

function confirmDeleteSelected() {
  deleteDataItemsDialog.value = true
}

function deleteSelectedDataItems() {
  data.value = data.value.filter(val => !selectedDataItems.value.includes(val))
  deleteDataItemsDialog.value = false
  console.log(selectedDataItems.value)
  emit('del', selectedDataItems.value)
  selectedDataItems.value = null

  toast.add({ severity: 'success', summary: 'Successful', detail: 'DataItems Deleted', life: 3000 })
}

function initFilters() {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  }
}

function handleFile(e) {
  files.value = e.target.files
  const file = e.target.files[0]
  // url.value = URL.createObjectURL(file);
  // submitBtn.value.click();
}

async function handleImageUpload(x) {
  try {
    const fd = new FormData()
    Array.from(files.value).map(async (file, index) => {
      fd.append('photo', file)
      console.log('file---->', file.name)

      const { data, pending, error, refresh } = await useAsyncData(
        'data',
        () => $fetch('/api/upload?dir=reports', {
          method: 'POST',
          body: fd,
        })
      )

      console.log('data from backend is ', data.value)
      dataItem.value[x] = data.value
    })

    // stateStore.value.unshift([data, false])
    // router.go();
    // return file.name
  }
  catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div v-if="data" class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <DataTable
          ref="dt"
          v-model:selection="selectedDataItems"
          :value="data"
          data-key="id"
          :paginator="true"
          :rows="4"
          :filters="filters"
          class="p-0"
          striped-rows
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows-per-page-options="[5, 10, 25]"
          current-page-report-template="Mostrando {first} até {last} de {totalRecords} itens"
          responsive-layout="scroll"
          @row-reorder="onRowReorder"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <!-- <h5 class="m-0">Items</h5> -->
              <div class="grid grid-cols-3 gap-6">
                <div>
                  <h4 style="margin-bottom: -10px;">
                    {{ dataTitle }}
                  </h4>
                  <h6>{{ dataDesc }}</h6>
                </div>
                <div>
                  <div class="mt-3">
                    <Button label="Novo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                    <Button label="Excluir" icon="pi pi-trash" class="p-button-danger" :disabled="!selectedDataItems || !selectedDataItems.length" @click="confirmDeleteSelected" />
                  </div>
                </div>

                <div>
                  <span class="block mt-3 md:mt-3 p-input-icon-left">
                    <i class="pi pi-search mr-2" />
                    <InputText v-model="filters.global.value" placeholder="Buscar..." />
                  </span>
                </div>
              </div>
            </div>
          </template>
          <Column v-if="reorder" row-reorder header-style="width: 3rem" :reorderable-column="false" />
          <Column selection-mode="multiple" header-style="width: 3rem" />

          <Column v-for="item in dataGridColumns" :key="item.id" :field="item.id" :header="item.label" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <div v-if="item.type?.toLowerCase() == 'upload'">
                <a :href="`/upload/${slotProps.data[item.id]}`">{{ slotProps.data[item.id] }}</a>
              </div>
              <div v-if="['string', 'integer'].includes(item.type?.toLowerCase())">
                {{ slotProps.data[item.id] }}
              </div>
              <div v-if="['select'].includes(item.type?.toLowerCase())">
                {{ item.options.find(x => x.code == slotProps.data[item.id]).name }}
              </div>
              <div v-if="['multiselect'].includes(item.type?.toLowerCase())">
                {{ slotProps.data[item.id].map(t =>
                  item.options.find(x => x.id == t) ? item.options.find(x => x.id == t).name : "-",
                ).join(', ') }}
              </div>
              <!-- <div v-if="Object.values(item)[0].type=='selecttable'">
                                {{ slotProps.data[item.optionLabel] }}
                            </div>
                            <div v-if="Object.values(item)[0].type=='multiselect'">
                                {{ slotProps.data[item[0]]?.map(x=>
                                x[item[3].optionLabel]
                                ).join(', ')}}
                            </div> -->
              <div v-if="Object.values(item)[0].type == 'upload'">
                <a :href="`/file/${slotProps.data[item[0]]}`" target="_blank">{{ slotProps.data[item[0]] }}</a>
              </div>
            </template>
          </Column>

          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editDataItem(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteDataItem(slotProps.data)" />
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="dataItemDialog" :style="{ width: '450px' }" :header="dataTitle" :modal="true" class="p-fluid">
          <div v-for="item in dataGridColumns" :key="item.id" class="field">
            <div v-show="item.id?.toLowerCase() !== 'id'">
              <label for="name">{{ item.label }}</label>
              <InputText v-if="['string', 'integer'].includes(item.type?.toLowerCase())" id="name" v-model.trim="dataItem[item.id]" autofocus />
              <Textarea v-if="item.type?.toLowerCase() == 'textarea'" v-model.trim="dataItem[item.id]" rows="5" cols="30" />

              <Dropdown v-if="item.type?.toLowerCase() == 'select'" v-model="dataItem[item.id]" :options="item.options" option-value="id" option-label="name" :placeholder="item.placeholder" class="w-full md:w-14rem" />

              <MultiSelect v-if="item.type?.toLowerCase() == 'multiselect'" v-model="dataItem[item.id]" display="chip" :options="item.options" option-value="id" filter option-label="name" :placeholder="item.placeholder" max-selected-labels="100" class="w-full md:w-20rem" />
            </div>
            <!-- <FileUpload v-if="item[1]=='upload'" mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" @upload="onUpload" /> -->

            <form v-if="item.type?.toLowerCase() == 'upload'" ref="formUploadFile" _style="display: none;" @submit.prevent="handleImageUpload(item.id)">
              <InputText id="name" v-model.trim="dataItem[item.id]" autofocus />
              <input id="inputGroupFile" type="file" class="form-control" @change="handleFile($event)">
              <input ref="submitBtn" type="submit" class="btn btn-primary">
            </form>
            <!-- <label v-if="item[2]=='upload'" class="btn btn-outline-secondary btn-sm" for="inputGroupFile">Enviar imagem</label> -->

            <small v-if="submitted && !dataItem.name" class="p-invalid">Preencha {{ item[1] }}</small>
          </div>

          <!-- <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="dataItem.description" required="true" rows="3" cols="20" />
                    </div>

                    <div class="field">
                        <label for="inventoryStatus" class="mb-3">Inventory Status</label>
                        <Dropdown id="inventoryStatus" v-model="dataItem.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'dataItem-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                                </div>
                                <div v-else-if="slotProps.value && !slotProps.value.value">
                                    <span :class="'dataItem-badge status-' + slotProps.value?.toLowerCase()">{{ slotProps.value }}</span>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                        </Dropdown>
                    </div>

                    <div class="field">
                        <label class="mb-3">Category</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category1" name="category" value="Accessories" v-model="dataItem.category" />
                                <label for="category1">Accessories</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category2" name="category" value="Clothing" v-model="dataItem.category" />
                                <label for="category2">Clothing</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category3" name="category" value="Electronics" v-model="dataItem.category" />
                                <label for="category3">Electronics</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category4" name="category" value="Fitness" v-model="dataItem.category" />
                                <label for="category4">Fitness</label>
                            </div>
                        </div>
                    </div>

                   -->
          <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveData" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteDataItemDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="dataItem">Confirma exclusão <b>{{ dataItem.name }}</b>?</span>
          </div>
          <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDataItemDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteData" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteDataItemsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="dataItem">Confirma exclusão de itens selecionados?</span>
          </div>
          <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDataItemsDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteSelectedDataItems" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
