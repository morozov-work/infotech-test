<template>
  <v-dialog v-model="show" max-width="600" :persistent="loading">
    <v-card :title="$t('actions.addBook')">
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
import { useRouter } from 'vue-router';
import type { AuthorShort } from '@/types';

const show = defineModel<boolean>({ default: false });
const { t } = useI18n();
const loading = ref(false);
const error = ref('');
const router = useRouter();
const title = ref('');
const year = ref(new Date().getFullYear());
const description = ref('');
const isbn = ref('');
const cover = ref<File | File[] | null>(null);
const authors = ref<AuthorShort[]>([]);
const authorIds = ref<number[]>([]);

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
  const file = Array.isArray(cover.value) ? cover.value[0] : cover.value;
  if (
    !title.value.trim() ||
    !Number.isInteger(year.value) ||
    year.value < 1 ||
    !authorIds.value.length ||
    !file
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
    const response = await api.createBook({ ...body, cover: file });
    if (!response.success || !response.data) throw new Error();
    await router.push({ name: 'book', params: { id: response.data.id } });
    show.value = false;
  } catch {
    error.value = t('actions.error');
  } finally {
    loading.value = false;
  }
};
</script>
