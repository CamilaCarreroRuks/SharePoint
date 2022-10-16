<template>
  <q-page class="bg-accent q-ma-none q-pa-lg q-pt-xl" style="text-align: -webkit-center;">
    <q-card class="q-pt-md qmt-lg justify-center" style="max-width: 650px;">
      <q-form
        class="row q-col-gutter-md q-pa-md items-center justify-center"
        style="display: flex; flex-wrap: wrap"
        @submit.prevent="onSubmitAddDocument"
      >
        <h6 class="col-12 col-sm-12 text-center q-ma-md q-pa-none">
          Agregar documento
        </h6>
        <q-input
          class="col-12 col-sm-4 q-pr-md"
          style="min-width: 250px"
          type="text"
          v-model="name"
          label="Nombre del archivo"
          :rules="[(val) => (val && val.length > 0) || 'Campo vacío']"
        />

        <q-file
          class="col-12 col-sm-4 q-pr-md"
          style="min-width: 250px"
          bottom-slots
          v-model="file"
          label="Seleccionar archivo"
          counter
          max-files="1"
          :rules="[(val) => val || 'Campo vacío']"
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
            v-close-popup
            type="submit"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useSession } from "src/stores/session";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useDocuments } from "src/stores/documents";

const $q = useQuasar();
const $router = useRouter();
const storeSession = useSession();
const storeDocuments = useDocuments();

const name = ref("");
const file = ref("");

const onSubmitAddDocument = async () => {
  try {
    if (name.value && file.value) {
      const data = {
        name: name.value,
        file: file.value,
        date: new Date(),
        type: file.value.type,
        size: file.value.size,
        url: file.value.name,
      };
      const response = await storeDocuments.addDocument(file.value);
      await storeDocuments.addDoc(data);
      if (response.status === 200) {
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Documeto agregado",
        });
        await $router.push({name: 'table'});
      } else {
        $q.notify({
          color: "red-4",
          textColor: "white",
          icon: "cloud_off",
          message: "No se pudo agregar el documento",
        });
      }
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

<style></style>
