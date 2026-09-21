<template>
  <section>
    <h1>{{ $t('book.editTitle', { id }) }}</h1>
    <BookFormPlaceholder />
  </section>
</template>

<script setup lang="ts">
defineProps<{ id: string }>();
</script>
