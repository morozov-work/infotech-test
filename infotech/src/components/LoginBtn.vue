<template>
  <v-btn @click="onClick">
    <v-icon :icon="icon" />
    <v-tooltip activator="parent" location="bottom">{{ tooltip }}</v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores';
import { mdiLogin, mdiLogout } from '@mdi/js';

const { t } = useI18n();
const { accessToken, isAuthenticated } = storeToRefs(useAuthStore());

const icon = computed(() => (isAuthenticated.value ? mdiLogout : mdiLogin));
const tooltip = computed(() => (isAuthenticated.value ? t('auth.logout') : t('auth.login')));

const onClick = () => {
  // oxlint-disable-next-line no-unused-expressions
  isAuthenticated.value ? (accessToken.value = null) : (accessToken.value = 'login');
};
</script>
