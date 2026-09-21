<template>
  <section v-if="book">
    <h1>{{ book.title }}</h1>
    <v-row class="mt-4">
      <v-col cols="12" sm="4" md="3">
        <BookCover :src="book.cover_url" />
      </v-col>
      <v-col cols="12" sm="8" md="9">
        <p class="mb-2">{{ $t('yearLabel') }}: {{ book.year }}</p>
        <p v-if="book.isbn" class="mb-2">ISBN: {{ book.isbn }}</p>
        <p v-if="authors" class="mb-4">{{ $t('authorLabel') }}: {{ authors }}</p>
        <p class="mb-4">{{ $t('book.description') }}: {{ book.description }}</p>
      </v-col>
    </v-row>
  </section>
  <NoData v-else-if="!loading" :message="$t('book.empty')" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useBooksStore, useUiStore } from '@/stores';
import NoData from '@/components/NoData.vue';
import BookCover from '@/components/BookCover.vue';

const props = defineProps<{ id: string }>();
const { getBook, clearBook } = useBooksStore();
const { book } = storeToRefs(useBooksStore());
const { loading } = storeToRefs(useUiStore());
const authors = computed(() =>
  (book.value?.authors ?? [])
    .map((author) => author.full_name)
    .filter(Boolean)
    .join(', '),
);

getBook(Number(props.id));
onBeforeUnmount(clearBook);
</script>
