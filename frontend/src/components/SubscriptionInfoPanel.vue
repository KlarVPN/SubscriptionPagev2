<script setup lang="ts">
import {
    AlertCircle,
    ArrowUpDown,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    UserRound,
    XCircle
} from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

import { formatDate, getColorGradientSolid, getExpirationTextUtil } from '../shared/utils/config-parser'
import { useTranslation } from '../composables/use-translation'
import { useSubscriptionStore } from '../stores/subscription'
import { useAppConfigStore } from '../stores/app-config'
import { vibrate } from '../shared/utils/vibrate'

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

    if (user.value.userStatus === 'ACTIVE' && user.value.daysLeft > 3) {
        return { color: 'teal', icon: CheckCircle2, label: t(baseTranslations.value?.active) }
    }

    if (user.value.userStatus === 'ACTIVE' && user.value.daysLeft > 0) {
        return { color: 'orange', icon: AlertCircle, label: t(baseTranslations.value?.active) }
    }

    return { color: 'red', icon: XCircle, label: t(baseTranslations.value?.inactive) }
})

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
    ]
})

const expirationText = computed(() => {
    if (!user.value || !baseTranslations.value) return ''

    return getExpirationTextUtil(user.value.expiresAt, currentLang.value, baseTranslations.value)
})

const gradient = computed(() => getColorGradientSolid(statusTone.value.color))
</script>

<template>
  <section
    v-if="mode !== 'hidden' && user && baseTranslations"
    class="panel"
  >
    <div class="panel-head">
      <div class="summary">
        <div
          class="status-pill"
          :class="`status-pill--${statusTone.color}`"
        >
          <component
            :is="statusTone.icon"
            class="status-icon"
          />
          <span>{{ statusTone.label }}</span>
        </div>

        <div class="summary-copy">
          <h2 class="username">
            {{ user.username }}
          </h2>
          <p class="expiry">
            {{ expirationText }}
          </p>
        </div>
      </div>

      <button
        v-if="mode === 'collapsed'"
        class="toggle"
        type="button"
        @click="vibrate('tap'); expanded = !expanded"
      >
        <ChevronDown
          class="toggle-icon"
          :class="{ 'toggle-icon--open': expanded }"
        />
      </button>
    </div>

    <transition name="collapse">
      <div
        v-show="mode !== 'collapsed' || expanded"
        class="stats-grid"
      >
        <article
          v-for="item in stats"
          :key="item.label"
          :class="['stat-card', `stat-card--${item.color}`]"
        >
          <div class="stat-icon-wrap">
            <component
              :is="item.icon"
              class="stat-icon"
            />
          </div>

          <div class="stat-copy">
            <div class="stat-label">
              {{ item.label }}
            </div>
            <div class="stat-value">
              {{ item.value }}
            </div>
          </div>
        </article>
      </div>
    </transition>
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
}

.summary {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    min-width: 0;
}

.status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.7rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
}

.status-pill--teal {
    color: #99f6e4;
    background: rgba(32, 201, 151, 0.13);
    border: 1px solid rgba(32, 201, 151, 0.25);
}

.status-pill--orange {
    color: #fdba74;
    background: rgba(253, 126, 20, 0.13);
    border: 1px solid rgba(253, 126, 20, 0.25);
}

.status-pill--red {
    color: #fda4af;
    background: rgba(250, 82, 82, 0.13);
    border: 1px solid rgba(250, 82, 82, 0.25);
}

.status-icon {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
}

.summary-copy {
    min-width: 0;
}

.username {
    margin: 0;
    font-size: 1.15rem;
    line-height: 1.2;
}

.expiry {
    margin: 0.25rem 0 0;
    color: rgba(255, 255, 255, 0.68);
    font-size: 0.875rem;
}

.toggle {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
    color: #fff;
}

.toggle-icon {
    width: 18px;
    height: 18px;
    transition: transform 160ms ease;
}

.toggle-icon--open {
    transform: rotate(180deg);
}

.stats-grid {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
}

.stat-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-card--blue { box-shadow: inset 0 0 0 1px rgba(34, 139, 230, 0.08); }
.stat-card--cyan { box-shadow: inset 0 0 0 1px rgba(34, 211, 238, 0.08); }
.stat-card--orange { box-shadow: inset 0 0 0 1px rgba(253, 126, 20, 0.08); }
.stat-card--red { box-shadow: inset 0 0 0 1px rgba(250, 82, 82, 0.08); }
.stat-card--teal { box-shadow: inset 0 0 0 1px rgba(32, 201, 151, 0.08); }
.stat-card--green { box-shadow: inset 0 0 0 1px rgba(64, 192, 87, 0.08); }
.stat-card--yellow { box-shadow: inset 0 0 0 1px rgba(250, 176, 5, 0.08); }

.stat-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.05);
    flex: 0 0 auto;
}

.stat-icon {
    width: 18px;
    height: 18px;
}

.stat-copy {
    min-width: 0;
}

.stat-label {
    color: rgba(255, 255, 255, 0.62);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.stat-value {
    margin-top: 0.2rem;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.collapse-enter-active,
.collapse-leave-active {
    transition: opacity 160ms ease, transform 160ms ease;
}

.collapse-enter-from,
.collapse-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

@media (max-width: 720px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .panel-head {
        flex-direction: column;
    }

    .toggle {
        align-self: flex-end;
    }
}
</style>
