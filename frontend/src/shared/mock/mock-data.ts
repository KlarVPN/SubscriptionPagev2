import { GetSubscriptionInfoByShortUuidCommand } from '@remnawave/backend-contract'
import { TSubscriptionPageRawConfig } from '@remnawave/subscription-page-types'

const MOCK_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 12h16" />
    <path d="M12 4v16" />
</svg>
`

export const MOCK_APP_CONFIG = {
  version: '1',
  locales: ['en'],
  brandingSettings: {
    title: 'Subscription Preview',
    logoUrl: 'https://docs.rw/img/logo.svg',
    supportUrl: 'https://t.me/remnawave',
  },
  uiConfig: {
    subscriptionInfoBlockType: 'cards',
    installationGuidesBlockType: 'cards',
  },
  baseSettings: {
    metaTitle: 'Subscription Preview',
    metaDescription: 'Frontend mock mode',
    showConnectionKeys: true,
    hideGetLinkButton: false,
  },
  baseTranslations: {
    installationGuideHeader: { en: 'Installation guide' },
    connectionKeysHeader: { en: 'Connection keys' },
    linkCopied: { en: 'Link copied' },
    linkCopiedToClipboard: { en: 'The link has been copied to your clipboard' },
    getLink: { en: 'Get link' },
    scanQrCode: { en: 'Scan the QR code' },
    scanQrCodeDescription: { en: 'Use the link below if QR scanning is not available.' },
    copyLink: { en: 'Copy link' },
    name: { en: 'Name' },
    status: { en: 'Status' },
    active: { en: 'Active' },
    inactive: { en: 'Inactive' },
    expires: { en: 'Expires' },
    bandwidth: { en: 'Bandwidth' },
    used: { en: 'used' },
    scanToImport: { en: 'Scan to import' },
    expiresIn: { en: 'Expires in' },
    expired: { en: 'Expired' },
    unknown: { en: 'Unknown' },
    indefinitely: { en: 'Indefinitely' },
  },
  svgLibrary: {
    'mock-platform': MOCK_ICON,
    'mock-app': MOCK_ICON,
    'mock-block': MOCK_ICON,
    'mock-external': MOCK_ICON,
    'mock-subscription': MOCK_ICON,
  },
  platforms: {
    ios: {
      svgIconKey: 'mock-platform',
      displayName: { en: 'iOS' },
      apps: [
        {
          name: 'Demo app',
          featured: true,
          svgIconKey: 'mock-app',
          blocks: [
            {
              svgIconKey: 'mock-block',
              svgIconColor: '#22d3ee',
              title: { en: 'Preview the layout' },
              description: {
                en: 'This mock mode is for frontend work only. It keeps the UI interactive without calling the backend.',
              },
              buttons: [
                {
                  type: 'external',
                  svgIconKey: 'mock-external',
                  link: 'https://example.com',
                  text: { en: 'External link' },
                },
                {
                  type: 'subscriptionLink',
                  svgIconKey: 'mock-subscription',
                  link: '{{SUBSCRIPTION_LINK}}',
                  text: { en: 'Open subscription' },
                },
              ],
            },
          ],
        },
      ],
    },
  },
} as unknown as TSubscriptionPageRawConfig

export const MOCK_SUBSCRIPTION_INFO = {
  isFound: true,
  user: {
    shortUuid: 'mock-short-uuid',
    daysLeft: 14,
    trafficUsed: '42 GB',
    trafficLimit: '100 GB',
    lifetimeTrafficUsed: '133 GB',
    trafficUsedBytes: '45000000000',
    trafficLimitBytes: '107374182400',
    lifetimeTrafficUsedBytes: '143000000000',
    username: 'mock-user',
    expiresAt: new Date('2099-12-31T23:59:59.000Z'),
    isActive: true,
    userStatus: 'ACTIVE',
    trafficLimitStrategy: 'MONTH',
  },
  links: ['vless://mock@127.0.0.1:443?type=tcp#Mock%20VLESS', 'ss://mock@127.0.0.1:8388#Mock%20SS'],
  ssConfLinks: {
    shadowrocket: 'ss://mock-shadowrocket',
    clash: 'clash://mock-clash',
  },
  subscriptionUrl: 'https://example.com/subscription/mock-short-uuid',
} as unknown as GetSubscriptionInfoByShortUuidCommand.Response['response']
