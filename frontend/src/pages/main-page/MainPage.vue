<script setup lang="ts">
import KlarLogo from '@/components/KlarLogo.vue'
import { LoaderCircle } from 'lucide-vue-next'
import { computed } from 'vue'

import InstallationGuidePanel from '@/components/InstallationGuidePanel.vue'
import LanguagePicker from '@/components/LanguagePicker.vue'
import SubscriptionInfoPanel from '@/components/SubscriptionInfoPanel.vue'
import { useAppConfigStore } from '@/stores/app-config'
import { useSubscriptionStore } from '@/stores/subscription'

const appConfigStore = useAppConfigStore()
const subscriptionStore = useSubscriptionStore()

const ready = computed(
  () =>
    appConfigStore.isLoaded &&
    Boolean(appConfigStore.config) &&
    Boolean(subscriptionStore.subscription),
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

          <div class="flex justify-center pt-2 pb-1">
            <LanguagePicker />
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
