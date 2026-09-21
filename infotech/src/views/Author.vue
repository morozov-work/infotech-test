<template>
  <section>
    <h1>{{ $t('author.title', { id }) }}</h1>
  </section>
</template>

<script setup lang="ts">
defineProps<{ id: string }>();
</script>
