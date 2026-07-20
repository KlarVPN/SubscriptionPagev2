<script setup lang="ts">
import type {
  TSubscriptionPageAppConfig,
  TSubscriptionPageButtonConfig,
  TSubscriptionPageLanguageCode,
} from '@remnawave/subscription-page-types'

import { ChevronDown } from 'lucide-vue-next'
import { computed } from 'vue'

import {
  getColorGradient,
  getColorGradientSolid,
  getLocalizedText,
} from '../shared/utils/config-parser'

const props = defineProps<{
  block: TSubscriptionPageAppConfig['blocks'][number]
  currentLang: TSubscriptionPageLanguageCode
  index: number
  onButtonClick: (button: TSubscriptionPageButtonConfig) => void
  svgLibrary: Record<string, string>
  variant: 'accordion' | 'cards' | 'minimal' | 'timeline'
}>()

const iconHtml = computed(() => props.svgLibrary[props.block.svgIconKey] ?? '')
const title = computed(() => getLocalizedText(props.block.title, props.currentLang))
const description = computed(() => getLocalizedText(props.block.description, props.currentLang))
const gradient = computed(() =>
  props.variant === 'timeline'
    ? getColorGradientSolid(props.block.svgIconColor)
    : getColorGradient(props.block.svgIconColor),
)

const accordionShellClass = 'group overflow-hidden rounded-[20px] bg-white/5'
const summaryClass =
  'flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden'
const bodyClass = 'px-4 pb-4'
const cardBaseClass = 'rounded-[20px] bg-white/5'
const cardClass = computed(() => {
  if (props.variant === 'timeline') {
    return "relative p-4 pl-[1.1rem] before:absolute before:left-[1.85rem] before:top-[3.6rem] before:bottom-[-1rem] before:w-px before:bg-gradient-to-b before:from-cyan-400/50 before:to-cyan-400/5 before:content-['']"
  }

  if (props.variant === 'minimal') {
    return 'p-[0.9rem]'
  }

  return 'p-4'
})
const headClass = 'mb-3 flex items-center gap-3'
const badgeClass = 'grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[14px]'
const iconClass = 'inline-flex items-center justify-center [&>svg]:h-[18px] [&>svg]:w-[18px]'
const titleClass = 'text-base font-bold'
const indexClass = 'mt-1 text-[0.75rem] uppercase tracking-[0.08em] text-white/60'
const chevronClass =
  'h-[18px] w-[18px] shrink-0 text-white/70 transition-transform duration-150 group-open:rotate-180'
const descriptionClass = 'm-0 leading-[1.65] text-white/70'
const buttonsClass = 'mt-4 flex flex-wrap gap-2.5'
const buttonClass =
  'inline-flex items-center gap-2 rounded-[14px] bg-white/5 px-[0.88rem] py-[0.68rem] font-semibold text-white transition hover:-translate-y-px hover:border-cyan-400/30 hover:bg-white/10'
const buttonIconClass =
  'inline-flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-[18px] [&>svg]:w-[18px]'
</script>

<template>
  <article class="relative">
    <details v-if="variant === 'accordion'" :class="accordionShellClass" :open="index === 0">
      <summary :class="summaryClass">
        <span
          :class="badgeClass"
          :style="{
            background: gradient.background,
          }"
        >
          <span :class="iconClass" v-html="iconHtml" />
        </span>

        <span class="min-w-0 flex-1">
          <span :class="titleClass" v-html="title" />
          <span :class="indexClass">Step {{ index + 1 }}</span>
        </span>

        <ChevronDown :class="chevronClass" />
      </summary>

      <div :class="bodyClass">
        <p :class="descriptionClass" v-html="description" />
        <div v-if="block.buttons.length" :class="buttonsClass">
          <button
            v-for="button in block.buttons"
            :key="`${button.svgIconKey}-${button.link}`"
            :class="buttonClass"
            type="button"
            @click="onButtonClick(button)"
          >
            <span :class="buttonIconClass" v-html="svgLibrary[button.svgIconKey] ?? ''" />
            <span v-html="getLocalizedText(button.text, currentLang)" />
          </button>
        </div>
      </div>
    </details>

    <div v-else :class="[cardBaseClass, cardClass]">
      <div :class="headClass">
        <span
          :class="badgeClass"
          :style="{
            background: gradient.background,
          }"
        >
          <span :class="iconClass" v-html="iconHtml" />
        </span>

        <div class="min-w-0">
          <div :class="titleClass" v-html="title" />
          <div :class="indexClass">Step {{ index + 1 }}</div>
        </div>
      </div>

      <p :class="descriptionClass" v-html="description" />

      <div v-if="block.buttons.length" :class="buttonsClass">
        <button
          v-for="button in block.buttons"
          :key="`${button.svgIconKey}-${button.link}`"
          :class="buttonClass"
          type="button"
          @click="onButtonClick(button)"
        >
          <span :class="buttonIconClass" v-html="svgLibrary[button.svgIconKey] ?? ''" />
          <span v-html="getLocalizedText(button.text, currentLang)" />
        </button>
      </div>
    </div>
  </article>
</template>
