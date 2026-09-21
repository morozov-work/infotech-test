import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { LoginRequest, User } from '@/types';
import { api } from '@api';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null);
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => Boolean(accessToken.value));
  const loading = ref<boolean>(false);
  const error = ref<boolean>(false);

  const login = async (data: LoginRequest) => {
    if (loading.value) return;
    loading.value = true;
    error.value = false;
    try {
      const response = await api.login(data);
      accessToken.value = response.data?.token ?? null;
      user.value = response.data?.user ?? null;
      if (accessToken.value) localStorage.setItem('accessToken', accessToken.value);
    } catch {
      error.value = true;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    accessToken.value = null;
    user.value = null;
    localStorage.removeItem('accessToken');
  };

  const restoreToken = async () => {
    accessToken.value = localStorage.getItem('accessToken');
    if (!accessToken.value) return;
    try {
      const response = await api.getUser();
      user.value = response.data ?? null;
    } catch {
      logout();
    }
  };

  const toggleSubscription = async (id: number) => {
    const response = user.value?.subscriptions?.includes(id)
      ? await api.unsubscribeAuthor(id)
      : await api.subscribeAuthor(id);
    user.value = response.data ?? null;
  };

  return {
    accessToken,
    user,
    isAuthenticated,
    loading,
    error,
    restoreToken,
    toggleSubscription,
    login,
    logout,
  };
});
