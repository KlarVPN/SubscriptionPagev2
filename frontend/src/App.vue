<script setup lang="ts">
import { onMounted } from 'vue'

import { bootstrapApp } from './lib/bootstrap'

onMounted(() => {
    bootstrapApp()
})
</script>

<template>
  <RouterView />
</template>
