<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'
import { computed } from 'vue'

import InstallationGuidePanel from '../../components/InstallationGuidePanel.vue'
import SubscriptionLinkAction from '../../components/SubscriptionLinkAction.vue'
import SubscriptionInfoPanel from '../../components/SubscriptionInfoPanel.vue'
import LanguagePicker from '../../components/LanguagePicker.vue'
import { useSubscriptionStore } from '../../stores/subscription'
import RawKeysPanel from '../../components/RawKeysPanel.vue'
import { useAppConfigStore } from '../../stores/app-config'

const appConfigStore = useAppConfigStore()
const subscriptionStore = useSubscriptionStore()

const ready = computed(
    () => appConfigStore.isLoaded && Boolean(appConfigStore.config) && Boolean(subscriptionStore.subscription)
)

const brandTitle = computed(() => appConfigStore.config?.brandingSettings.title ?? 'Subscription Page')
const brandSubtitle = computed(
    () => appConfigStore.config?.baseSettings.metaDescription ?? 'Subscription preview'
)
const logoUrl = computed(() => appConfigStore.config?.brandingSettings.logoUrl ?? '')
const hasCustomLogo = computed(() => logoUrl.value.length > 0 && !logoUrl.value.includes('docs.rw'))
</script>

<template>
  <div class="page-shell">
    <div class="animated-background" />

    <div class="page-content">
      <template v-if="ready">
        <header class="header-wrapper">
          <div class="header-inner">
            <div class="brand">
              <img
                v-if="hasCustomLogo"
                :alt="brandTitle"
                :src="logoUrl"
                class="brand-logo"
              >
              <div
                v-else
                class="brand-fallback"
              >
                RW
              </div>

              <div class="brand-copy">
                <h1 class="brand-title">
                  {{ brandTitle }}
                </h1>
                <p class="brand-subtitle">
                  {{ brandSubtitle }}
                </p>
              </div>
            </div>

            <SubscriptionLinkAction />
          </div>
        </header>

        <main class="main-content">
          <div class="stack">
            <SubscriptionInfoPanel />
            <InstallationGuidePanel />
            <RawKeysPanel />

            <div class="language-row">
              <LanguagePicker />
            </div>
          </div>
        </main>
      </template>

      <div
        v-else
        class="loading-state"
        aria-live="polite"
      >
        <div class="loading-card">
          <LoaderCircle class="spinner" />
          <div>
            <div class="loading-title">
              Loading subscription page
            </div>
            <div class="loading-subtitle">
              Preparing the preview and config...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-shell {
    min-height: 100vh;
    position: relative;
    color: #fff;
}

.page-content {
    position: relative;
    z-index: 1;
    min-height: 100vh;
}

.header-wrapper {
    position: sticky;
    top: 0;
    z-index: 10;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    background: rgba(22, 27, 35, 0.82);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-inner,
.main-content {
    width: min(1200px, calc(100vw - 2rem));
    margin: 0 auto;
}

.header-inner {
    min-height: 76px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
}

.brand {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    min-width: 0;
}

.brand-logo,
.brand-fallback {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    flex: 0 0 auto;
}

.brand-logo {
    object-fit: contain;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 4px;
}

.brand-fallback {
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.18), rgba(151, 117, 250, 0.16));
    border: 1px solid rgba(34, 211, 238, 0.22);
    color: #7dd3fc;
    font-weight: 800;
    letter-spacing: 0.04em;
}

.brand-copy {
    min-width: 0;
}

.brand-title {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.15;
}

.brand-subtitle {
    margin: 0.2rem 0 0;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.68);
}

.main-content {
    padding: 1.25rem 0 2rem;
}

.stack {
    display: grid;
    gap: 1rem;
}

.language-row {
    display: flex;
    justify-content: center;
    padding: 0.5rem 0 0.25rem;
}

.loading-state {
    min-height: calc(100vh - 80px);
    display: grid;
    place-items: center;
    padding: 2rem;
}

.loading-card {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 1rem 1.25rem;
    border-radius: 18px;
    background: rgba(17, 22, 31, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
}

.spinner {
    width: 28px;
    height: 28px;
    color: #22d3ee;
    animation: spin 1s linear infinite;
    flex: 0 0 auto;
}

.loading-title {
    font-weight: 700;
}

.loading-subtitle {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 640px) {
    .header-inner,
    .main-content {
        width: min(100vw - 1rem, 1200px);
    }

    .header-inner {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.9rem 0;
    }

    .brand-title {
        font-size: 1rem;
    }
}
</style>
