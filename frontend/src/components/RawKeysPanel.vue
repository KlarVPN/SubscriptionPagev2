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
    class="panel"
  >
    <div class="panel-head">
      <div>
        <h2 class="panel-title">
          {{ t(baseTranslations?.connectionKeysHeader) }}
        </h2>
        <p class="panel-subtitle">
          Copy the raw links or scan them as QR codes.
        </p>
      </div>

      <div
        v-if="parsedLinks.length > 1"
        class="count-chip"
      >
        {{ parsedLinks.length }}
      </div>
    </div>

    <div class="link-list">
      <article
        v-for="link in parsedLinks"
        :key="link.fullLink"
        class="link-row"
      >
        <div class="link-meta">
          <KeyRound class="link-icon" />
          <div class="link-name">
            {{ link.name }}
          </div>
        </div>

        <div class="link-actions">
          <button
            class="mini-button"
            type="button"
            @click="copyLink(link)"
          >
            <Copy class="mini-button-icon" />
          </button>

          <button
            class="mini-button mini-button--accent"
            type="button"
            @click="selectedLink = link"
          >
            <QrCode class="mini-button-icon" />
          </button>
        </div>
      </article>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="selectedLink"
          class="modal-backdrop"
          @click.self="selectedLink = null"
        >
          <div class="modal-card">
            <div class="modal-head">
              <div>
                <div class="modal-title">
                  {{ selectedLink.name }}
                </div>
                <div class="modal-subtitle">
                  Scan to import
                </div>
              </div>

              <button
                class="modal-close"
                type="button"
                @click="selectedLink = null"
              >
                <X class="mini-button-icon" />
              </button>
            </div>

            <img
              v-if="qrSvg"
              :alt="`${selectedLink.name} QR code`"
              :src="`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`"
              class="qr-code"
            >

            <button
              class="copy-full"
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

<style scoped>
.panel {
    padding: 1rem;
    border-radius: 24px;
    background: rgba(17, 22, 31, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 22px 70px rgba(0, 0, 0, 0.24);
}

.panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
}

.panel-title {
    margin: 0;
    font-size: 1.05rem;
}

.panel-subtitle {
    margin: 0.2rem 0 0;
    color: rgba(255, 255, 255, 0.68);
    font-size: 0.875rem;
}

.count-chip {
    min-width: 34px;
    height: 34px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    padding: 0 0.6rem;
    background: rgba(34, 211, 238, 0.12);
    border: 1px solid rgba(34, 211, 238, 0.22);
    color: #67e8f9;
    font-weight: 700;
}

.link-list {
    display: grid;
    gap: 0.75rem;
}

.link-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.85rem;
    padding: 0.85rem 0.95rem;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.link-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
}

.link-icon {
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
    color: #22d3ee;
}

.link-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
}

.link-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 0 0 auto;
}

.mini-button {
    width: 38px;
    height: 38px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
    color: #fff;
    display: grid;
    place-items: center;
}

.mini-button--accent {
    border-color: rgba(34, 211, 238, 0.22);
}

.mini-button-icon {
    width: 16px;
    height: 16px;
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

.qr-code {
    width: 100%;
    border-radius: 18px;
    background: #fff;
    padding: 0.5rem;
    margin-bottom: 1rem;
}

.copy-full {
    width: 100%;
    border-radius: 14px;
    border: 1px solid rgba(34, 211, 238, 0.22);
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.14), rgba(151, 117, 250, 0.12));
    color: #fff;
    padding: 0.8rem 1rem;
    font-weight: 700;
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
    .panel-head,
    .link-row {
        flex-direction: column;
        align-items: stretch;
    }

    .link-actions {
        justify-content: flex-end;
    }
}
</style>
