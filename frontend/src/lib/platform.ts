import { TSubscriptionPagePlatformKey } from '@remnawave/subscription-page-types'

export function detectPlatform(): TSubscriptionPagePlatformKey | undefined {
    if (typeof navigator === 'undefined') return undefined

    const ua = `${navigator.userAgent} ${navigator.platform}`.toLowerCase()

    if (ua.includes('android')) return 'android'
    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios'
    if (ua.includes('linux')) return 'linux'
    if (ua.includes('mac')) return 'macos'
    if (ua.includes('win')) return 'windows'

    return undefined
}
