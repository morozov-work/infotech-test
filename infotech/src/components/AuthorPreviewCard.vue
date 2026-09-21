<template>
  <v-card
    :to="author.id != null ? { name: 'author', params: { id: author.id } } : undefined"
    variant="outlined"
    class="h-100 pa-3"
  >
    <v-card-title class="text-wrap">{{ author.full_name }}</v-card-title>
  </v-card>
</template>

<script setup lang="ts">
import type { AuthorShort } from '@/types';

defineProps<{ author: AuthorShort }>();
</script>
