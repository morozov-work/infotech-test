<template>
  <section>
    <h1 class="text-center">{{ $t('auth.label') }}</h1>
    <v-row class="justify-center">
      <v-col cols="12" sm="8" md="4">
        <v-form @submit.prevent="onLogin">
          <v-text-field
            v-model="username"
            :label="$t('auth.username')"
            autocomplete="username"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="password"
            :label="$t('auth.password')"
            type="password"
            autocomplete="current-password"
            variant="outlined"
            required
          />
          <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{
            t('auth.error')
          }}</v-alert>
          <v-btn type="submit" :loading="loading" :disabled="!username || !password" block>
            {{ $t('auth.login') }}
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@stores';

const router = useRouter();
const { t } = useI18n();
const { login } = useAuthStore();
const { loading, error, isAuthenticated } = storeToRefs(useAuthStore());

const username = ref('');
const password = ref('');

const onLogin = async () => {
  await login({ username: username.value, password: password.value });
  if (!isAuthenticated.value) return;
  await router.replace('/books');
};
</script>
