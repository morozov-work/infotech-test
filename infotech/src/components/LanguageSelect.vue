<template>
  <v-select
    v-model="$i18n.locale"
    :items="items"
    variant="solo"
    density="compact"
    max-width="80"
    menu-icon=""
    hide-details
    flat
    @update:modelValue="setLang($i18n.locale as Lang)"
  >
    <template v-slot:prepend-inner>
      <v-icon :icon="mdiWeb" size="small" />
    </template>
  </v-select>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '@/stores';
import { mdiWeb } from '@mdi/js';
import { Lang } from '@types';

const i18n = useI18n();

const { setLang } = useUiStore();

const items = computed(() =>
  i18n.availableLocales.map((locale) => {
    return {
      title: i18n.t(`lang.${locale}`),
      value: locale,
    };
  }),
);
</script>
