import { APP_CONFIG_ROUTE_LEADING_PATH, SubscriptionPageRawConfigSchema } from '@remnawave/subscription-page-types'
import { GetSubscriptionInfoByShortUuidCommand } from '@remnawave/backend-contract'
import consola from 'consola/browser'
import { ofetch } from 'ofetch'

import { loadMockAppConfig } from '../shared/mock/mock-app-config'
import { MOCK_SUBSCRIPTION_INFO } from '../shared/mock/mock-data'
import { useSubscriptionStore } from '../stores/subscription'
import { useAppConfigStore } from '../stores/app-config'

const IS_MOCK_MODE = import.meta.env.DEV && import.meta.env.VITE_MOCK_MODE === 'true'

function readSubscriptionFromPanelData(): GetSubscriptionInfoByShortUuidCommand.Response['response'] | null {
    const subPageDiv = document.getElementById('sbpg')
    const subscriptionUrl = subPageDiv?.dataset.panel

    if (!subscriptionUrl) return null

    try {
        const subscription: GetSubscriptionInfoByShortUuidCommand.Response = JSON.parse(
            atob(subscriptionUrl)
        )

        return subscription.response
    } catch (error) {
        consola.log(error)
        return null
    } finally {
        subPageDiv?.remove()
    }
}

export async function bootstrapApp(): Promise<void> {
    const appConfigStore = useAppConfigStore()
    const subscriptionStore = useSubscriptionStore()

    if (appConfigStore.isLoaded) return

    if (IS_MOCK_MODE) {
        subscriptionStore.setSubscription(MOCK_SUBSCRIPTION_INFO)
        appConfigStore.setConfig(await loadMockAppConfig())
        return
    }

    const subscription = readSubscriptionFromPanelData()
    if (subscription) {
        subscriptionStore.setSubscription(subscription)
    }

    try {
        const tempConfig = await ofetch<unknown>(`${APP_CONFIG_ROUTE_LEADING_PATH}?v=${Date.now()}`, {
            parseResponse: (response) => JSON.parse(response)
        })

        const parsedConfig = await SubscriptionPageRawConfigSchema.safeParseAsync(tempConfig)

        if (!parsedConfig.success) {
            consola.error('Failed to parse app config:', parsedConfig.error)
            return
        }

        appConfigStore.setConfig(parsedConfig.data)
    } catch (error) {
        consola.error('Failed to fetch app config:', error)
    }
}
