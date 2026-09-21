<template>
  <v-responsive>
    <v-app :theme="theme">
      <v-app-bar class="px-4">
        <v-btn to="/books" class="mr-4">{{ $t('nav.books') }}</v-btn>
        <v-btn to="/authors" class="mr-4">{{ $t('nav.authors') }}</v-btn>
        <v-btn to="/reports/top-authors">{{ $t('nav.topAuthors') }}</v-btn>

        <v-spacer />

        <LanguageSelect />
        <ThemeSelect />
        <LoginBtn />
      </v-app-bar>

      <v-main>
        <v-container>
          <LoadingOverlay v-model="loading" />
          <RouterView :key="$route.path" />
        </v-container>
      </v-main>
      <AppFooter />
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { storeToRefs } from 'pinia';
import LanguageSelect from '@/components/LanguageSelect.vue';
import ThemeSelect from '@/components/ThemeSelect.vue';
import LoginBtn from '@/components/LoginBtn.vue';
import LoadingOverlay from '@components/LoadingOverlay.vue';
import { useAuthStore, useUiStore } from '@/stores';
import AppFooter from '@/components/AppFooter.vue';

const { theme, loading } = storeToRefs(useUiStore());
const { restoreToken } = useAuthStore();

restoreToken();
</script>
