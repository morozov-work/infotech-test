<template>
  <v-select
    v-model="theme"
    :items="items"
    variant="solo"
    density="compact"
    max-width="40"
    menu-icon=""
    hide-details
    flat
    @update:modelValue="setTheme(theme)"
  >
    <template #selection></template>
    <template #prepend-inner>
      <v-icon :icon="mdiThemeLightDark" size="small" />
    </template>
  </v-select>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { Theme } from '@/types';
import { useUiStore } from '@/stores';
import { mdiThemeLightDark } from '@mdi/js';

const { t } = useI18n();

const items = [
  { title: t('theme.auto'), value: Theme.AUTO },
  { title: t('theme.light'), value: Theme.LIGHT },
  { title: t('theme.dark'), value: Theme.DARK },
];

const { theme } = storeToRefs(useUiStore());
const { setTheme } = useUiStore();
</script>
