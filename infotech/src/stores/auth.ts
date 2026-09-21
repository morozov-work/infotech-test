import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null);
  const isAuthenticated = computed(() => Boolean(accessToken.value));

  return { accessToken, isAuthenticated };
});
