import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import type { TSubscriptionPageLanguageCode } from '@remnawave/subscription-page-types'

import { getLocalizedText } from '@/shared/utils/config-parser'
import { useAppConfigStore } from '@/stores/app-config'

type UiTextKey =
  | 'chooseDeviceAndFollowSteps'
  | 'computersGroup'
  | 'connectAnotherDevicePrompt'
  | 'copyRawLinksOrScan'
  | 'faqHeader'
  | 'daysLeft'
  | 'loadingSubscriptionPage'
  | 'phonesGroup'
  | 'preparingPreviewAndConfig'
  | 'qrCode'
  | 'selectLanguage'
  | 'support'
  | 'step'
  | 'subscriptionLink'
  | 'subscriptionQrCodeAlt'
  | 'tvsGroup'
  | 'trafficUsage'
  | 'infiniteTraffic'
  | 'unlimitedPlan'
  | 'used'
  | 'link'

const UI_TEXTS: Record<UiTextKey, Record<string, string>> = {
  chooseDeviceAndFollowSteps: {
    en: 'Choose your device and follow the steps.',
    fa: 'دستگاه خود را انتخاب کنید و مراحل را دنبال کنید.',
    fr: 'Choisissez votre appareil et suivez les étapes.',
    ru: 'Выберите устройство и следуйте шагам.',
    zh: '选择您的设备并按照步骤操作。',
  },
  computersGroup: {
    en: 'Computers',
    fa: 'رایانه‌ها',
    fr: 'Ordinateurs',
    ru: 'Компьютер',
    zh: '电脑',
  },
  connectAnotherDevicePrompt: {
    en: 'Connecting another device? Scan the QR code in the app.',
    fa: 'دستگاه دیگری را وصل می‌کنید؟ کد QR را در برنامه اسکن کنید.',
    fr: "Vous connectez un autre appareil ? Scannez le QR code dans l'application.",
    ru: 'Подключаете другое устройство? Отсканируйте QR-код в приложении.',
    zh: '要连接另一台设备？请在应用中扫描二维码。',
  },
  copyRawLinksOrScan: {
    en: 'Copy the raw links or scan them as QR codes.',
    fa: 'لینک‌های خام را کپی کنید یا آن‌ها را به‌صورت QR کد اسکن کنید.',
    fr: 'Copiez les liens bruts ou scannez-les en QR codes.',
    ru: 'Скопируйте сырые ссылки или отсканируйте их как QR-коды.',
    zh: '复制原始链接，或将其扫描为二维码。',
  },
  daysLeft: {
  faqHeader: {
    en: 'Frequently asked questions',
    fa: 'سوالات متداول',
    fr: 'Questions fréquentes',
    ru: 'Частые вопросы',
    zh: '常见问题',
  },
    en: '{count} day{suffix} left',
    fa: ' {count} روز باقی مانده',
    fr: '{count} jour{suffix} restant{suffix2}',
    ru: '{count} день{suffix} осталось',
    zh: '剩余 {count} 天',
  },
  loadingSubscriptionPage: {
    en: 'Loading subscription page',
    fa: 'در حال بارگذاری صفحه اشتراک',
    fr: "Chargement de la page d'abonnement",
    ru: 'Загрузка страницы подписки',
    zh: '正在加载订阅页面',
  },
  phonesGroup: {
    en: 'Phones',
    fa: 'تلفن‌ها',
    fr: 'Téléphones',
    ru: 'Телефон',
    zh: '手机',
  },
  preparingPreviewAndConfig: {
    en: 'Preparing the preview and config...',
    fa: 'در حال آماده‌سازی پیش‌نمایش و پیکربندی...',
    fr: "Préparation de l'aperçu et de la configuration...",
    ru: 'Подготавливаем предпросмотр и конфиг...',
    zh: '正在准备预览和配置...',
  },
  qrCode: {
    en: 'QR code',
    fa: 'کد QR',
    fr: 'Code QR',
    ru: 'QR-код',
    zh: '二维码',
  },
  selectLanguage: {
    en: 'Select language',
    fa: 'زبان را انتخاب کنید',
    fr: 'Choisir la langue',
    ru: 'Выберите язык',
    zh: '选择语言',
  },
  support: {
    en: 'Support',
    fa: 'پشتیبانی',
    fr: 'Support',
    ru: 'Поддержка',
    zh: '支持',
  },
  step: {
    en: 'Step',
    fa: 'مرحله',
    fr: 'Étape',
    ru: 'Шаг',
    zh: '步骤',
  },
  subscriptionLink: {
    en: 'Subscription link',
    fa: 'پیوند اشتراک',
    fr: "Lien d'abonnement",
    ru: 'Ссылка на подписку',
    zh: '订阅链接',
  },
  subscriptionQrCodeAlt: {
    en: 'QR code for subscription link',
    fa: 'کد QR برای پیوند اشتراک',
    fr: "Code QR du lien d'abonnement",
    ru: 'QR-код для ссылки на подписку',
    zh: '订阅链接二维码',
  },
  tvsGroup: {
    en: 'TVs',
    fa: 'تلویزیون‌ها',
    fr: 'Téléviseurs',
    ru: 'Телевизоры',
    zh: '电视',
  },
  used: {
    en: 'used',
    fa: 'استفاده‌شده',
    fr: 'utilisé',
    ru: 'использовано',
    zh: '已使用',
  },
  trafficUsage: {
    en: 'Traffic usage',
    fa: 'میزان ترافیک',
    fr: 'Utilisation du trafic',
    ru: 'Количество трафика',
    zh: '流量使用',
  },
  infiniteTraffic: {
    en: 'Infinite traffic',
    fa: 'ترافیک نامحدود',
    fr: 'Trafic illimité',
    ru: 'бесконечный трафик',
    zh: '无限流量',
  },
  unlimitedPlan: {
    en: 'Unlimited plan',
    fa: 'طرح نامحدود',
    fr: 'Forfait illimité',
    ru: 'Безлимитный тариф',
    zh: '不限流量套餐',
  },
  link: {
    en: 'Link',
    fa: 'پیوند',
    fr: 'Lien',
    ru: 'Ссылка',
    zh: '链接',
  },
}

