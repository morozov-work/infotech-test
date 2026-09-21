<template>
  <v-dialog v-model="show" max-width="600" :persistent="loading">
    <v-card :title="$t('actions.editAutor')">
      <v-form :disabled="loading" @submit.prevent="save">
        <v-card-text>
          <v-text-field v-model="fullName" :label="$t('form.authorName')" required />
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
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { api } from '@api';
import { useAuthorsStore } from '@/stores';
import type { Author } from '@/types';

const props = defineProps<{ author: Author }>();

const show = defineModel<boolean>({ default: false });
const { t } = useI18n();
const loading = ref(false);
const error = ref('');
const store = useAuthorsStore();
const fullName = ref(props.author.full_name ?? '');

const save = async () => {
  if (loading.value) return;
  error.value = '';
  if (props.author.id == null) return;
  if (!fullName.value.trim()) {
    error.value = t('form.authorRequired');
    return;
  }
  loading.value = true;
  try {
    const body = { full_name: fullName.value.trim() };
    const response = await api.updateAutor(props.author.id, body);
    if (!response.success || !response.data) throw new Error();
    store.author = response.data;
    show.value = false;
  } catch {
    error.value = t('actions.error');
  } finally {
    loading.value = false;
  }
};
</script>
