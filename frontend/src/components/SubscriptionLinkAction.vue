<script setup lang="ts">
import { Copy } from 'lucide-vue-next'
import { computed } from 'vue'
import { toast } from 'vue-sonner'

import { useTranslation } from '@/composables/use-translation'
import { useSubscriptionLink } from '@/composables/use-subscription-link'
import { copyText } from '@/shared/utils/clipboard'
import { vibrate } from '@/shared/utils/vibrate'

const { subscriptionUrl } = useSubscriptionLink()
const { t, baseTranslations } = useTranslation()


const subscriptionLinkValue = computed(() => subscriptionUrl.value)
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
</script>

<template>
  <article class="md:col-span-2 rounded-[12px] bg-black p-[0.9rem]">
    <span class="text-[0.72rem] uppercase leading-none tracking-[0.08em] text-white/60">
      Ссылка на подписку
    </span>

    <div class="flex items-center gap-2">
      <input
        :value="subscriptionLinkValue"
        class="min-w-0 flex-1 p-0 text-sm text-white outline-none transition placeholder:text-white/35"
        readonly
        type="text"
        @click="handleSubscriptionLinkClick"
      >

      <button
        :disabled="!subscriptionLinkValue"
        class="grid size-10.5 shrink-0 place-items-center rounded-lg  bg-white/10 text-white transition hover:bg-white/15 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
        type="button"
        title="Copy"
        @click="copySubscriptionLink"
      >
        <Copy class="h-4 w-4" />
      </button>
    </div>
  </article>
</template>
