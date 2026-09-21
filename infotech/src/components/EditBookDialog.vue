<template>
  <v-dialog v-model="show" max-width="600" :persistent="loading">
    <v-card :title="$t('actions.editBook')">
      <v-form :disabled="loading" @submit.prevent="save">
        <v-card-text>
          <v-text-field v-model="title" :label="$t('form.title')" required />
          <v-text-field
            v-model.number="year"
            :label="$t('yearLabel')"
            type="number"
            min="1"
            required
          />
          <v-select
            v-model="authorIds"
            :items="authors"
            item-title="full_name"
            item-value="id"
            :label="$t('nav.authors')"
            multiple
          />
          <v-textarea v-model="description" :label="$t('book.description')" />
          <v-text-field v-model="isbn" label="ISBN" />
          <v-file-input v-model="cover" :label="$t('form.cover')" accept="image/*" />
          <v-alert v-if="error" type="error" variant="tonal">{{ error }}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="loading" @click="show = false">{{ $t('actions.cancel') }}</v-btn>
          <v-btn type="submit" :loading="loading" :disabled="loading">{{
            $t('actions.save')
          }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { api } from '@api';
import { useBooksStore } from '@/stores';
import type { Book, AuthorShort } from '@/types';

const props = defineProps<{ book: Book }>();

const show = defineModel<boolean>({ default: false });
const { t } = useI18n();
const loading = ref(false);
const error = ref('');
const store = useBooksStore();
const title = ref(props.book.title ?? '');
const year = ref(props.book.year ?? new Date().getFullYear());
const description = ref(props.book.description ?? '');
const isbn = ref(props.book.isbn ?? '');
const cover = ref<File | File[] | null>(null);
const authors = ref<AuthorShort[]>([]);
const authorIds = ref<number[]>(
  (props.book.authors ?? []).flatMap((author) => (author.id == null ? [] : [author.id])),
);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await api.getAutors();
    authors.value = response.data?.items ?? [];
    const pages = response.data?.pagination?.total_pages ?? 1;
    for (let page = 2; page <= pages; page++) {
      const response = await api.getAutors({ page });
      authors.value.push(...(response.data?.items ?? []));
    }
  } catch {
    error.value = t('actions.error');
  } finally {
    loading.value = false;
  }
});

const save = async () => {
  if (loading.value) return;
  error.value = '';
  if (props.book.id == null) return;
  const file = Array.isArray(cover.value) ? cover.value[0] : cover.value;
  if (
    !title.value.trim() ||
    !Number.isInteger(year.value) ||
    year.value < 1 ||
    !authorIds.value.length
  ) {
    error.value = t('form.required');
    return;
  }
  loading.value = true;
  try {
    const body = {
      title: title.value.trim(),
      year: year.value,
      description: description.value,
      isbn: isbn.value,
      author_ids: authorIds.value,
    };
    const response = file
      ? await api.updateBook(props.book.id, { ...body, cover: file })
      : await api.patchBook(props.book.id, body);
    if (!response.success || !response.data) throw new Error();
    store.book = response.data;
    show.value = false;
  } catch {
    error.value = t('actions.error');
  } finally {
    loading.value = false;
  }
};
</script>
