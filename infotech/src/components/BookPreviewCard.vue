<template>
  <v-card
    :to="book.id != null ? { name: 'book', params: { id: book.id } } : undefined"
    variant="outlined"
    class="d-flex align-start h-100 pa-3"
  >
    <v-img
      :src="book.cover_url || fallbackCover"
      :alt="book.title"
      width="90"
      height="135"
      class="flex-grow-0 flex-shrink-0"
    >
      <template #error>
        <v-img :src="fallbackCover" :alt="$t('book.noCover')" width="90" height="135" />
      </template>
    </v-img>
    <div class="book-info">
      <v-card-title class="text-wrap pt-0">{{ book.title }}</v-card-title>
      <v-card-subtitle>{{ book.year }}</v-card-subtitle>
      <v-card-text>{{ authors }}</v-card-text>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Book } from '@/types';

const props = defineProps<{ book: Book }>();
const fallbackCover = `${import.meta.env.BASE_URL}cover.svg`;
const authors = computed(() =>
  (props.book.authors ?? [])
    .map((author) => author.full_name)
    .filter(Boolean)
    .join(', '),
);
</script>

<style scoped>
.book-info {
  min-width: 0;
  overflow-wrap: anywhere;
}
</style>
