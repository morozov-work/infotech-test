<template>
  <section>
    <h1>{{ $t('book.title', { id }) }}</h1>
    <div class="cover-placeholder" role="img">
      {{ $t('common.cover') }}
    </div>
    <h2>{{ $t('common.description') }}</h2>
    <p>{{ $t('book.description') }}</p>
    <h2>{{ $t('common.authors') }}</h2>
    <p>{{ $t('book.authors') }}</p>
    <RouterLink v-if="auth.isAuthenticated" :to="{ name: 'book-edit', params: { id } }">{{
      $t('book.edit')
    }}</RouterLink>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores';

defineProps<{ id: string }>();
const auth = useAuthStore();
</script>
