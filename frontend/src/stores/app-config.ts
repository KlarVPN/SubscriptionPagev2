import { TSubscriptionPageLanguageCode, TSubscriptionPageRawConfig } from '@remnawave/subscription-page-types'
import LanguageDetector from 'i18next-browser-languagedetector'
import { defineStore } from 'pinia'

const detector = new LanguageDetector()

detector.init({
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage']
})

function detectLanguage(supportedLocales: TSubscriptionPageLanguageCode[]): TSubscriptionPageLanguageCode {
    const detected = detector.detect()
    const lang = Array.isArray(detected) ? detected[0] : detected
    const shortLang = lang?.split('-')[0]

    if (shortLang && supportedLocales.includes(shortLang as TSubscriptionPageLanguageCode)) {
        detector.cacheUserLanguage(shortLang)
        return shortLang as TSubscriptionPageLanguageCode
    }

    return supportedLocales[0] ?? 'en'
}

export const useAppConfigStore = defineStore('app-config', {
    state: () => ({
        config: null as null | TSubscriptionPageRawConfig,
        currentLang: 'en' as TSubscriptionPageLanguageCode,
        isLoaded: false
    }),
    actions: {
        setConfig(config: TSubscriptionPageRawConfig) {
            this.config = config
            this.currentLang = detectLanguage(config.locales)
            this.isLoaded = true
        },
        setLanguage(lang: TSubscriptionPageLanguageCode) {
            detector.cacheUserLanguage(lang)
            this.currentLang = lang
        },
        reset() {
            this.config = null
            this.currentLang = 'en'
            this.isLoaded = false
        }
    }
})
