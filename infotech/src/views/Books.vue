<template>
  <section>
    <h1>{{ $t('books.title') }}</h1>
    <v-row v-if="items.length" class="justify-center">
      <v-col v-for="book in items" :key="book.id" cols="12" md="6">
        <BookPreviewCard :book="book" />
      </v-col>
    </v-row>
    <NoData v-else-if="books && !loading" :message="$t('books.empty')" />
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useBooksStore, useUiStore } from '@/stores';
import NoData from '@/components/NoData.vue';
import BookPreviewCard from '@/components/BookPreviewCard.vue';

const { books } = storeToRefs(useBooksStore());
const { getBooks, clearBooks } = useBooksStore();
const { loading } = storeToRefs(useUiStore());
const items = computed(() => books.value?.items ?? []);

getBooks();
onBeforeUnmount(clearBooks);
</script>
