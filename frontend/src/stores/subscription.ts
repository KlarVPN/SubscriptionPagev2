import { GetSubscriptionInfoByShortUuidCommand } from '@remnawave/backend-contract'
import { defineStore } from 'pinia'

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    subscription: null as GetSubscriptionInfoByShortUuidCommand.Response['response'] | null,
  }),
  actions: {
    setSubscription(subscription: GetSubscriptionInfoByShortUuidCommand.Response['response']) {
      this.subscription = subscription
    },
    reset() {
      this.subscription = null
    },
  },
})
