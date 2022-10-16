<template>
  <q-page class="bg-accent q-ma-none q-pa-lg q-pt-xl" style="text-align: -webkit-center;">
    <q-table
        ref="tableRef"
        :class="tableClass"
        tabindex="0"
        title="Lista de documentos"
        :rows="rows"
        :columns="columns"
        row-key="name"
        v-model:selected="selected"
        v-model:pagination="pagination"
        :filter="filter"
        @focusin="activateNavigation"
        @focusout="deactivateNavigation"
        @keydown="onKey"
        no-data-label="No hay datos"
        style="max-width: 600px"
        rows-per-page-label="Archivos por página"
        v-if="loading === false"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-actions="props">
          <div class="row q-pa-md q-gutter-sm text-center">
            <q-btn
            class="col"
              color="green"
              icon="edit"
              @click="edit(props?.row?.id, props?.row?.name, props?.row?.url)"
            >
              <q-tooltip class="bg-dark text-weight-bold"
                >Editar</q-tooltip>
            </q-btn>
            <q-btn
            class="col"
              color="orange"
              icon="download"
              @click="download(props?.row?.url)"
            >
              <q-tooltip class="bg-dark text-weight-bold"
                >Descargar</q-tooltip>
            </q-btn>
            <q-btn
            class="col"
              color="red"
              icon="delete"
              @click="deleteDocument(props?.row?.url)"
            >
              <q-tooltip class="bg-dark text-weight-bold"
                >Eliminar</q-tooltip>
            </q-btn>
          </div>
        </template>
      </q-table>
      <my-loading v-if="loading"/>
      <view-modify-doc v-model="viewmodifyDoc"
            v-if="viewmodifyDoc"
            :id="id"
            :name="name"
            :fileName="fileName"
            @loading="getDocuments()"
          />
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useDocuments } from "src/stores/documents";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import MyLoading from "src/components/popups/MyLoading.vue";
import ViewModifyDoc from "src/components/popups/ViewModifyDoc.vue";

const $q = useQuasar();
const $router = useRouter();
const storeDocuments = useDocuments();
const loading = ref(false);
const viewmodifyDoc = ref(false);
const name = ref("");
const fileName = ref("");
const id = ref("");

const rows = ref([]);
const columns = ref([
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    align: "center",
    sortable: false,
  },
  {
    name: "name",
    label: "Nombre",
    field: "name",
    align: "center",
    sortable: true,
    style: "width: 250px",
  },
  {
    name: "date",
    label: "Fecha",
    field: "date",
    align: "center",
    sortable: true,
  },
  {
    name: "type",
    label: "Tipo",
    field: "type",
    align: "center",
    sortable: true,
  },
  {
    name: "size",
    label: "Tamaño",
    field: "size",
    align: "center",
    sortable: true,
  }
]);

const tableRef = ref(null);
const navigationActive = ref(false);
const pagination = ref({});
const selected = ref([]);
const filter = ref("");
const tableClass = computed(() =>
  navigationActive.value === true ? "shadow-8 no-outline" : null
);
const activateNavigation = () => {
  navigationActive.value = true;
};

const deactivateNavigation = () => {
  navigationActive.value = false;
};

const onKey = (evt) => {
  if (
    navigationActive.value !== true ||
    [33, 34, 35, 36, 38, 40].indexOf(evt.keyCode) === -1 ||
    tableRef.value === null
  ) {
    return;
  }

  evt.preventDefault();

  const { computedRowsNumber, computedRows } = tableRef.value;

  if (computedRows.length === 0) {
    return;
  }

  const currentIndex =
    selected.value.length > 0 ? computedRows.indexOf(selected.value[0]) : -1;
  const currentPage = pagination.value.page;
  const rowsPerPage =
    pagination.value.rowsPerPage === 0
      ? computedRowsNumber
      : pagination.value.rowsPerPage;
  const lastIndex = computedRows.length - 1;
  const lastPage = Math.ceil(computedRowsNumber / rowsPerPage);

  let index = currentIndex;
  let page = currentPage;

  switch (evt.keyCode) {
    case 36: // Home
      page = 1;
      index = 0;
      break;
    case 35: // End
      page = lastPage;
      index = rowsPerPage - 1;
      break;
    case 33: // PageUp
      page = currentPage <= 1 ? lastPage : currentPage - 1;
      if (index < 0) {
        index = 0;
      }
      break;
    case 34: // PageDown
      page = currentPage >= lastPage ? 1 : currentPage + 1;
      if (index < 0) {
        index = rowsPerPage - 1;
      }
      break;
    case 38: // ArrowUp
      if (currentIndex <= 0) {
        page = currentPage <= 1 ? lastPage : currentPage - 1;
        index = rowsPerPage - 1;
      } else {
        index = currentIndex - 1;
      }
      break;
    case 40: // ArrowDown
      if (currentIndex >= lastIndex) {
        page = currentPage >= lastPage ? 1 : currentPage + 1;
        index = 0;
      } else {
        index = currentIndex + 1;
      }
      break;
  }

  if (page !== pagination.value.page) {
    pagination.value.page = page;

    nextTick(() => {
      const { computedRows } = tableRef.value;
      selected.value = [computedRows[Math.min(index, computedRows.length - 1)]];
    });
  } else {
    selected.value = [computedRows[index]];
  }
};

onMounted( () => {
  getDocuments();
});

const getDocuments = async () => {
  try {
    loading.value = true;
    viewmodifyDoc.value = false;
    const response = await storeDocuments.listDocuments();
    if (response.status === 200) {
      rows.value = [];
      response.value.forEach((item) => {
        const fbRow = {
          id: item.id,
          name: item.name,
          date: item.date.toDate().toLocaleDateString(),
          size: item.size + " B",
          type: item.type,
          url: item.url,
        };
        rows.value.push(fbRow);
      });
      loading.value = false;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
  }
};

const download = async (name) => {
  try {
    const response = await storeDocuments.getDownloadURL(name);
    if (response.status === 200) {

    }
  } catch (e) {
    console.error("Error downloading document: ", e);
  }
};

const edit = async (idD, nameD, url) => {
  id.value = idD;
  name.value = nameD;
  fileName.value = url;
  viewmodifyDoc.value = true;
};

const deleteDocument = async (name) => {
  try {
    const response = await storeDocuments.deleteDoc(name);
    await storeDocuments.deleteDocument(name);
    if (response.status === 200) {
      $q.notify({
        message: "Documento eliminado",
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
      });
      getDocuments();
    } else {
      $q.notify({
        message: "No se pudo eliminar el documento. Intente nuevamente",
        color: "red-4",
        textColor: "white",
        icon: "cloud_off",
      });
    }
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

</script>

<style></style>
