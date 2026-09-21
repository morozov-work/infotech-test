<template>
  <section>
    <v-row class="justify-center align-center">
      <span class="text-center">{{ $t('nav.topAuthors') }}</span>
      <v-btn size="sm" rounded :disabled="loading || year <= bottomYear" @click="decrementYear"
        >-</v-btn
      >
      <span>{{ year }}</span>
      <v-btn size="sm" rounded :disabled="loading || year >= topYear" @click="incrementYear"
        >+</v-btn
      >
    </v-row>
    <v-row class="justify-center items-center">
      <v-col cols="12" md="6">
        <div v-if="items.length" class="d-flex flex-column ga-4">
          <AuthorPreviewCard
            v-for="author in items"
            :key="author.author_id"
            :author="{ id: author.author_id, full_name: author.full_name }"
          >
            <p>{{ $t('report.place') }}: {{ author.rank }}</p>
            <p>{{ $t('report.booksCount') }}: {{ author.books_count }}</p>
          </AuthorPreviewCard>
        </div>
        <NoData v-else-if="topAuthors && !loading" :message="$t('authors.empty')" />
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthorsStore, useUiStore } from '@/stores';
import AuthorPreviewCard from '@/components/AuthorPreviewCard.vue';
import NoData from '@/components/NoData.vue';

const { topAuthors } = storeToRefs(useAuthorsStore());
const { getTopAuthors, clearTopAuthors } = useAuthorsStore();
const { loading } = storeToRefs(useUiStore());
const year = ref(new Date().getFullYear());
const items = computed(() => topAuthors.value?.items ?? []);

const bottomYear = 1990;
const topYear = new Date().getFullYear();

const decrementYear = () => {
  if (year.value <= bottomYear) return;
  year.value--;
};

const incrementYear = () => {
  if (year.value >= topYear) return;
  year.value++;
};

watch(year, (value) => getTopAuthors(value), { immediate: true });
onBeforeUnmount(clearTopAuthors);
</script>
