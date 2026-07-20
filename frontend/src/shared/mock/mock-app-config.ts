import {
  SubscriptionPageRawConfigSchema,
  TSubscriptionPageLanguageCode,
  TSubscriptionPagePlatformKey,
  TSubscriptionPageRawConfig,
} from '@remnawave/subscription-page-types'
import consola from 'consola/browser'

const SHARED_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2l3.2 6.5L22 9.4l-5 4.9 1.2 6.9L12 17.8 5.8 21.2 7 14.3 2 9.4l6.8-.9L12 2z" />
</svg>
`

const BASE_TRANSLATION_DEFAULTS = {
  installationGuideHeader: 'Installation guide',
  connectionKeysHeader: 'Connection keys',
  linkCopied: 'Link copied',
  linkCopiedToClipboard: 'The link has been copied to your clipboard',
  getLink: 'Get link',
  scanQrCode: 'Scan the QR code',
  scanQrCodeDescription: 'Use the link below if QR scanning is not available.',
  copyLink: 'Copy link',
  name: 'Name',
  status: 'Status',
  active: 'Active',
  inactive: 'Inactive',
  expires: 'Expires',
  bandwidth: 'Bandwidth',
  used: 'used',
  scanToImport: 'Scan to import',
  expiresIn: 'Expires in',
  expired: 'Expired',
  unknown: 'Unknown',
  indefinitely: 'Indefinitely',
} as const

type LocaleText = Record<string, string> | undefined

type MockSourceButton = {
  buttonLink: string
  buttonText: LocaleText
}

type MockSourceSection = {
  buttons?: MockSourceButton[]
  description?: LocaleText
  title?: LocaleText
}

type MockSourceApp = {
  additionalAfterAddSubscriptionStep?: MockSourceSection
  addSubscriptionStep?: MockSourceSection
  connectAndUseStep?: MockSourceSection
  id: string
  installationStep?: MockSourceSection
  isFeatured?: boolean
  isNeedBase64Encoding?: boolean
  name: string
  urlScheme?: string
}

type MockSourceConfig = {
  config?: {
    additionalLocales?: string[]
    branding?: {
      logoUrl?: string
      name?: string
      supportUrl?: string
    }
  }
  platforms?: Partial<Record<TSubscriptionPagePlatformKey, MockSourceApp[]>>
}

const PLATFORM_DISPLAY_NAMES: Record<TSubscriptionPagePlatformKey, string> = {
  ios: 'iOS',
  android: 'Android',
  linux: 'Linux',
  macos: 'macOS',
  windows: 'Windows',
  androidTV: 'Android TV',
  appleTV: 'Apple TV',
}

const MOCK_SOURCE_URL = '/mock/app-config.json'

function toLocalizedRecord(
  value: LocaleText | string,
  locales: TSubscriptionPageLanguageCode[],
): Record<string, string> {
  if (!value) {
    return Object.fromEntries(locales.map((locale) => [locale, ''])) as Record<string, string>
  }

  if (typeof value === 'string') {
    return Object.fromEntries(locales.map((locale) => [locale, value])) as Record<string, string>
  }

  const fallback = value.en ?? Object.values(value)[0] ?? ''

  return Object.fromEntries(locales.map((locale) => [locale, value[locale] ?? fallback])) as Record<
    string,
    string
  >
}

function createSvgLibrary(keys: string[]): Record<string, string> {
  return Object.fromEntries(keys.map((key) => [key, SHARED_ICON]))
}

function makeBlockIcons(appKey: string): string[] {
  return [
    `platform-${appKey}`,
    `app-${appKey}`,
    `block-install-${appKey}`,
    `block-subscribe-${appKey}`,
    `block-extra-${appKey}`,
    `block-connect-${appKey}`,
    `button-external-${appKey}`,
    `button-subscription-${appKey}`,
  ]
}

function buildRuntimeConfig(source: MockSourceConfig): TSubscriptionPageRawConfig {
  const locales = [
    'en',
    ...new Set((source.config?.additionalLocales ?? []).filter(Boolean)),
  ] as TSubscriptionPageLanguageCode[]

  const branding = source.config?.branding ?? {
    name: 'Subscription Preview',
    logoUrl: 'https://docs.rw/img/logo.svg',
    supportUrl: 'https://t.me/remnawave',
  }

  const baseTranslations = Object.fromEntries(
    Object.entries(BASE_TRANSLATION_DEFAULTS).map(([key, value]) => [
      key,
      toLocalizedRecord(value, locales),
    ]),
  ) as TSubscriptionPageRawConfig['baseTranslations']

  const svgLibraryEntries: string[] = []
  const platforms = Object.fromEntries(
    Object.entries(source.platforms ?? {}).map(([platformKey, apps]) => {
      const platform = platformKey as TSubscriptionPagePlatformKey
      const platformSvgKey = `platform-${platform}`

      svgLibraryEntries.push(platformSvgKey)

      const runtimeApps = (apps ?? []).map((app) => {
        const appSvgKey = `app-${platform}-${app.id}`
        const blockSvgKeys = makeBlockIcons(`${platform}-${app.id}`)

        svgLibraryEntries.push(appSvgKey, ...blockSvgKeys)

        const installationButtons = (app.installationStep?.buttons ?? []).map((button) => {
          const buttonSvgKey = `button-external-${platform}-${app.id}`

          svgLibraryEntries.push(buttonSvgKey)

          return {
            type: 'external' as const,
            svgIconKey: buttonSvgKey,
            link: button.buttonLink,
            text: toLocalizedRecord(button.buttonText, locales),
          }
        })

        const subscriptionButtons = app.urlScheme
          ? [
              {
                type: 'subscriptionLink' as const,
                svgIconKey: `button-subscription-${platform}-${app.id}`,
                link: `${app.urlScheme}{{SUBSCRIPTION_LINK}}`,
                text: toLocalizedRecord(`Open ${app.name}`, locales),
              },
            ]
          : []

        const extraButtons = (app.additionalAfterAddSubscriptionStep?.buttons ?? []).map(
          (button) => {
            const buttonSvgKey = `button-external-${platform}-${app.id}-extra`

            svgLibraryEntries.push(buttonSvgKey)

            return {
              type: 'external' as const,
              svgIconKey: buttonSvgKey,
              link: button.buttonLink,
              text: toLocalizedRecord(button.buttonText, locales),
            }
          },
        )

        const blocks = [
          app.installationStep
            ? {
                svgIconKey: `block-install-${platform}-${app.id}`,
                svgIconColor: '#22d3ee',
                title: toLocalizedRecord(`Install ${app.name}`, locales),
                description: toLocalizedRecord(
                  app.installationStep.description ?? `Install ${app.name}`,
                  locales,
                ),
                buttons: installationButtons,
              }
            : null,
          app.addSubscriptionStep
            ? {
                svgIconKey: `block-subscribe-${platform}-${app.id}`,
                svgIconColor: '#34d399',
                title: toLocalizedRecord('Add subscription', locales),
                description: toLocalizedRecord(
                  app.addSubscriptionStep.description ?? 'Add subscription',
                  locales,
                ),
                buttons: subscriptionButtons,
              }
            : null,
          app.additionalAfterAddSubscriptionStep
            ? {
                svgIconKey: `block-extra-${platform}-${app.id}`,
                svgIconColor: '#f59e0b',
                title: toLocalizedRecord(
                  app.additionalAfterAddSubscriptionStep.title ?? 'Additional steps',
                  locales,
                ),
                description: toLocalizedRecord(
                  app.additionalAfterAddSubscriptionStep.description ?? '',
                  locales,
                ),
                buttons: extraButtons,
              }
            : null,
          app.connectAndUseStep
            ? {
                svgIconKey: `block-connect-${platform}-${app.id}`,
                svgIconColor: '#a78bfa',
                title: toLocalizedRecord('Connect and use', locales),
                description: toLocalizedRecord(
                  app.connectAndUseStep.description ?? 'Connect and use',
                  locales,
                ),
                buttons: [],
              }
            : null,
        ].filter(Boolean)

        return {
          name: app.name,
          featured: Boolean(app.isFeatured),
          svgIconKey: appSvgKey,
          blocks,
        }
      })

      return [
        platform,
        {
          svgIconKey: platformSvgKey,
          displayName: toLocalizedRecord(PLATFORM_DISPLAY_NAMES[platform], locales),
          apps: runtimeApps,
        },
      ] as const
    }),
  ) as TSubscriptionPageRawConfig['platforms']

  const fallbackSvgKeys = [
    'mock-platform',
    'mock-app',
    'mock-block',
    'mock-external',
    'mock-subscription',
  ]
  const svgLibrary = createSvgLibrary([...new Set([...fallbackSvgKeys, ...svgLibraryEntries])])

  return {
    version: '1',
    locales,
    brandingSettings: {
      title: branding.name ?? 'Subscription Preview',
      logoUrl: branding.logoUrl ?? 'https://docs.rw/img/logo.svg',
      supportUrl: branding.supportUrl ?? 'https://t.me/remnawave',
    },
    uiConfig: {
      subscriptionInfoBlockType: 'cards',
      installationGuidesBlockType: 'cards',
    },
    baseSettings: {
      metaTitle: branding.name ?? 'Subscription Preview',
      metaDescription: `${branding.name ?? 'Subscription Preview'} mock`,
      showConnectionKeys: true,
      hideGetLinkButton: false,
    },
    baseTranslations,
    svgLibrary,
    platforms,
  } as TSubscriptionPageRawConfig
}

export async function loadMockAppConfig(): Promise<TSubscriptionPageRawConfig> {
  try {
    const response = await fetch(MOCK_SOURCE_URL)

    if (!response.ok) {
      throw new Error(`Failed to load mock app-config from ${MOCK_SOURCE_URL}: ${response.status}`)
    }

    const source = (await response.json()) as unknown

    const runtimeConfig = await SubscriptionPageRawConfigSchema.safeParseAsync(source)
    if (runtimeConfig.success) {
      return runtimeConfig.data
    }

    const legacySource = source as MockSourceConfig
    return buildRuntimeConfig(legacySource)
  } catch (error) {
    consola.error(error)

    return buildRuntimeConfig({
      config: {
        branding: {
          name: 'Subscription Preview',
          logoUrl: 'https://docs.rw/img/logo.svg',
          supportUrl: 'https://t.me/remnawave',
        },
      },
      platforms: {},
    })
  }
}
