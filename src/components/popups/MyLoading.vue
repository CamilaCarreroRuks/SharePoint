<template>
  <div
    class="fixed-center row justify-center items-center"
    style="max-width: 280px; width: 80%"
  >
    <h6 class="col q-ma-md q-pa-md">Cargando...</h6>
    <q-circular-progress
      indeterminate
      size="50px"
      :thickness="0.22"
      color="secondary"
      track-color="primary"
      class="col q-ma-md"
    />
  </div>
</template>
<script setup></script>
