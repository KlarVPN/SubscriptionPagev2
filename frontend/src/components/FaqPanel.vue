<script setup lang="ts">
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'reka-ui'

import { ChevronDown } from 'lucide-vue-next'

import { getLocalizedText } from '@/shared/utils/config-parser'
import { useTranslation } from '@/composables/use-translation'

type FaqItem = {
  answer: Record<string, string>
  question: Record<string, string>
  value: string
}

const { currentLang, uiT } = useTranslation()

const faqItems: FaqItem[] = [
  {
    value: 'faq-1',
    question: {
      en: 'Not connecting?',
      fa: 'وصل نمی‌شود؟',
      fr: 'Ne se connecte pas ?',
      ru: 'Не подключается?',
      zh: '无法连接？',
    },
    answer: {
      en: 'Try another location, protocol or transport, restart the app, and update the subscription in the app if needed.',
      fa: 'یک لوکیشن دیگر، پروتکل یا ترنسپورت دیگر را امتحان کنید، برنامه را دوباره راه‌اندازی کنید و در صورت نیاز اشتراک را در برنامه به‌روزرسانی کنید.',
      fr: "Essayez un autre emplacement, un autre protocole ou transport, redémarrez l'application et mettez à jour l'abonnement dans l'application si nécessaire.",
      ru: 'Попробуйте другую локацию, протокол/транспорт или перезапустите приложение, также может помочь обновление подписки в приложении.',
      zh: '尝试其他节点、协议或传输方式，重启应用，如果需要也可以在应用内更新订阅。',
    },
  },
  {
    value: 'faq-2',
    question: {
      en: 'Slow speed?',
      fa: 'سرعت پایین است؟',
      fr: 'Vitesse lente ?',
      ru: 'Медленная скорость?',
      zh: '速度很慢？',
    },
    answer: {
      en: 'Choose the closest server for the best speed.',
      fa: 'برای بهترین سرعت، نزدیک‌ترین سرور را انتخاب کنید.',
      fr: 'Choisissez le serveur le plus proche pour obtenir la meilleure vitesse.',
      ru: 'Выберите ближайший сервер для лучшей скорости.',
      zh: '请选择最近的服务器，以获得更好的速度。',
    },
  },
  {
    value: 'faq-3',
    question: {
      en: 'How do I renew?',
      fa: 'چطور تمدید کنم؟',
      fr: 'Comment renouveler ?',
      ru: 'Как продлить?',
      zh: '如何续费？',
    },
    answer: {
      en: 'Open the bot, send /start, go to My subscription, then Renew. Choose the number of devices, the period, and the payment method. After payment, the subscription renews automatically within a few minutes.',
      fa: 'ربات را باز کنید، دستور /start را ارسال کنید، وارد بخش «اشتراک من» شوید، سپس «تمدید» را انتخاب کنید. تعداد دستگاه‌ها، مدت زمان و روش پرداخت را انتخاب کنید. پس از پرداخت، اشتراک طی چند دقیقه به‌صورت خودکار تمدید می‌شود.',
      fr: "Ouvrez le bot, envoyez /start, allez dans Mon abonnement, puis Renouveler. Choisissez le nombre d'appareils, la période et le moyen de paiement. Après paiement, l'abonnement se renouvelle automatiquement en quelques minutes.",
      ru: 'Откройте бота, наберите команду /start, перейдите в раздел "Моя подписка", затем "Продлить". Выберите нужное Вам количество устройств, далее период и способ оплаты. После оплаты, в течение нескольких минут, подписка автоматически продлится.',
      zh: '打开机器人，发送 /start，进入“我的订阅”，然后选择“续费”。选择设备数量、时长和支付方式。付款后，订阅会在几分钟内自动续费。',
    },
  },
]
</script>

<template>
  <section class="rounded-[24px] bg-white/5 p-4 sm:p-6">
    <div class="mb-4 sm:mb-5">
      <h2 class="m-0 text-xl font-semibold leading-tight text-white">
        {{ uiT('faqHeader') }}
      </h2>
    </div>

    <AccordionRoot
      class="grid"
      type="single"
      collapsible
    >
      <AccordionItem
        v-for="(item, index) in faqItems"
        :key="item.value"
        :value="item.value"
        :class="[
          'overflow-hidden bg-black/60',
          index === 0 ? 'rounded-t-[18px]' : 'rounded-none',
          index === faqItems.length - 1 ? 'rounded-b-[18px]' : '',
        ]"
      >
        <AccordionHeader as-child>
          <h3 class="m-0">
            <AccordionTrigger class="group flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-base font-semibold text-white outline-none transition hover:bg-white/5 focus-visible:bg-white/5">
              <span class="min-w-0 flex-1">
                {{ getLocalizedText(item.question, currentLang) }}
              </span>

              <ChevronDown class="h-4 w-4 shrink-0 text-white/60 transition-transform duration-150 group-data-[state=open]:rotate-180" />
            </AccordionTrigger>
          </h3>
        </AccordionHeader>

        <AccordionContent class="faq-content overflow-hidden px-4 pb-4 text-sm leading-6 text-white/70">
          {{ getLocalizedText(item.answer, currentLang) }}
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  </section>
</template>

<style scoped>
.faq-content[data-state='open'] {
  animation: slideDown 180ms ease-out;
}

.faq-content[data-state='closed'] {
  animation: slideUp 180ms ease-in;
}

@keyframes slideDown {
  from {
    height: 0;
  }

  to {
    height: var(--reka-accordion-content-height);
  }
}

@keyframes slideUp {
  from {
    height: var(--reka-accordion-content-height);
  }

  to {
    height: 0;
  }
}
</style>
