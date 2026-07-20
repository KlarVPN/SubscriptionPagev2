<script setup lang="ts">
import { BotMessageSquare, Copy, ExternalLink, Link2, X } from 'lucide-vue-next'
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
  <div class="flex flex-wrap items-center gap-2">
    <button
      v-if="!hideGetLink"
      class="inline-flex items-center gap-2 rounded-[14px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 to-violet-500/10 px-4 py-[0.7rem] font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/10"
      type="button"
      @click="showQr = true"
    >
      <Link2 class="h-4 w-4 shrink-0" />
      <span>Get link</span>
    </button>

    <a
      v-if="supportUrl"
      :href="supportUrl"
      class="inline-flex items-center gap-2 rounded-[14px] border border-white/10 bg-white/5 px-4 py-[0.7rem] font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/10"
      rel="noopener noreferrer"
      target="_blank"
    >
      <BotMessageSquare class="h-4 w-4 shrink-0" />
      <span>Support</span>
      <ExternalLink class="h-4 w-4 shrink-0 opacity-75" />
    </a>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-150"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showQr"
          class="fixed inset-0 z-[200] grid place-items-center bg-[rgba(5,8,14,0.72)] p-4 backdrop-blur-[14px]"
          @click.self="showQr = false"
        >
          <div class="w-full max-w-[420px] rounded-[24px] border border-white/10 bg-[rgba(17,22,31,0.96)] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <div class="text-base font-bold">
                  Subscription link
                </div>
                <div class="mt-1 text-sm text-white/70">
                  Scan the code or copy the link.
                </div>
              </div>

              <button
                class="rounded-md p-1 text-white/80 transition hover:bg-white/5 hover:text-white"
                type="button"
                @click="showQr = false"
              >
                <X class="h-4 w-4" />
              </button>
            </div>

            <div
              v-if="qrSvg"
              class="mb-4 grid place-items-center p-2"
            >
              <img
                :alt="'QR code for subscription link'"
                :src="`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`"
                class="w-full max-w-[280px] rounded-[18px] bg-white p-2"
              >
            </div>

            <button
              class="mt-1.5 flex w-full items-center justify-center gap-2 rounded-[14px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 to-violet-500/10 px-4 py-[0.8rem] font-bold text-white transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/10"
              type="button"
              @click="copySubscriptionLink"
            >
              <Copy class="h-4 w-4 shrink-0" />
              <span>Copy link</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
