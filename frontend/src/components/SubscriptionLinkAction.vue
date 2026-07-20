<script setup lang="ts">
import { BotMessageSquare, Copy, ExternalLink, Link2, QrCode, X } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { renderSVG } from 'uqr'

import { constructSubscriptionUrl } from '../shared/utils/construct-subscription-url'
import { useSubscriptionStore } from '../stores/subscription'
import { useAppConfigStore } from '../stores/app-config'
import { vibrate } from '../shared/utils/vibrate'

const appConfigStore = useAppConfigStore()
const subscriptionStore = useSubscriptionStore()

const showQr = ref(false)

const subscriptionUrl = computed(() => {
    const subscription = subscriptionStore.subscription
    if (!subscription || typeof window === 'undefined') return ''

    return constructSubscriptionUrl(window.location.href, subscription.user.shortUuid)
})

const supportUrl = computed(() => appConfigStore.config?.brandingSettings.supportUrl ?? '')
const hideGetLink = computed(() => appConfigStore.config?.baseSettings.hideGetLinkButton ?? false)

const qrSvg = computed(() => {
    if (!subscriptionUrl.value) return ''

    return renderSVG(subscriptionUrl.value, {
        whiteColor: '#161B22',
        blackColor: '#22d3ee'
    })
})

async function copySubscriptionLink() {
    if (!subscriptionUrl.value || typeof navigator === 'undefined' || !navigator.clipboard) return

    vibrate('tap')
    await navigator.clipboard.writeText(subscriptionUrl.value)
}
</script>

<template>
  <div class="link-actions">
    <button
      v-if="!hideGetLink"
      class="action-button action-button--primary"
      type="button"
      @click="showQr = true"
    >
      <Link2 class="action-icon" />
      <span>Get link</span>
    </button>

    <a
      v-if="supportUrl"
      :href="supportUrl"
      class="action-button"
      rel="noopener noreferrer"
      target="_blank"
    >
      <BotMessageSquare class="action-icon" />
      <span>Support</span>
      <ExternalLink class="action-inline-icon" />
    </a>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showQr"
          class="modal-backdrop"
          @click.self="showQr = false"
        >
          <div class="modal-card">
            <div class="modal-head">
              <div>
                <div class="modal-title">
                  Subscription link
                </div>
                <div class="modal-subtitle">
                  Scan the code or copy the link.
                </div>
              </div>

              <button
                class="modal-close"
                type="button"
                @click="showQr = false"
              >
                <X class="action-icon" />
              </button>
            </div>

            <div
              v-if="qrSvg"
              class="qr-wrap"
            >
              <img
                :alt="'QR code for subscription link'"
                :src="`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`"
                class="qr-code"
              >
            </div>

            <button
              class="action-button action-button--secondary modal-copy"
              type="button"
              @click="copySubscriptionLink"
            >
              <Copy class="action-icon" />
              <span>Copy link</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.link-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.action-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 0.95rem;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.03);
    color: #fff;
    text-decoration: none;
    font-weight: 600;
    transition:
        transform 120ms ease,
        border-color 120ms ease,
        background 120ms ease;
}

.action-button:hover {
    transform: translateY(-1px);
    border-color: rgba(34, 211, 238, 0.3);
    background: rgba(255, 255, 255, 0.05);
}

.action-button--primary {
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.16), rgba(151, 117, 250, 0.14));
    border-color: rgba(34, 211, 238, 0.2);
}

.action-button--secondary {
    width: 100%;
    justify-content: center;
}

.action-icon,
.action-inline-icon {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
}

.action-inline-icon {
    opacity: 0.75;
}

.modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgba(5, 8, 14, 0.72);
    backdrop-filter: blur(14px);
}

.modal-card {
    width: min(420px, 100%);
    border-radius: 24px;
    background: rgba(17, 22, 31, 0.96);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
    padding: 1rem;
}

.modal-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
}

.modal-title {
    font-size: 1rem;
    font-weight: 700;
}

.modal-subtitle {
    margin-top: 0.25rem;
    color: rgba(255, 255, 255, 0.68);
    font-size: 0.875rem;
}

.modal-close {
    border: 0;
    background: transparent;
    color: rgba(255, 255, 255, 0.78);
    cursor: pointer;
    padding: 0.25rem;
}

.qr-wrap {
    display: grid;
    place-items: center;
    padding: 0.5rem;
    margin-bottom: 1rem;
}

.qr-code {
    width: min(100%, 280px);
    border-radius: 18px;
    background: #fff;
    padding: 0.5rem;
}

.modal-copy {
    margin-top: 0.25rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 160ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (max-width: 640px) {
    .action-button {
        width: 100%;
        justify-content: center;
    }
}
</style>
