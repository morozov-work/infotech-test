<template>
  <v-card
    :to="book.id != null ? { name: 'book', params: { id: book.id } } : undefined"
    variant="outlined"
    class="d-flex align-start h-100 pa-3"
  >
    <div class="preview-cover flex-shrink-0">
      <BookCover :src="book.cover_url" />
    </div>
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
import BookCover from '@/components/BookCover.vue';

const props = defineProps<{ book: Book }>();
const authors = computed(() =>
  (props.book.authors ?? [])
    .map((author) => author.full_name)
    .filter(Boolean)
    .join(', '),
);
</script>

<style scoped>
.preview-cover {
  width: 90px;
  height: 135px;
}

.book-info {
  min-width: 0;
  overflow-wrap: anywhere;
}
</style>
