<script setup lang="ts">
import { Copy, QrCode } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

import { useTranslation } from '@/composables/use-translation'
import { useSubscriptionLink } from '@/composables/use-subscription-link'
import { copyText } from '@/shared/utils/clipboard'
import { createQrCodeDataUrl } from '@/shared/utils/qr-code'
import { vibrate } from '@/shared/utils/vibrate'
import QrCodeModal from './QrCodeModal.vue'

const { subscriptionUrl } = useSubscriptionLink()
const { t, baseTranslations, uiT } = useTranslation()

const subscriptionLinkValue = computed(() => subscriptionUrl.value)
const isQrModalOpen = ref(false)
const qrCodeSrc = computed(() => createQrCodeDataUrl(subscriptionUrl.value))
const copiedToastLabel = computed(
  () => t(baseTranslations.value?.linkCopiedToClipboard) || 'Link copied to clipboard',
)

async function copySubscriptionLink() {
  if (!subscriptionUrl.value) return

  vibrate('tap')
  const copied = await copyText(subscriptionUrl.value)

  if (copied) {
    toast.success(copiedToastLabel.value)
  }
}

function handleSubscriptionLinkClick() {
  void copySubscriptionLink()
}

function openQrModal() {
  if (!subscriptionLinkValue.value) return

  vibrate('tap')
  isQrModalOpen.value = true
}
</script>

<template>
  <article class="flex min-w-0 gap-3 rounded-[12px] bg-black p-[0.9rem] md:col-span-2">
    <div class="flex flex-1 min-w-0 flex-col gap-2">
      <span class="text-[0.72rem] uppercase leading-none tracking-[0.08em] text-white/60">
        {{ uiT('subscriptionLink') }}
      </span>

      <div class="flex items-center gap-2">
        <input
          :value="subscriptionLinkValue"
          class="min-w-0 flex-1 p-0 text-sm text-white outline-none transition placeholder:text-white/35"
          readonly
          type="text"
          @click="handleSubscriptionLinkClick"
        >
      </div>
    </div>

    <div class="flex items-center gap-2 self-start sm:self-end">
      <button
        :disabled="!subscriptionLinkValue"
        class="grid size-10.5 shrink-0 place-items-center rounded-lg bg-white/10 text-white cursor-pointer transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
        type="button"
        :title="t(baseTranslations?.copyLink)"
        @click="copySubscriptionLink"
      >
        <Copy class="h-4 w-4" />
      </button>

      <button
        :disabled="!subscriptionLinkValue"
        class="grid size-10.5 shrink-0 place-items-center rounded-lg bg-white/10 text-white cursor-pointer transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
        type="button"
        :title="uiT('qrCode')"
        @click="openQrModal"
      >
        <QrCode class="h-4 w-4" />
      </button>
    </div>

    <QrCodeModal
      v-model:open="isQrModalOpen"
      :copy-label="t(baseTranslations?.copyLink)"
      :description="t(baseTranslations?.scanToImport)"
      :image-alt="uiT('subscriptionQrCodeAlt')"
      :image-src="qrCodeSrc"
      :title="uiT('qrCode')"
      @copy="copySubscriptionLink"
    />
  </article>
</template>
