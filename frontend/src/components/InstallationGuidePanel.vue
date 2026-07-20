<script setup lang="ts">
import type {
  TSubscriptionPageAppConfig,
  TSubscriptionPageButtonConfig,
  TSubscriptionPagePlatformKey,
} from '@remnawave/subscription-page-types'

import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import { useSubscriptionLink } from '@/composables/use-subscription-link'
import { useTranslation } from '@/composables/use-translation'
import { detectPlatform } from '@/lib/platform'
import { copyText } from '@/shared/utils/clipboard'
import { TemplateEngine } from '@/shared/utils/template-engine'
import { vibrate } from '@/shared/utils/vibrate'
import { useAppConfigStore } from '@/stores/app-config'
import { useSubscriptionStore } from '@/stores/subscription'
import GuideBlockItem from './GuideBlockItem.vue'

const appConfigStore = useAppConfigStore()
const subscriptionStore = useSubscriptionStore()
const { t, currentLang, baseTranslations } = useTranslation()
const { config } = storeToRefs(appConfigStore)
const { subscription } = storeToRefs(subscriptionStore)
const { subscriptionUrl } = useSubscriptionLink()

const selectedPlatform = ref<null | TSubscriptionPagePlatformKey>(null)
const selectedAppIndex = ref(0)

const variant = computed(() => config.value?.uiConfig.installationGuidesBlockType ?? 'cards')

const availablePlatforms = computed(() => {
  if (!config.value) return []

  return Object.entries(config.value.platforms)
    .filter(([, platform]) => platform.apps.length > 0)
    .map(([key, platform]) => ({
      value: key as TSubscriptionPagePlatformKey,
      label: t(platform.displayName),
      iconHtml: config.value?.svgLibrary[platform.svgIconKey] ?? '',
    }))
})

watch(
  availablePlatforms,
  (platforms) => {
    if (!platforms.length) return

    if (
      selectedPlatform.value &&
      platforms.some((platform) => platform.value === selectedPlatform.value)
    ) {
      return
    }

    const detected = detectPlatform()
    selectedPlatform.value =
      detected && platforms.some((platform) => platform.value === detected)
        ? detected
        : (platforms[0]?.value ?? null)
  },
  { immediate: true },
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

function handleAppSelect(index: number) {
  vibrate('toggle')
  selectedAppIndex.value = index
}

function handleButtonClick(button: TSubscriptionPageButtonConfig) {
  if (!subscription.value) return

  const metaInfo = {
    username: subscription.value.user.username,
    subscriptionUrl: subscriptionUrl.value,
  }

  const formattedUrl =
    button.type === 'subscriptionLink' || button.type === 'copyButton'
      ? TemplateEngine.formatWithMetaInfo(button.link, metaInfo)
      : button.link

  vibrate('tap')

  if (button.type === 'copyButton') {
    copyText(formattedUrl)
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
    class="rounded-[24px] border border-white/10 bg-[rgba(17,22,31,0.78)] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.24)] sm:p-6"
  >
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div class="max-w-[32rem]">
        <h2 class="m-0 text-[1.05rem] font-semibold leading-tight">
          {{ t(baseTranslations.installationGuideHeader) }}
        </h2>
        <p class="m-0 mt-1 text-sm leading-[1.55] text-white/70">
          Choose your device and follow the steps.
        </p>
      </div>

      <div v-if="availablePlatforms.length > 1" class="flex flex-col gap-2 sm:items-end">
        <div
          class="inline-flex w-full items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-cyan-100 sm:w-auto"
        >
          <span class="grid h-[18px] w-[18px] place-items-center rounded-full bg-white/10 text-[0.65rem]">
            {{ availablePlatforms.length }}
          </span>
          <span>Platforms</span>
        </div>

        <label class="inline-flex w-full items-center gap-2 rounded-[16px] border border-white/10 bg-white/5 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:w-auto">
          <span
            class="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center text-cyan-300 [&>svg]:h-[18px] [&>svg]:w-[18px]"
            v-html="
              selectedPlatformConfig
                ? (config.svgLibrary[selectedPlatformConfig.svgIconKey] ?? '')
                : ''
            "
          />
          <select
            v-model="selectedPlatform"
            class="w-full min-w-[160px] bg-transparent text-white outline-none [&>option]:text-black"
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
    </div>

    <div class="mb-5 flex gap-2.5 overflow-x-auto pb-1">
      <button
        v-for="(app, index) in selectedPlatformConfig.apps"
        :key="app.name"
        :class="[
          'inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-[18px] border border-white/10 bg-white/5 px-4 py-[0.78rem] text-sm text-white transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/10',
          index === selectedAppIndex
            ? 'border-cyan-400/30 bg-gradient-to-br from-cyan-400/15 to-violet-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]'
            : '',
          app.featured ? 'shadow-[inset_0_0_0_1px_rgba(250,176,5,0.1)]' : '',
        ]"
        type="button"
        @click="handleAppSelect(index)"
      >
        <span
          v-if="app.svgIconKey"
          class="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center text-cyan-300 [&>svg]:h-[18px] [&>svg]:w-[18px]"
          v-html="config.svgLibrary[app.svgIconKey] ?? ''"
        />
        <span>{{ app.name }}</span>
        <span
          v-if="app.featured"
          class="rounded-full bg-amber-500/15 px-1.5 py-[0.18rem] text-[0.7rem] font-bold text-amber-300"
        >
          Featured
        </span>
      </button>
    </div>

    <div class="grid gap-3.5">
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
