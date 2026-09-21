<template>
  <v-footer app class="flex-wrap ga-3 py-3" border>
    <v-pagination
      v-if="pagination"
      :model-value="page"
      :length="Math.max(1, pagination.total_pages ?? 1)"
      :total-visible="5"
      :disabled="loading"
      @update:model-value="changePage"
    />

    <v-spacer />

    <v-btn v-if="showSubscribe" :loading="loading" :disabled="loading" @click="subscribe">
      {{ $t(isSubscribed ? 'author.unsubscribe' : 'author.subscribe') }}
    </v-btn>

    <v-btn
      v-if="isUser && isBooks"
      :disabled="loading"
      :loading="loading"
      @click="openAddBookDialog = true"
    >
      {{ $t('actions.addBook') }}
    </v-btn>

    <v-btn
      v-if="isUser && isBook && book"
      :disabled="loading"
      :loading="loading"
      @click="openEditBookDialog = true"
    >
      {{ $t('actions.editBook') }}
    </v-btn>

    <v-btn
      v-if="isUser && isBook && book"
      :disabled="loading"
      :loading="loading"
      @click="openRemoveBookDialog = true"
    >
      {{ $t('actions.removeBook') }}
    </v-btn>

    <v-btn
      v-if="isUser && isAutors"
      :disabled="loading"
      :loading="loading"
      @click="openAddAutorDialog = true"
    >
      {{ $t('actions.addAutor') }}
    </v-btn>

    <v-btn
      v-if="isUser && isAutor && author"
      :disabled="loading"
      :loading="loading"
      @click="openEditAutorDialog = true"
    >
      {{ $t('actions.editAutor') }}
    </v-btn>

    <v-btn
      v-if="isUser && isAutor && author"
      :disabled="loading"
      :loading="loading"
      @click="openRemoveAutorDialog = true"
    >
      {{ $t('actions.removeAutor') }}
    </v-btn>
    <v-alert v-if="error" type="error" variant="tonal">{{ error }}</v-alert>
    <AddBookDialog v-if="openAddBookDialog" v-model="openAddBookDialog" />
    <EditBookDialog v-if="openEditBookDialog && book" v-model="openEditBookDialog" :book="book" />
    <RemoveBookDialog
      v-if="openRemoveBookDialog && book"
      v-model="openRemoveBookDialog"
      :book="book"
    />
    <AddAutorDialog v-if="openAddAutorDialog" v-model="openAddAutorDialog" />
    <EditAutorDialog
      v-if="openEditAutorDialog && author"
      v-model="openEditAutorDialog"
      :author="author"
    />
    <RemoveAutorDialog
      v-if="openRemoveAutorDialog && author"
      v-model="openRemoveAutorDialog"
      :author="author"
    />
  </v-footer>
</template>

<script setup lang="ts">
import AddBookDialog from './AddBookDialog.vue';
import EditBookDialog from './EditBookDialog.vue';
import RemoveBookDialog from './RemoveBookDialog.vue';
import AddAutorDialog from './AddAutorDialog.vue';
import EditAutorDialog from './EditAutorDialog.vue';
import RemoveAutorDialog from './RemoveAutorDialog.vue';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useAuthStore, useAuthorsStore, useBooksStore } from '@/stores';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const auth = useAuthStore();
const { user, isAuthenticated } = storeToRefs(auth);
const booksStore = useBooksStore();
const authorsStore = useAuthorsStore();
const { books, book } = storeToRefs(booksStore);
const { authors, author } = storeToRefs(authorsStore);
const loading = ref(false);
const error = ref('');

const page = computed(() => Math.max(1, Number(route.query.page) || 1));
const pagination = computed(() => {
  if (route.name === 'books') return books.value?.pagination;
  if (route.name === 'authors') return authors.value?.pagination;
  if (route.name === 'author' && author.value)
    return { total_pages: Math.ceil((author.value.books?.length ?? 0) / 10) };
  return undefined;
});

const changePage = (value: number) =>
  router.replace({ query: { ...route.query, page: String(value) } });
watch(
  () => pagination.value?.total_pages,
  (total) => {
    if (total !== undefined && page.value > Math.max(1, total)) changePage(Math.max(1, total));
  },
);

const isUser = computed(() => user.value?.role === 'user');
const isBooks = computed(() => route.name === 'books');
const isAutors = computed(() => route.name === 'authors');
const isBook = computed(() => route.name === 'book');
const isAutor = computed(() => route.name === 'author');

const openAddBookDialog = ref<boolean>(false);
const openEditBookDialog = ref<boolean>(false);
const openRemoveBookDialog = ref<boolean>(false);
const openAddAutorDialog = ref<boolean>(false);
const openEditAutorDialog = ref<boolean>(false);
const openRemoveAutorDialog = ref<boolean>(false);

watch(
  () => route.path,
  () => {
    openAddBookDialog.value = false;
    openEditBookDialog.value = false;
    openRemoveBookDialog.value = false;
    openAddAutorDialog.value = false;
    openEditAutorDialog.value = false;
    openRemoveAutorDialog.value = false;
  },
);

const showSubscribe = computed(() => isAuthenticated.value && route.name === 'author');
const isSubscribed = computed(() => {
  return user.value?.subscriptions?.includes(Number(route.params.id)) || false;
});
const subscribe = async () => {
  loading.value = true;
  error.value = '';
  try {
    await auth.toggleSubscription(Number(route.params.id));
  } catch {
    error.value = t('actions.error');
  } finally {
    loading.value = false;
  }
};
</script>
