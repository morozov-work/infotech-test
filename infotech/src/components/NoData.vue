<template>
  <p class="text-center text-medium-emphasis py-8" role="status">
    {{ message ?? $t('noData') }}
  </p>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>();
</script>
