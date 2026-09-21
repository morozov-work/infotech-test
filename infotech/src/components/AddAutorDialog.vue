<template>
  <v-dialog v-model="show" max-width="600" :persistent="loading">
    <v-card :title="$t('actions.addAutor')">
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
import { useRouter } from 'vue-router';

const show = defineModel<boolean>({ default: false });
const { t } = useI18n();
const loading = ref(false);
const error = ref('');
const router = useRouter();
const fullName = ref('');

const save = async () => {
  if (loading.value) return;
  error.value = '';
  if (!fullName.value.trim()) {
    error.value = t('form.authorRequired');
    return;
  }
  loading.value = true;
  try {
    const body = { full_name: fullName.value.trim() };
    const response = await api.createAutor(body);
    if (!response.success || !response.data) throw new Error();
    await router.push({ name: 'author', params: { id: response.data.id } });
    show.value = false;
  } catch {
    error.value = t('actions.error');
  } finally {
    loading.value = false;
  }
};
</script>
