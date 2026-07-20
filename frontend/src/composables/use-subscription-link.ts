import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { constructSubscriptionUrl } from '@/shared/utils/construct-subscription-url'
import { useSubscriptionStore } from '@/stores/subscription'

export function useSubscriptionLink() {
  const subscriptionStore = useSubscriptionStore()
  const { subscription } = storeToRefs(subscriptionStore)

  const subscriptionUrl = computed(() => {
    if (!subscription.value || typeof window === 'undefined') return ''

    return constructSubscriptionUrl(window.location.href, subscription.value.user.shortUuid)
  })

  return {
    subscriptionUrl,
  }
}
