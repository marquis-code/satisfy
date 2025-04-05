<template>
  <main>
    <!-- Position the toast fixed to ensure it's always on top and aligned to the right -->
    <CoreToast class="fixed top-4 right-4 z-[9999999]" />

    <NuxtLayout class="z-10">
      <NuxtPage class="z-10" />
    </NuxtLayout>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lexend+Tera:wght@100..900&family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap');
</style>


<script setup lang="ts">
import { provide } from 'vue';
import { visible, toastData, useCustomToast } from '@/composables/core/useCustomToast';

// Provide the toast state globally
provide('toastVisible', visible);
provide('toastData', toastData);
</script>
