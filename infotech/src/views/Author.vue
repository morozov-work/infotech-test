<template>
  <section v-if="author">
    <h1>{{ author.full_name }}</h1>
    <p v-if="subscribed" class="mt-2 text-success">{{ $t('author.subscribed') }}</p>
    <h2 class="mt-4 mb-4">{{ $t('author.books') }}</h2>
    <v-row v-if="items.length" class="justify-center">
      <v-col v-for="book in items" :key="book.id" cols="12" md="6">
        <BookPreviewCard :book="book" />
      </v-col>
    </v-row>
    <NoData v-else :message="$t('books.empty')" />
  </section>
  <NoData v-else-if="!loading" :message="$t('author.empty')" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthorsStore, useUiStore, useAuthStore } from '@/stores';
import NoData from '@/components/NoData.vue';
import BookPreviewCard from '@/components/BookPreviewCard.vue';

const props = defineProps<{ id: string }>();
const { getAuthor, clearAuthor } = useAuthorsStore();
const { author } = storeToRefs(useAuthorsStore());
const { loading } = storeToRefs(useUiStore());
const route = useRoute();
const { user } = storeToRefs(useAuthStore());
const subscribed = computed(
  () => user.value?.subscriptions?.includes(Number(props.id)),
);
const items = computed(() => {
  const page = Math.max(1, Number(route.query.page) || 1);
  return (author.value?.books ?? []).slice((page - 1) * 10, page * 10);
});

getAuthor(Number(props.id));
onBeforeUnmount(clearAuthor);
</script>
