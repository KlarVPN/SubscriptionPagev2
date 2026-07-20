<script setup lang="ts">
import type { TSubscriptionPageAppConfig, TSubscriptionPageButtonConfig, TSubscriptionPagePlatformKey } from '@remnawave/subscription-page-types'

import { ChevronDown } from 'lucide-vue-next'
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
    class="panel"
  >
    <div class="panel-head">
      <div>
        <h2 class="panel-title">
          {{ t(baseTranslations.installationGuideHeader) }}
        </h2>
        <p class="panel-subtitle">
          Choose your device and follow the steps.
        </p>
      </div>

      <label
        v-if="availablePlatforms.length > 1"
        class="platform-select"
      >
        <span
          class="platform-select-icon"
          v-html="selectedPlatformConfig ? config.svgLibrary[selectedPlatformConfig.svgIconKey] ?? '' : ''"
        />
        <select
          v-model="selectedPlatform"
          class="platform-select-input"
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

    <div class="app-strip">
      <button
        v-for="(app, index) in selectedPlatformConfig.apps"
        :key="app.name"
        :class="['app-chip', { 'app-chip--active': index === selectedAppIndex, 'app-chip--featured': app.featured }]"
        type="button"
        @click="vibrate('toggle'); selectedAppIndex = index"
      >
        <span
          v-if="app.svgIconKey"
          class="app-chip-icon"
          v-html="config.svgLibrary[app.svgIconKey] ?? ''"
        />
        <span>{{ app.name }}</span>
        <span
          v-if="app.featured"
          class="app-chip-badge"
        >Featured</span>
      </button>
    </div>

    <div class="guide-list">
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

<style scoped>
.panel {
    padding: 1rem;
    border-radius: 24px;
    background: rgba(17, 22, 31, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 22px 70px rgba(0, 0, 0, 0.24);
}

.panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
}

.panel-title {
    margin: 0;
    font-size: 1.05rem;
}

.panel-subtitle {
    margin: 0.2rem 0 0;
    color: rgba(255, 255, 255, 0.68);
    font-size: 0.875rem;
}

.platform-select {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.7rem;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.platform-select-icon {
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
    display: inline-flex;
}

.platform-select-icon :deep(svg) {
    width: 18px;
    height: 18px;
}

.platform-select-input {
    background: transparent;
    color: #fff;
    border: 0;
    outline: none;
    min-width: 150px;
}

.platform-select-input option {
    color: #000;
}

.app-strip {
    display: flex;
    gap: 0.65rem;
    overflow-x: auto;
    padding-bottom: 0.2rem;
    margin-bottom: 1rem;
}

.app-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.72rem 0.9rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
    color: #fff;
    cursor: pointer;
    white-space: nowrap;
    flex: 0 0 auto;
}

.app-chip--active {
    border-color: rgba(34, 211, 238, 0.3);
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.14), rgba(151, 117, 250, 0.1));
}

.app-chip--featured {
    box-shadow: inset 0 0 0 1px rgba(250, 176, 5, 0.1);
}

.app-chip-icon {
    width: 18px;
    height: 18px;
    display: inline-flex;
    flex: 0 0 auto;
}

.app-chip-icon :deep(svg) {
    width: 18px;
    height: 18px;
}

.app-chip-badge {
    padding: 0.18rem 0.45rem;
    border-radius: 999px;
    background: rgba(250, 176, 5, 0.16);
    color: #fbbf24;
    font-size: 0.7rem;
    font-weight: 700;
}

.guide-list {
    display: grid;
    gap: 0.75rem;
}

@media (max-width: 640px) {
    .panel-head {
        flex-direction: column;
    }

    .platform-select {
        width: 100%;
    }

    .platform-select-input {
        width: 100%;
    }
}
</style>
