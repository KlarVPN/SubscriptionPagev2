<script setup lang="ts">
import { Languages } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useAppConfigStore } from '@/stores/app-config'

const appConfigStore = useAppConfigStore()
const { currentLang, config } = storeToRefs(appConfigStore)

const language = computed({
  get: () => currentLang.value,
  set: (value) => {
    appConfigStore.setLanguage(value)
  },
})

const locales = computed(() => config.value?.locales ?? [])
</script>

<template>
  <div
    class="inline-flex items-center gap-3 rounded-[18px] border border-white/10 bg-[rgba(17,22,31,0.72)] px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
  >
    <Languages class="h-[18px] w-[18px] shrink-0 text-cyan-400" />

    <label class="flex flex-col gap-1">
      <span class="text-[0.72rem] uppercase tracking-[0.08em] text-white/60">Language</span>
      <select
        v-model="language"
        class="min-w-[120px] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-cyan-400/45 focus:ring-2 focus:ring-cyan-400/10 [&>option]:text-black"
      >
        <option v-for="locale in locales" :key="locale" :value="locale">
          {{ locale.toUpperCase() }}
        </option>
      </select>
    </label>
  </div>
</template>
