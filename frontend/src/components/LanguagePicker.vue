<script setup lang="ts">
import { Languages } from 'lucide-vue-next'
import { computed } from 'vue'

import { useAppConfigStore } from '../stores/app-config'

const appConfigStore = useAppConfigStore()

const language = computed({
    get: () => appConfigStore.currentLang,
    set: (value) => {
        appConfigStore.setLanguage(value)
    }
})

const locales = computed(() => appConfigStore.config?.locales ?? [])
</script>

<template>
  <div class="language-picker">
    <Languages class="language-icon" />

    <label class="language-select-wrap">
      <span class="language-label">Language</span>
      <select
        v-model="language"
        class="language-select"
      >
        <option
          v-for="locale in locales"
          :key="locale"
          :value="locale"
        >
          {{ locale.toUpperCase() }}
        </option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.language-picker {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0.9rem;
    border-radius: 18px;
    background: rgba(17, 22, 31, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18);
}

.language-icon {
    width: 18px;
    height: 18px;
    color: #22d3ee;
    flex: 0 0 auto;
}

.language-select-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.language-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.58);
}

.language-select {
    background: rgba(255, 255, 255, 0.03);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 0.5rem 0.75rem;
    min-width: 120px;
    outline: none;
}

.language-select:focus {
    border-color: rgba(34, 211, 238, 0.45);
    box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.1);
}
</style>
