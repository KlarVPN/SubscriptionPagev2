<script setup lang="ts">
import type {
  TSubscriptionPageAppConfig,
  TSubscriptionPageButtonConfig,
  TSubscriptionPagePlatformKey,
} from '@remnawave/subscription-page-types'

import { Monitor, Smartphone, Tv2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import { useSubscriptionLink } from '@/composables/use-subscription-link'
import { useTranslation } from '@/composables/use-translation'
import { copyText } from '@/shared/utils/clipboard'
import { TemplateEngine } from '@/shared/utils/template-engine'
import { vibrate } from '@/shared/utils/vibrate'
import { useAppConfigStore } from '@/stores/app-config'
import { useSubscriptionStore } from '@/stores/subscription'
import GuideBlockItem from './GuideBlockItem.vue'

const appConfigStore = useAppConfigStore()
const subscriptionStore = useSubscriptionStore()
const { t, currentLang, baseTranslations, uiT } = useTranslation()
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

type PlatformGroupKey = 'phones' | 'computers' | 'tvs'

type PlatformCard = {
  subtitle: string
  title: string
  value: TSubscriptionPagePlatformKey
  iconHtml: string
}

type PlatformGroup = {
  icon: typeof Smartphone
  key: PlatformGroupKey
  label: string
  platforms: PlatformCard[]
  columnsClass: string
}

function getPlatformGroupLabel(group: PlatformGroupKey): string {
  switch (group) {
    case 'phones':
      return uiT('phonesGroup')
    case 'computers':
      return uiT('computersGroup')
    default:
      return uiT('tvsGroup')
  }
}

function getGroupDefinition(group: PlatformGroupKey): Omit<PlatformGroup, 'label' | 'platforms'> & {
  platformKeys: TSubscriptionPagePlatformKey[]
} {
  switch (group) {
    case 'phones':
      return {
        key: group,
        icon: Smartphone,
        platformKeys: ['ios', 'android'],
        columnsClass: 'sm:grid-cols-2',
      }
    case 'computers':
      return {
        key: group,
        icon: Monitor,
        platformKeys: ['windows', 'macos', 'linux'],
        columnsClass: 'sm:grid-cols-3',
      }
    default:
      return {
        key: group,
        icon: Tv2,
        platformKeys: ['appleTV', 'androidTV'],
        columnsClass: 'sm:grid-cols-2',
      }
  }
}

const platformGroups = computed<PlatformGroup[]>(() => {
  if (!config.value) return []

  const platformsByKey = config.value.platforms

  return (['phones', 'computers', 'tvs'] as PlatformGroupKey[])
    .map((groupKey) => {
      const group = getGroupDefinition(groupKey)

      const platforms = group.platformKeys
        .map((platformKey) => {
          const platform = platformsByKey[platformKey]
          if (!platform || platform.apps.length === 0) return null

          const featuredApp = platform.apps.find((app) => app.featured) ?? platform.apps[0]

          return {
            value: platformKey,
            title: t(platform.displayName),
            subtitle: featuredApp?.name ?? '',
            iconHtml: config.value?.svgLibrary[platform.svgIconKey] ?? '',
          }
        })
        .filter(Boolean) as PlatformCard[]

      return {
        ...group,
        label: getPlatformGroupLabel(groupKey),
        platforms,
      }
    })
    .filter((group) => group.platforms.length > 0)
})

function handlePlatformClick(platform: TSubscriptionPagePlatformKey) {
  vibrate('tap')

  selectedPlatform.value = selectedPlatform.value === platform ? null : platform
}

watch(
  availablePlatforms,
  (platforms) => {
    if (!platforms.length) {
      selectedPlatform.value = null
      return
    }

    if (
      selectedPlatform.value &&
      !platforms.some((platform) => platform.value === selectedPlatform.value)
    ) {
      selectedPlatform.value = null
    }
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

const selectedPlatformGroup = computed(() =>
  platformGroups.value.find((group) =>
    group.platforms.some((platform) => platform.value === selectedPlatform.value),
  ),
)

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
    v-if="config && subscription && baseTranslations"
    class="rounded-[24px] bg-white/5 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.24)] sm:p-6"
  >
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div class="max-w-[32rem]">
        <h2 class="m-0 text-xl font-semibold leading-tight">
          {{ t(baseTranslations.installationGuideHeader) }}
        </h2>
      </div>
    </div>

    <div class="grid gap-5">
      <section
        v-for="group in platformGroups"
        :key="group.key"
        class="grid gap-3"
      >
        <div class="inline-flex items-center text-sm gap-2 font-semibold tracking-[0.08em] text-white/60">
          <span class="grid place-items-center text-white/80">
            <component :is="group.icon" class="h-4 w-4" />
          </span>
          <span>{{ group.label }}</span>
        </div>

        <div :class="['grid gap-3', group.columnsClass]">
          <button
            v-for="platform in group.platforms"
            :key="platform.value"
            :class="[
              'group flex min-h-[148px] flex-col items-center justify-center rounded-[20px] bg-black px-4 py-5 text-center text-white  transition hover:bg-neutral-950',
              selectedPlatform === platform.value
                ? 'border-2 border-neutral-800'
                : 'border-transparent',
            ]"
            type="button"
            @click="handlePlatformClick(platform.value)"
          >
            <span
              v-if="platform.iconHtml"
              class="mb-4 inline-flex h-10 w-10 items-center justify-center text-white/55 transition group-hover:text-white/70 [&>svg]:h-10 [&>svg]:w-10"
              v-html="platform.iconHtml"
            />

            <span class="text-[1.02rem] font-semibold leading-none">
              {{ platform.title }}
            </span>

            <span class="mt-1 text-sm text-white/45">
              {{ platform.subtitle }}
            </span>
          </button>
        </div>

        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="selectedPlatformGroup?.key === group.key && selectedPlatformConfig && selectedApp"
            class="grid gap-3.5 pt-1"
          >
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
        </Transition>
      </section>
    </div>
  </section>
</template>
