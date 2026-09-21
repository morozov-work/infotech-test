<template>
  <v-dialog v-model="show" max-width="600" :persistent="loading">
    <v-card :title="$t('actions.removeAutor')">
      <v-form :disabled="loading" @submit.prevent="remove">
        <v-card-text>
          <p>{{ $t('actions.confirmDelete') }}</p>
          <p>{{ author.full_name }}</p>
          <v-alert v-if="error" type="error" variant="tonal">{{ error }}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="loading" @click="show = false">{{ $t('actions.cancel') }}</v-btn>
          <v-btn type="submit" :loading="loading" :disabled="loading" color="error">{{
            $t('actions.delete')
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
import { useRouter } from 'vue-router';
import type { Author } from '@/types';

const props = defineProps<{ author: Author }>();

const show = defineModel<boolean>({ default: false });
const { t } = useI18n();
const loading = ref(false);
const error = ref('');
const router = useRouter();

const remove = async () => {
  if (loading.value) return;
  error.value = '';
  if (props.author.id == null) return;
  loading.value = true;
  try {
    await api.deleteAutor(props.author.id);
    show.value = false;
    await router.push({ name: 'authors' });
  } catch {
    error.value = t('actions.error');
  } finally {
    loading.value = false;
  }
};
</script>
