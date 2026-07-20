<script setup lang="ts">
import {
  AlertCircle,
  ArrowUpDown,
  CalendarDays,
  Check,
  ChevronDown,
  XIcon,
} from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'

import { translateDaysLeft, useTranslation } from '@/composables/use-translation'
import { cn } from '@/lib/utils'
import { formatDate } from '@/shared/utils/config-parser'
import { vibrate } from '@/shared/utils/vibrate'
import { useAppConfigStore } from '@/stores/app-config'
import { useSubscriptionStore } from '@/stores/subscription'
import SubscriptionLinkAction from '@/components/SubscriptionLinkAction.vue'

const appConfigStore = useAppConfigStore()
const subscriptionStore = useSubscriptionStore()
const { t, currentLang, baseTranslations, uiT } = useTranslation()

const expanded = ref(true)

const config = computed(() => appConfigStore.config)
const subscription = computed(() => subscriptionStore.subscription)
const user = computed(() => subscription.value?.user)
const isExpired = computed(() => Boolean(user.value && user.value.daysLeft <= 0))

watch(
  () => config.value?.uiConfig.subscriptionInfoBlockType,
  (mode) => {
    expanded.value = mode === 'expanded' || mode === 'cards'
  },
  { immediate: true },
)

const mode = computed(() => config.value?.uiConfig.subscriptionInfoBlockType ?? 'hidden')

const statusTone = computed(() => {
  if (!user.value)
    return { color: 'red', icon: XIcon, label: t(baseTranslations.value?.inactive) }

  if (user.value.userStatus === 'ACTIVE' && user.value.daysLeft >= 4) {
    return { color: 'teal', icon: Check, label: t(baseTranslations.value?.active) }
  }

  if (user.value.userStatus === 'ACTIVE' && user.value.daysLeft >= 1) {
    return { color: 'orange', icon: AlertCircle, label: t(baseTranslations.value?.active) }
  }

  return { color: 'red', icon: XIcon, label: t(baseTranslations.value?.inactive) }
})

const statusCircleClass = computed(() => {
  switch (statusTone.value.color) {
    case 'orange':
      return 'bg-[#f0b100]'
    case 'teal':
      return 'bg-[#5db8a9]'
    default:
      return 'bg-[#e7000b]'
  }
})

const expiresValue = computed(() => {
  if (!user.value) return ''

  if (user.value.daysLeft <= 0) {
    return t(baseTranslations.value?.expired)
  }

  return translateDaysLeft(user.value.daysLeft, currentLang.value)
})

const expiresSubvalue = computed(() => {
  if (!user.value || !baseTranslations.value) return ''

  return formatDate(user.value.expiresAt, currentLang.value, baseTranslations.value)
})

const usedLabel = computed(() => uiT('used'))
const trafficProgressLabel = computed(() => uiT('trafficUsage'))
const unlimitedPlanLabel = computed(() => uiT('unlimitedPlan'))

const trafficProgress = computed(() => {
  if (!user.value) return null

  const usedBytes = Number(user.value.trafficUsedBytes ?? 0)
  const limitBytes = Number(user.value.trafficLimitBytes ?? 0)
  const unlimited = user.value.trafficLimit === '0' || limitBytes <= 0
  const percent = unlimited ? 0 : Math.min(100, Math.round((usedBytes / limitBytes) * 100))

  return {
    percent,
    usedLabel: user.value.trafficUsed,
    limitLabel: unlimited ? '∞' : user.value.trafficLimit,
    unlimited,
  }
})

const trafficUsageSubvalue = computed(() => {
  if (!trafficProgress.value) return ''

  if (trafficProgress.value.unlimited) {
    return uiT('infiniteTraffic')
  }

  return `${trafficProgress.value.percent}% ${usedLabel.value}`
})

function toggleExpanded() {
  vibrate('tap')
  expanded.value = !expanded.value
}

const stats = computed(() => {
  if (!user.value || !baseTranslations.value) return []

  return [
    {
      icon: CalendarDays,
      label: t(baseTranslations.value.expires),
      value: expiresValue.value,
      subvalue: expiresSubvalue.value,
    },
    {
      icon: ArrowUpDown,
      label: t(baseTranslations.value.bandwidth),
      value: trafficProgress.value
        ? `${trafficProgress.value.usedLabel} / ${trafficProgress.value.limitLabel}`
        : '',
      subvalue: trafficUsageSubvalue.value,
    },
  ]
})

const trafficBarClass = computed(() => {
  if (!trafficProgress.value) return 'from-cyan-400 to-violet-500'

  if (trafficProgress.value.percent < 40) return 'bg-emerald-500'
  if (trafficProgress.value.percent <= 80) return 'bg-yellow-400'

  return 'bg-rose-500'
})

const trafficProgressLabelText = computed(() => {
  if (!trafficProgress.value) return ''

  return trafficProgress.value.unlimited
    ? unlimitedPlanLabel.value
    : `${trafficProgress.value.percent}% ${usedLabel.value}`
})

function getTrafficProgressText() {
  return trafficProgressLabelText.value
}

const showTrafficProgressBar = computed(
  () => Boolean(trafficProgress.value) && !isExpired.value && !trafficProgress.value?.unlimited,
)
</script>

<template>
  <section
    v-if="mode !== 'hidden' && user && baseTranslations"
    class="w-full rounded-[24px] bg-white/5 p-3 sm:p-6"
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
          <span :class="cn('p-4 rounded-full border-black', statusCircleClass)">
            <component :is="statusTone.icon" class="size-12 shrink-0 text-black" />
          </span>
          <span class="text-xl">{{ statusTone.label }}</span>
        </div>
      </div>

      <button
        v-if="mode === 'collapsed'"
        class="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
        type="button"
        @click="toggleExpanded"
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
      <div v-if="mode !== 'collapsed' || expanded" class="mt-4 grid gap-3 md:grid-cols-2">
        <article
          v-for="item in stats"
          :key="item.label"
          class="flex min-w-0 items-center gap-3 rounded-[12px] bg-black p-[0.9rem]"
        >
          <div class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10">
            <component :is="item.icon" class="size-4.5" />
          </div>

          <div class="min-w-0">
            <div class="text-[0.72rem] uppercase leading-none tracking-[0.08em] text-white/60">
              {{ item.label }}
            </div>
            <div class="truncate font-bold">
              {{ item.value }}
            </div>
            <div
              v-if="item.subvalue"
              class="text-xs text-white/60 leading-none"
            >
              {{ item.subvalue }}
            </div>
          </div>
        </article>

        <article v-if="showTrafficProgressBar" class="rounded-[12px] bg-black p-[0.9rem] md:col-span-2">
          <ProgressRoot
            class="h-2 overflow-hidden rounded-full bg-white/10"
            :get-value-text="getTrafficProgressText"
            :model-value="trafficProgress?.percent ?? 0"
            :max="100"
          >
            <ProgressIndicator
              class="h-full rounded-full transition-all duration-300"
              :class="trafficBarClass"
              :style="{ width: `${trafficProgress?.percent ?? 0}%` }"
            />
          </ProgressRoot>

          <div class="mt-2 flex items-center justify-between text-xs text-white/60">
            <span>{{ trafficProgress?.unlimited ? unlimitedPlanLabel : trafficProgressLabel }}</span>
            <span>{{ trafficProgress?.percent ?? 0 }}%</span>
          </div>
        </article>
        <SubscriptionLinkAction />
      </div>
    </Transition>
  </section>
</template>
