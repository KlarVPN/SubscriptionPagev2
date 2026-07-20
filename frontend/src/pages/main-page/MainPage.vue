<script setup lang="ts">
import KlarLogo from '@/components/KlarLogo.vue'
import { LoaderCircle } from 'lucide-vue-next'
import { computed } from 'vue'

import InstallationGuidePanel from '@/components/InstallationGuidePanel.vue'
import LanguagePicker from '@/components/LanguagePicker.vue'
import RawKeysPanel from '@/components/RawKeysPanel.vue'
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
  <div class="relative min-h-screen text-white">
    <div class="pointer-events-none absolute inset-0 bg-black opacity-80" />

    <div class="relative z-10 min-h-screen">
      <template v-if="ready">
        <header class="w-full flex items-center justify-center">
          <div class="flex min-w-0 w-full items-center justify-center gap-2 pt-12">
            <KlarLogo class="size-12 shrink-0 p-1 object-contain" />
          </div>
        </header>

        <main class="mx-auto w-full max-w-145 pb-8 pt-12 grid gap-4">
          <SubscriptionInfoPanel />
          <InstallationGuidePanel />
          <RawKeysPanel />

          <div class="flex justify-center pt-2 pb-1">
            <LanguagePicker />
          </div>
        </main>
      </template>

      <div v-else class="grid min-h-[calc(100vh-80px)] place-items-center p-8" aria-live="polite">
        <div
          class="flex items-center gap-3 rounded-[18px] border border-white/10 bg-[rgba(17,22,31,0.78)] px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
        >
          <LoaderCircle class="h-7 w-7 shrink-0 animate-spin text-cyan-400" />
          <div>
            <div class="font-semibold">Loading subscription page</div>
            <div class="text-sm text-white/70">Preparing the preview and config...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
