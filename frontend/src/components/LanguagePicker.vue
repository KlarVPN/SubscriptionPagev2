<script setup lang="ts">
import type { TSubscriptionPageLanguageCode } from '@remnawave/subscription-page-types'

import { Check, ChevronDown, Languages } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'

import { useTranslation } from '@/composables/use-translation'
import { useAppConfigStore } from '@/stores/app-config'

const appConfigStore = useAppConfigStore()
const { uiT } = useTranslation()
const { currentLang, config } = storeToRefs(appConfigStore)

const language = computed<TSubscriptionPageLanguageCode | undefined>({
  get: () => currentLang.value,
  set: (value) => {
    if (value) {
      appConfigStore.setLanguage(value)
    }
  },
})

const locales = computed(() => config.value?.locales ?? [])

function formatLanguageName(locale: TSubscriptionPageLanguageCode): string {
  if (typeof Intl.DisplayNames !== 'undefined') {
    const displayName = new Intl.DisplayNames([locale], { type: 'language' }).of(locale)

    if (displayName) {
      return displayName.charAt(0).toLocaleUpperCase(locale) + displayName.slice(1)
    }
  }

  return locale.toUpperCase()
}

const languageOptions = computed(() =>
  locales.value.map((locale) => ({
    value: locale,
    label: formatLanguageName(locale),
  })),
)
</script>

<template>
  <div v-if="languageOptions.length > 1" class="flex justify-center">
    <SelectRoot v-model="language">
      <SelectTrigger
        :aria-label="uiT('selectLanguage')"
        class="inline-flex min-w-[200px] items-center gap-3 rounded-full  bg-neutral-900 px-4 py-3 text-sm font-medium text-white shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition hover:border-cyan-400/30 hover:bg-white/10 focus:outline-none"
      >
        <Languages class="h-4 w-4 shrink-0 text-white" />
        <SelectValue class="min-w-0 flex-1 truncate text-left" />
        <ChevronDown class="h-4 w-4 shrink-0 text-white/50" />
      </SelectTrigger>

      <SelectPortal>
        <SelectContent
          class="z-50 overflow-hidden rounded-[18px] bg-neutral-900 mb-px p-2"
          position="popper"
          :side-offset="8"
        >
          <SelectViewport class="min-w-[var(--reka-select-trigger-width)] p-1">
            <SelectItem
              v-for="option in languageOptions"
              :key="option.value"
              :value="option.value"
              class="flex cursor-pointer items-center gap-3 rounded-[14px] px-3 py-2 text-sm text-white outline-none transition data-[highlighted]:bg-white/10 data-[state=checked]:bg-neutral-400/10 data-[state=checked]:text-neutral-100"
            >
              <SelectItemText class="flex-1">
                {{ option.label }}
              </SelectItemText>

              <SelectItemIndicator class="text-neutral-300">
                <Check class="h-4 w-4" />
              </SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>
