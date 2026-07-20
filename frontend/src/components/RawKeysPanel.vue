<script setup lang="ts">
import { Copy, KeyRound, QrCode, X } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { renderSVG } from 'uqr'

import { useTranslation } from '../composables/use-translation'
import { useSubscriptionStore } from '../stores/subscription'
import { useAppConfigStore } from '../stores/app-config'
import { vibrate } from '../shared/utils/vibrate'

type ParsedLink = {
    fullLink: string
    name: string
}

const appConfigStore = useAppConfigStore()
const subscriptionStore = useSubscriptionStore()
const { t, baseTranslations } = useTranslation()

const selectedLink = ref<null | ParsedLink>(null)

const parsedLinks = computed<ParsedLink[]>(() => {
    const links = subscriptionStore.subscription?.links ?? []

    return links.map((link) => {
        const hashIndex = link.lastIndexOf('#')

        if (hashIndex === -1) {
            return { fullLink: link, name: 'Unknown' }
        }

        const encodedName = link.slice(hashIndex + 1)

        try {
            return {
                fullLink: link,
                name: decodeURIComponent(encodedName)
            }
        } catch {
            return {
                fullLink: link,
                name: encodedName
            }
        }
    })
})

const qrSvg = computed(() => {
    if (!selectedLink.value) return ''

    return renderSVG(selectedLink.value.fullLink, {
        whiteColor: '#161B22',
        blackColor: '#22d3ee'
    })
})

async function copyLink(link: ParsedLink) {
    vibrate('tap')
    await navigator.clipboard?.writeText(link.fullLink)
}
</script>

<template>
  <section
    v-if="appConfigStore.config?.baseSettings.showConnectionKeys !== false && parsedLinks.length"
    class="rounded-[24px] border border-white/10 bg-[rgba(17,22,31,0.78)] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.24)]"
  >
    <div class="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 class="m-0 text-[1.05rem] font-semibold">
          {{ t(baseTranslations?.connectionKeysHeader) }}
        </h2>
        <p class="m-0 mt-1 text-sm text-white/70">
          Copy the raw links or scan them as QR codes.
        </p>
      </div>

      <div
        v-if="parsedLinks.length > 1"
        class="grid h-[34px] min-w-[34px] place-items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 font-bold text-cyan-200"
      >
        {{ parsedLinks.length }}
      </div>
    </div>

    <div class="grid gap-3">
      <article
        v-for="link in parsedLinks"
        :key="link.fullLink"
        class="flex flex-col gap-3 rounded-[18px] border border-white/10 bg-white/5 px-[0.95rem] py-[0.85rem] sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex min-w-0 items-center gap-3">
          <KeyRound class="h-[18px] w-[18px] shrink-0 text-cyan-400" />
          <div class="truncate font-semibold">
            {{ link.name }}
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-2 sm:justify-end">
          <button
            class="grid h-9 w-9 place-items-center rounded-[14px] border border-white/10 bg-white/5 text-white transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/10"
            type="button"
            @click="copyLink(link)"
          >
            <Copy class="h-4 w-4" />
          </button>

          <button
            class="grid h-9 w-9 place-items-center rounded-[14px] border border-cyan-400/20 bg-white/5 text-white transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/10"
            type="button"
            @click="selectedLink = link"
          >
            <QrCode class="h-4 w-4" />
          </button>
        </div>
      </article>
    </div>

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
          v-if="selectedLink"
          class="fixed inset-0 z-[200] grid place-items-center bg-[rgba(5,8,14,0.72)] p-4 backdrop-blur-[14px]"
          @click.self="selectedLink = null"
        >
          <div class="w-full max-w-[420px] rounded-[24px] border border-white/10 bg-[rgba(17,22,31,0.96)] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <div class="text-base font-bold">
                  {{ selectedLink.name }}
                </div>
                <div class="mt-1 text-sm text-white/70">
                  Scan to import
                </div>
              </div>

              <button
                class="rounded-md p-1 text-white/80 transition hover:bg-white/5 hover:text-white"
                type="button"
                @click="selectedLink = null"
              >
                <X class="h-4 w-4" />
              </button>
            </div>

            <img
              v-if="qrSvg"
              :alt="`${selectedLink.name} QR code`"
              :src="`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`"
              class="mb-4 w-full rounded-[18px] bg-white p-2"
            >

            <button
              class="w-full rounded-[14px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 to-violet-500/10 px-4 py-[0.8rem] font-bold text-white"
              type="button"
              @click="copyLink(selectedLink)"
            >
              Copy link
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