function normalizeLang(lang: string): string {
  return lang.toLowerCase().split('-')[0] ?? 'en'
}

function resolveUiText(key: UiTextKey, lang: TSubscriptionPageLanguageCode): string {
  const texts = UI_TEXTS[key]
  const normalizedLang = normalizeLang(lang)

  return texts[normalizedLang] ?? texts.en ?? Object.values(texts)[0] ?? ''
}

export function translateDaysLeft(count: number, lang: TSubscriptionPageLanguageCode): string {
  const normalizedLang = normalizeLang(lang)

  if (normalizedLang === 'ru') {
    const rule = new Intl.PluralRules('ru').select(count)

    switch (rule) {
      case 'one':
        return `${count} день остался`
      case 'few':
        return `${count} дня осталось`
      default:
        return `${count} дней осталось`
    }
  }

  if (normalizedLang === 'fr') {
    return `${count} jour${count === 1 ? '' : 's'} restant${count === 1 ? '' : 's'}`
  }

  if (normalizedLang === 'fa') {
    return `${count} روز باقی مانده`
  }

  if (normalizedLang === 'zh') {
    return `剩余 ${count} 天`
  }

  return `${count} day${count === 1 ? '' : 's'} left`
}

export function useTranslation() {
  const appConfigStore = useAppConfigStore()
  const { currentLang, config } = storeToRefs(appConfigStore)

  const baseTranslations = computed(() => config.value?.baseTranslations)

  const t = (textObj: Record<string, string> | undefined) => {
    if (!textObj) return ''
    return getLocalizedText(textObj, currentLang.value)
  }

  const uiT = (key: UiTextKey) => resolveUiText(key, currentLang.value)

  return {
    t,
    translateDaysLeft,
    currentLang,
    baseTranslations,
    uiT,
  }
}
