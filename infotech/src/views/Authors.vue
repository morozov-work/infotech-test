<template>
  <section>
    <v-row v-if="items.length" class="justify-center">
      <v-col v-for="author in items" :key="author.id" cols="12" md="6">
        <AuthorPreviewCard :author="author" />
      </v-col>
    </v-row>
    <NoData v-else-if="authors && !loading" :message="$t('authors.empty')" />
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthorsStore, useUiStore } from '@/stores';
import NoData from '@/components/NoData.vue';
import AuthorPreviewCard from '@/components/AuthorPreviewCard.vue';

const { authors } = storeToRefs(useAuthorsStore());
const { getAuthors, clearAuthors } = useAuthorsStore();
const { loading } = storeToRefs(useUiStore());
const items = computed(() => authors.value?.items ?? []);

const route = useRoute();
watch(
  () => route.query.page,
  (value) => getAuthors({ page: Math.max(1, Number(value) || 1) }),
  { immediate: true },
);
onBeforeUnmount(clearAuthors);
</script>
