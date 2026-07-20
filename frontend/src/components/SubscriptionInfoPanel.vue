<script setup lang="ts">
import {
    AlertCircle,
    ArrowUpDown,
    CalendarDays,
    Check,
    ChevronDown,
    UserRound,
    XCircle
} from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

import { formatDate } from '../shared/utils/config-parser'
import { useTranslation } from '../composables/use-translation'
import { useSubscriptionStore } from '../stores/subscription'
import { useAppConfigStore } from '../stores/app-config'
import { vibrate } from '../shared/utils/vibrate'
import { cn } from '../lib/utils'

const appConfigStore = useAppConfigStore()
const subscriptionStore = useSubscriptionStore()
const { t, currentLang, baseTranslations } = useTranslation()

const expanded = ref(true)

const config = computed(() => appConfigStore.config)
const subscription = computed(() => subscriptionStore.subscription)
const user = computed(() => subscription.value?.user)

watch(
    () => config.value?.uiConfig.subscriptionInfoBlockType,
    (mode) => {
        expanded.value = mode === 'expanded' || mode === 'cards'
    },
    { immediate: true }
)

const mode = computed(() => config.value?.uiConfig.subscriptionInfoBlockType ?? 'hidden')

const statusTone = computed(() => {
    if (!user.value) return { color: 'red', icon: XCircle, label: t(baseTranslations.value?.inactive) }

    if (user.value.userStatus === 'ACTIVE' && user.value.daysLeft >= 4) {
        return { color: 'teal', icon: Check, label: t(baseTranslations.value?.active) }
    }

    if (user.value.userStatus === 'ACTIVE' && user.value.daysLeft >= 1) {
        return { color: 'orange', icon: AlertCircle, label: t(baseTranslations.value?.active) }
    }

    return { color: 'red', icon: XCircle, label: t(baseTranslations.value?.inactive) }
})

const statusCircleClass = computed(() => {
    switch (statusTone.value.color) {
        case 'orange':
            return 'bg-amber-200'
        case 'teal':
            return 'bg-[#5db8a9]'
        default:
            return 'bg-rose-200'
    }
})

function getToneCardClass(color: string) {
    switch (color) {
        case 'blue':
            return 'shadow-[inset_0_0_0_1px_rgba(34,139,230,0.08)]'
        case 'cyan':
            return 'shadow-[inset_0_0_0_1px_rgba(34,211,238,0.08)]'
        case 'green':
            return 'shadow-[inset_0_0_0_1px_rgba(64,192,87,0.08)]'
        case 'orange':
            return 'shadow-[inset_0_0_0_1px_rgba(253,126,20,0.08)]'
        case 'red':
            return 'shadow-[inset_0_0_0_1px_rgba(250,82,82,0.08)]'
        case 'teal':
            return 'shadow-[inset_0_0_0_1px_rgba(32,201,151,0.08)]'
        case 'yellow':
            return 'shadow-[inset_0_0_0_1px_rgba(250,176,5,0.08)]'
        default:
            return ''
    }
}

const stats = computed(() => {
    if (!user.value || !baseTranslations.value) return []

    const bandwidthValue =
        user.value.trafficLimit === '0'
            ? `${user.value.trafficUsed} / ∞`
            : `${user.value.trafficUsed} / ${user.value.trafficLimit}`

    return [
        { color: 'blue', icon: UserRound, label: t(baseTranslations.value.name), value: user.value.username },
        { color: statusTone.value.color, icon: statusTone.value.icon, label: t(baseTranslations.value.status), value: statusTone.value.label },
        { color: 'orange', icon: CalendarDays, label: t(baseTranslations.value.expires), value: formatDate(user.value.expiresAt, currentLang.value, baseTranslations.value) },
        { color: 'cyan', icon: ArrowUpDown, label: t(baseTranslations.value.bandwidth), value: bandwidthValue }
    ].map((item) => ({ ...item, toneClass: getToneCardClass(item.color) }))
})
</script>

<template>
  <section
    v-if="mode !== 'hidden' && user && baseTranslations"
    class="rounded-[24px] bg-white/5 p-8 w-full"
  >
    <div class="flex flex-col items-center justify-center gap-4">
        <div class="flex justify-center items-center gap-2">
      <span :class="cn('size-3 rounded-full', statusCircleClass)" />
      <h2 class="m-0 text-[1.15rem] mono uppercase font-semibold leading-[1.2]">
        {{ user.username }}
      </h2>
        </div>
      <div class="flex min-w-0 items-center gap-3">
        <div
          class="flex flex-col mono items-center gap-3 rounded-full px-3 py-3 text-[0.75rem] font-bold uppercase tracking-[0.04em] whitespace-nowrap"
        >
            <span :class="cn('p-4 rounded-full', statusCircleClass)">
          <component
            :is="statusTone.icon"
            class="size-12 shrink-0 text-black"
          />
            </span>
          <span class="text-xl">{{ statusTone.label }}</span>
        </div>
      </div>

      <button
        v-if="mode === 'collapsed'"
        class="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
        type="button"
        @click="vibrate('tap'); expanded = !expanded"
      >
        <ChevronDown
          class="h-[18px] w-[18px] transition-transform duration-150"
          :class="{ 'rotate-180': expanded }"
        />
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
        v-if="mode !== 'collapsed' || expanded"
        class="mt-4 grid gap-3 md:grid-cols-2"
      >
        <article
          v-for="item in stats"
          :key="item.label"
          :class="['flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/5 p-[0.9rem]', item.toneClass]"
        >
          <div class="grid h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-white/5">
            <component
              :is="item.icon"
              class="h-[18px] w-[18px]"
            />
          </div>

          <div class="min-w-0">
            <div class="text-[0.72rem] uppercase tracking-[0.08em] text-white/60">
              {{ item.label }}
            </div>
            <div class="mt-1 truncate font-bold">
              {{ item.value }}
            </div>
          </div>
        </article>
      </div>
    </Transition>
  </section>
</template>
