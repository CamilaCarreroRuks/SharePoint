<template>
  <div class="bg-accent">
    <q-toolbar class="bg-primary text-white q-ma-none q-pa-none">
      <q-toolbar-title class="text-center">
        SharePoint
      </q-toolbar-title>

    </q-toolbar>
    <div class="">
        <q-tabs
          :v-model="tab"
          inline-label
          dense
          align="justify"
          class="bg-secondary text-dark"
        >
          <q-route-tab
            name="addDocument"
            label="Agregar"
            icon="add"
            :to="{name: 'home'}"
          >
          </q-route-tab>
          <q-route-tab
            name="viewDocument"
            icon="visibility"
            label="Ver"
            :to="{name: 'table'}"
          >
          </q-route-tab>
        </q-tabs>
      </div>
  </div>
  <q-page-container>
    <router-view />
  </q-page-container>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useSession } from "src/stores/session";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

const $router = useRouter();
const $route = useRoute();
const storeSession = useSession();
const $q = useQuasar();
const loading = ref(false);
const hashSelectedAuth = ref("");
const tab = ref("addDocument");



</script>

<style lang="sass">
.my-menu-link
    color: black
    background: #e8c352
</style>
