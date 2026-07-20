import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { getLocalizedText } from '@/shared/utils/config-parser'
import { useAppConfigStore } from '@/stores/app-config'

export function useTranslation() {
  const appConfigStore = useAppConfigStore()
  const { currentLang, config } = storeToRefs(appConfigStore)

  const baseTranslations = computed(() => config.value?.baseTranslations)

  const t = (textObj: Record<string, string> | undefined) => {
    if (!textObj) return ''
    return getLocalizedText(textObj, currentLang.value)
  }

  return {
    t,
    currentLang,
    baseTranslations,
  }
}
