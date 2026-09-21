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
import { useRouter } from 'vue-router';

const { t } = useI18n();
const { isAuthenticated } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();
const router = useRouter();

const icon = computed(() => (isAuthenticated.value ? mdiLogout : mdiLogin));
const tooltip = computed(() => (isAuthenticated.value ? t('auth.logout') : t('auth.login')));

const onClick = () => {
  if (isAuthenticated.value) {
    logout();
  } else {
    router.push('/login');
  }
};
</script>
