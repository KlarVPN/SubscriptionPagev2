<script setup lang="ts">
import KlarLogo from '@/components/KlarLogo.vue'
import { LifeBuoy, LoaderCircle } from 'lucide-vue-next'
import { computed } from 'vue'

import InstallationGuidePanel from '@/components/InstallationGuidePanel.vue'
import FaqPanel from '@/components/FaqPanel.vue'
import LanguagePicker from '@/components/LanguagePicker.vue'
import SubscriptionInfoPanel from '@/components/SubscriptionInfoPanel.vue'
import { useTranslation } from '@/composables/use-translation'
import { useAppConfigStore } from '@/stores/app-config'
import { useSubscriptionStore } from '@/stores/subscription'

const appConfigStore = useAppConfigStore()
const subscriptionStore = useSubscriptionStore()
const { uiT } = useTranslation()

const ready = computed(
  () =>
    appConfigStore.isLoaded &&
    Boolean(appConfigStore.config) &&
    Boolean(subscriptionStore.subscription),
)

const supportUrl = computed(
  () => appConfigStore.config?.brandingSettings?.supportUrl ?? '',
)
</script>

<template>
  <div class="relative min-h-screen overflow-x-clip text-white p-4">
    <div class="pointer-events-none absolute inset-0 bg-black opacity-80" />

    <div class="relative z-10">
      <template v-if="ready">
        <header class="flex min-w-0 w-full items-center justify-center gap-2 py-6">
            <KlarLogo class="size-12 shrink-0 p-1 object-contain" />
        </header>

        <main class="mx-auto grid w-full max-w-145 gap-4">
          <SubscriptionInfoPanel />
          <InstallationGuidePanel />
          <FaqPanel />

          <div class="flex flex-wrap items-center justify-center gap-3 pt-2 pb-1">
            <LanguagePicker />

            <a
              v-if="supportUrl"
              :href="supportUrl"
              class="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-white/15 focus:outline-none"
              rel="noopener noreferrer"
              target="_blank"
            >
              <LifeBuoy class="h-4 w-4 shrink-0" />
              {{ uiT('support') }}
            </a>
          </div>
        </main>
      </template>

      <div v-else class="grid min-h-[calc(100vh-80px)] place-items-center p-8" aria-live="polite">
        <div class="flex items-center gap-3 px-5 py-4">
          <LoaderCircle class="h-7 w-7 shrink-0 animate-spin text-white" />
        </div>
      </div>
    </div>
  </div>
</template>
