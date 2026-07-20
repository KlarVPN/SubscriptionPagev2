import { computed } from 'vue'

import { getLocalizedText } from '../shared/utils/config-parser'
import { useAppConfigStore } from '../stores/app-config'

export function useTranslation() {
    const appConfigStore = useAppConfigStore()

    const currentLang = computed(() => appConfigStore.currentLang)
    const baseTranslations = computed(() => appConfigStore.config?.baseTranslations)

    const t = (textObj: Record<string, string> | undefined) => {
        if (!textObj) return ''
        return getLocalizedText(textObj, appConfigStore.currentLang)
    }

    return {
        t,
        currentLang,
        baseTranslations
    }
}
