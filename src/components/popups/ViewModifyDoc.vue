<template>
  <q-dialog v-close-popup="closePopup">
    <q-card class="popUp q-pt-md qmt-lg justify-center" style="max-width: 450px;">
      <q-btn class="col-2 q-ml-sm" icon="close" flat round dense v-close-popup/>
      <q-form
        class="row q-col-gutter-md q-pa-md items-center justify-center"
        style="display: flex; flex-wrap: wrap"
        @submit.prevent="onSubmitEditDocument"
      >
        <h6 class="col-12 col-sm-12 text-center q-ma-md q-pa-none">
          Modificar documento
        </h6>
        <q-input
          class="col-12 col-sm-4 q-pr-md"
          style="min-width: 250px"
          type="text"
          v-model="name"
          label="Nombre del archivo"
          :rules="[(val) => (val && val.length > 0) || 'Campo vacío']"
        />
        <q-input
          class="col-12 col-sm-4 q-pr-md"
          style="min-width: 250px"
          type="text"
          v-model="fileName"
          label="Archivo"
          readonly
        />
        <q-file
          class="col-12 col-sm-4 q-pr-md"
          style="min-width: 250px"
          bottom-slots
          v-model="file"
          label="Seleccionar archivo"
          counter
          max-files="1"
        >
          <template v-slot:append>
            <q-icon
              name="file_upload"
              color="primary"
              class="q-pr-sm"
            />
          </template>
        </q-file>
        <div class="col-12 q-pr-md text-center">
          <q-btn
            class="col-12 col-sm-4"
            label="Guardar"
            color="primary"
            type="submit"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useDocuments } from "src/stores/documents";

const $q = useQuasar();
const $router = useRouter();
const storeDocuments = useDocuments();
const closePopup = ref(false);
const name = ref("");
const file = ref("");
const fileName = ref("");
const $emit = defineEmits({ loading: Boolean });
const props = defineProps({
  id: {
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
});

onMounted(async () => {
  name.value = props.name;
  file.value = props.file;
  fileName.value = props.fileName;
});

const onSubmitEditDocument = async () => {
  try {
    if (name.value && file.value) {
      const data = {
        id: props.id,
        name: name.value,
        file: file.value,
        date: new Date(),
        type: file.value.type,
        size: file.value.size,
        url: file.value.name,
      };
      console.log("data", data);
      const response = await storeDocuments.modifyDoc(data);
      storeDocuments.addDocument(file.value);
      if (response.status === 200) {
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Documeto modificado",
        });
        closePopup.value = true;
        $emit("loading", true);
      } else {
        $q.notify({
          color: "red-4",
          textColor: "white",
          icon: "cloud_off",
          message: "No se pudo modificar el documento",
        });
      }
    } else if (name.value && file.value === undefined){
      console.log("entro");
      $q.dialog({
        title: "Modificar Documento",
        message: "¿Esta seguro que desea modificar solo el nombre?",
        cancel: true,
      }).onOk(async () => {
        const data = {
          id: props.id,
          name: name.value,
          date: new Date(),
        };
        console.log("data", data);
        const response = await storeDocuments.modifyDoc(data);
        console.log("response", response);
        if (response.status === 200) {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Documeto modificado",
          });
          closePopup.value = true;
          $emit("loading", true);
        } else {
          $q.notify({
            color: "red-4",
            textColor: "white",
            icon: "cloud_off",
            message: "No se pudo modificar el documento",
          });
        }
      });
    } else {
      $q.notify({
        color: "red-4",
        textColor: "blck",
        icon: "cloud_done",
        message: "Complete todos los campos",
      });
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

</script>
<style>
.popUp {
  background-color: rgb(223, 175, 241,1);
}
</style>
