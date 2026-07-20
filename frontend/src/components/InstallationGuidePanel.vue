<script setup lang="ts">
import type { TSubscriptionPageAppConfig, TSubscriptionPageButtonConfig, TSubscriptionPagePlatformKey } from '@remnawave/subscription-page-types'

import { computed, ref, watch } from 'vue'

import { constructSubscriptionUrl } from '../shared/utils/construct-subscription-url'
import { TemplateEngine } from '../shared/utils/template-engine'
import { useTranslation } from '../composables/use-translation'
import { useSubscriptionStore } from '../stores/subscription'
import { useAppConfigStore } from '../stores/app-config'
import GuideBlockItem from './GuideBlockItem.vue'
import { vibrate } from '../shared/utils/vibrate'
import { detectPlatform } from '../lib/platform'

const appConfigStore = useAppConfigStore()
const subscriptionStore = useSubscriptionStore()
const { t, currentLang, baseTranslations } = useTranslation()

const selectedPlatform = ref<null | TSubscriptionPagePlatformKey>(null)
const selectedAppIndex = ref(0)

const config = computed(() => appConfigStore.config)
const subscription = computed(() => subscriptionStore.subscription)
const variant = computed(() => config.value?.uiConfig.installationGuidesBlockType ?? 'cards')

const availablePlatforms = computed(() => {
    if (!config.value) return []

    return Object.entries(config.value.platforms)
        .filter(([, platform]) => platform.apps.length > 0)
        .map(([key, platform]) => ({
            value: key as TSubscriptionPagePlatformKey,
            label: t(platform.displayName),
            iconHtml: config.value?.svgLibrary[platform.svgIconKey] ?? ''
        }))
})

watch(
    availablePlatforms,
    (platforms) => {
        if (!platforms.length) return

        if (selectedPlatform.value && platforms.some((platform) => platform.value === selectedPlatform.value)) {
            return
        }

        const detected = detectPlatform()
        selectedPlatform.value = detected && platforms.some((platform) => platform.value === detected)
            ? detected
            : platforms[0]?.value ?? null
    },
    { immediate: true }
)

watch(selectedPlatform, () => {
    selectedAppIndex.value = 0
})

const selectedPlatformConfig = computed(() => {
    if (!config.value || !selectedPlatform.value) return null

    return config.value.platforms[selectedPlatform.value] ?? null
})

const selectedApp = computed<null | TSubscriptionPageAppConfig>(() => {
    const platform = selectedPlatformConfig.value
    if (!platform) return null

    return platform.apps[selectedAppIndex.value] ?? platform.apps[0] ?? null
})

const subscriptionUrl = computed(() => {
    if (typeof window === 'undefined' || !subscription.value) return ''

    return constructSubscriptionUrl(window.location.href, subscription.value.user.shortUuid)
})

function handleButtonClick(button: TSubscriptionPageButtonConfig) {
    if (!subscription.value) return

    const metaInfo = {
        username: subscription.value.user.username,
        subscriptionUrl: subscriptionUrl.value
    }

    const formattedUrl =
        button.type === 'subscriptionLink' || button.type === 'copyButton'
            ? TemplateEngine.formatWithMetaInfo(button.link, metaInfo)
            : button.link

    vibrate('tap')

    if (button.type === 'copyButton') {
        navigator.clipboard?.writeText(formattedUrl)
        return
    }

    if (button.type === 'subscriptionLink') {
        window.open(formattedUrl, '_blank', 'noopener,noreferrer')
        return
    }

    window.open(formattedUrl, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <section
    v-if="config && subscription && baseTranslations && selectedPlatformConfig && selectedApp"
    class="rounded-[24px] border border-white/10 bg-[rgba(17,22,31,0.78)] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.24)]"
  >
    <div class="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row">
      <div>
        <h2 class="m-0 text-[1.05rem] font-semibold">
          {{ t(baseTranslations.installationGuideHeader) }}
        </h2>
        <p class="m-0 mt-1 text-sm text-white/70">
          Choose your device and follow the steps.
        </p>
      </div>

      <label
        v-if="availablePlatforms.length > 1"
        class="inline-flex w-full items-center gap-2 rounded-[14px] border border-white/10 bg-white/5 px-3 py-2 sm:w-auto"
      >
        <span
          class="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center [&>svg]:h-[18px] [&>svg]:w-[18px]"
          v-html="selectedPlatformConfig ? config.svgLibrary[selectedPlatformConfig.svgIconKey] ?? '' : ''"
        />
        <select
          v-model="selectedPlatform"
          class="w-full min-w-[150px] bg-transparent text-white outline-none [&>option]:text-black"
        >
          <option
            v-for="platform in availablePlatforms"
            :key="platform.value"
            :value="platform.value"
          >
            {{ platform.label }}
          </option>
        </select>
      </label>
    </div>

    <div class="mb-4 flex gap-2.5 overflow-x-auto pb-1">
      <button
        v-for="(app, index) in selectedPlatformConfig.apps"
        :key="app.name"
        :class="[
          'inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-[16px] border border-white/10 bg-white/5 px-4 py-[0.72rem] text-white transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/10',
          index === selectedAppIndex ? 'border-cyan-400/30 bg-gradient-to-br from-cyan-400/15 to-violet-500/10' : '',
          app.featured ? 'shadow-[inset_0_0_0_1px_rgba(250,176,5,0.1)]' : ''
        ]"
        type="button"
        @click="vibrate('toggle'); selectedAppIndex = index"
      >
        <span
          v-if="app.svgIconKey"
          class="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center [&>svg]:h-[18px] [&>svg]:w-[18px]"
          v-html="config.svgLibrary[app.svgIconKey] ?? ''"
        />
        <span>{{ app.name }}</span>
        <span
          v-if="app.featured"
          class="rounded-full bg-amber-500/15 px-1.5 py-[0.18rem] text-[0.7rem] font-bold text-amber-300"
        >Featured</span>
      </button>
    </div>

    <div class="grid gap-3">
      <GuideBlockItem
        v-for="(block, index) in selectedApp.blocks"
        :key="`${selectedApp.name}-${index}`"
        :block="block"
        :current-lang="currentLang"
        :index="index"
        :on-button-click="handleButtonClick"
        :svg-library="config.svgLibrary"
        :variant="variant"
      />
    </div>
  </section>
</template>
