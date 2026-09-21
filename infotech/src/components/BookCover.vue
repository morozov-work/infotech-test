<template>
  <img class="book-cover" :src="failed || !src ? fallbackCover : src" @error="failed = true" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ src?: string }>();
const fallbackCover = `${import.meta.env.BASE_URL}cover.svg`;
const failed = ref(false);

watch(
  () => props.src,
  () => {
    failed.value = false;
  },
);
</script>

<style scoped>
.book-cover {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
