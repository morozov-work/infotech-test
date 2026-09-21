<template>
  <v-overlay v-model="show" class="align-center justify-center" persistent scroll-strategy="block">
    <v-progress-circular indeterminate :size="100" />
  </v-overlay>
</template>

<script setup lang="ts">
const show = defineModel<boolean>({ default: false });
</script>
