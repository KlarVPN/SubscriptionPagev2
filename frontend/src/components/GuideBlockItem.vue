<script setup lang="ts">
import type { TSubscriptionPageAppConfig, TSubscriptionPageButtonConfig, TSubscriptionPageLanguageCode } from '@remnawave/subscription-page-types'

import { ChevronDown, Copy, ExternalLink, QrCode } from 'lucide-vue-next'
import { computed } from 'vue'

import { getColorGradient, getColorGradientSolid, getLocalizedText } from '../shared/utils/config-parser'

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
        : getColorGradient(props.block.svgIconColor)
)
</script>

<template>
  <article :class="['guide-block', `guide-block--${variant}`]">
    <details
      v-if="variant === 'accordion'"
      class="guide-details"
      :open="index === 0"
    >
      <summary class="guide-summary">
        <span
          class="guide-badge"
          :style="{
            background: gradient.background,
            border: gradient.border,
            boxShadow: gradient.boxShadow
          }"
        >
          <span
            class="guide-badge-icon"
            v-html="iconHtml"
          />
        </span>

        <span class="guide-summary-copy">
          <span
            class="guide-title"
            v-html="title"
          />
          <span class="guide-index">Step {{ index + 1 }}</span>
        </span>

        <ChevronDown class="guide-chevron" />
      </summary>

      <div class="guide-body">
        <p
          class="guide-description"
          v-html="description"
        />
        <div
          v-if="block.buttons.length"
          class="guide-buttons"
        >
          <button
            v-for="button in block.buttons"
            :key="`${button.svgIconKey}-${button.link}`"
            class="guide-button"
            type="button"
            @click="onButtonClick(button)"
          >
            <span
              class="guide-button-icon"
              v-html="svgLibrary[button.svgIconKey] ?? ''"
            />
            <span v-html="getLocalizedText(button.text, currentLang)" />
          </button>
        </div>
      </div>
    </details>

    <div
      v-else
      class="guide-card"
    >
      <div class="guide-head">
        <span
          class="guide-badge"
          :style="{
            background: gradient.background,
            border: gradient.border,
            boxShadow: gradient.boxShadow
          }"
        >
          <span
            class="guide-badge-icon"
            v-html="iconHtml"
          />
        </span>

        <div class="guide-summary-copy">
          <div
            class="guide-title"
            v-html="title"
          />
          <div class="guide-index">
            Step {{ index + 1 }}
          </div>
        </div>
      </div>

      <p
        class="guide-description"
        v-html="description"
      />

      <div
        v-if="block.buttons.length"
        class="guide-buttons"
      >
        <button
          v-for="button in block.buttons"
          :key="`${button.svgIconKey}-${button.link}`"
          class="guide-button"
          type="button"
          @click="onButtonClick(button)"
        >
          <span
            class="guide-button-icon"
            v-html="svgLibrary[button.svgIconKey] ?? ''"
          />
          <span v-html="getLocalizedText(button.text, currentLang)" />
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.guide-block {
    position: relative;
}

.guide-card,
.guide-details {
    padding: 1rem;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.guide-details {
    padding: 0;
    overflow: hidden;
}

.guide-summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 1rem;
}

.guide-summary::-webkit-details-marker {
    display: none;
}

.guide-head {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    margin-bottom: 0.75rem;
}

.guide-badge {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
}

.guide-badge-icon,
.guide-button-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.guide-badge-icon :deep(svg),
.guide-button-icon :deep(svg) {
    width: 18px;
    height: 18px;
}

.guide-summary-copy {
    min-width: 0;
    flex: 1;
}

.guide-title {
    font-weight: 700;
    font-size: 1rem;
}

.guide-index {
    margin-top: 0.15rem;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.62);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.guide-chevron {
    width: 18px;
    height: 18px;
    color: rgba(255, 255, 255, 0.72);
    transition: transform 140ms ease;
}

.guide-details[open] .guide-chevron {
    transform: rotate(180deg);
}

.guide-body {
    padding: 0 1rem 1rem;
}

.guide-description {
    margin: 0;
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.65;
}

.guide-buttons {
    margin-top: 0.9rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
}

.guide-button {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.68rem 0.88rem;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition:
        transform 120ms ease,
        border-color 120ms ease,
        background 120ms ease;
}

.guide-button:hover {
    transform: translateY(-1px);
    border-color: rgba(34, 211, 238, 0.28);
    background: rgba(255, 255, 255, 0.06);
}

.guide-button-icon {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
}

.guide-block--minimal .guide-card,
.guide-block--minimal .guide-details {
    padding: 0.9rem;
}

.guide-block--timeline .guide-card,
.guide-block--timeline .guide-details {
    padding-left: 1.1rem;
    position: relative;
}

.guide-block--timeline .guide-card::before,
.guide-block--timeline .guide-details::before {
    content: '';
    position: absolute;
    left: 1.85rem;
    top: 3.6rem;
    bottom: -1rem;
    width: 2px;
    background: linear-gradient(to bottom, rgba(34, 211, 238, 0.5), rgba(34, 211, 238, 0.05));
}

@media (max-width: 640px) {
    .guide-button {
        width: 100%;
        justify-content: center;
    }
}
</style>
