<script setup lang="ts">
import { Copy, KeyRound, QrCode } from 'lucide-vue-next'
import { computed, ref } from 'vue'

import { useTranslation } from '@/composables/use-translation'
import { copyText } from '@/shared/utils/clipboard'
import { createQrCodeDataUrl } from '@/shared/utils/qr-code'
import { vibrate } from '@/shared/utils/vibrate'
import { useAppConfigStore } from '@/stores/app-config'
import { useSubscriptionStore } from '@/stores/subscription'
import QrCodeModal from './QrCodeModal.vue'

type ParsedLink = {
  fullLink: string
  name: string
}

const appConfigStore = useAppConfigStore()
const subscriptionStore = useSubscriptionStore()
const { t, baseTranslations, uiT } = useTranslation()

const selectedLink = ref<null | ParsedLink>(null)

const parsedLinks = computed<ParsedLink[]>(() => {
  const links = subscriptionStore.subscription?.links ?? []

  return links.map((link) => {
    const hashIndex = link.lastIndexOf('#')

    if (hashIndex === -1) {
      return { fullLink: link, name: t(baseTranslations.value?.unknown) }
    }

    const encodedName = link.slice(hashIndex + 1)

    try {
      return {
        fullLink: link,
        name: decodeURIComponent(encodedName),
      }
    } catch {
      return {
        fullLink: link,
        name: encodedName,
      }
    }
  })
})

const qrSvg = computed(() => {
  if (!selectedLink.value) return ''

  return createQrCodeDataUrl(selectedLink.value.fullLink)
})

const isQrModalOpen = computed({
  get: () => selectedLink.value !== null,
  set: (isOpen) => {
    if (!isOpen) selectedLink.value = null
  },
})

async function copyLink(link: ParsedLink) {
  vibrate('tap')
  await copyText(link.fullLink)
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
        <p class="m-0 mt-1 text-sm text-white/70">{{ uiT('copyRawLinksOrScan') }}</p>
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

    <QrCodeModal
      v-model:open="isQrModalOpen"
      :copy-label="t(baseTranslations?.copyLink)"
      :description="t(baseTranslations?.scanToImport)"
      :image-alt="selectedLink ? `${selectedLink.name} ${uiT('qrCode')}` : uiT('qrCode')"
      :image-src="qrSvg"
      :title="selectedLink?.name ?? uiT('link')"
      @copy="selectedLink && copyLink(selectedLink)"
    />
  </section>
</template>
