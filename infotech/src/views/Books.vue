<template>
  <section>
    <v-row v-if="items.length" class="justify-center">
      <v-col v-for="book in items" :key="book.id" cols="12" md="6">
        <BookPreviewCard :book="book" />
      </v-col>
    </v-row>
    <NoData v-else-if="books && !loading" :message="$t('books.empty')" />
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useBooksStore, useUiStore } from '@/stores';
import NoData from '@/components/NoData.vue';
import BookPreviewCard from '@/components/BookPreviewCard.vue';

const { books } = storeToRefs(useBooksStore());
const { getBooks, clearBooks } = useBooksStore();
const { loading } = storeToRefs(useUiStore());
const items = computed(() => books.value?.items ?? []);

const route = useRoute();
watch(
  () => route.query.page,
  (value) => getBooks({ page: Math.max(1, Number(value) || 1) }),
  { immediate: true },
);
onBeforeUnmount(clearBooks);
</script>
