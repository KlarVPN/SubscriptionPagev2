<script setup lang="ts">
import { onMounted } from 'vue'
import { Toaster } from 'vue-sonner'

import { bootstrapApp } from './lib/bootstrap'

onMounted(() => {
  bootstrapApp()
})
</script>

<template>
  <RouterView />
  <Toaster richColors position="top-right" theme="dark" />
</template>
