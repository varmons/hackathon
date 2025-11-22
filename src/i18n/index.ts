export const SUPPORTED_LOCALES = ['en', 'zh-CN', 'ja-JP'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'en';
const LOCALE_FALLBACKS: Record<string, AppLocale> = {
    en: 'en',
    'en-US': 'en',
    'en-GB': 'en',
    zh: 'zh-CN',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-CN',
    ja: 'ja-JP',
    'ja-JP': 'ja-JP',
};

export const LOCALE_LABELS: Record<AppLocale, string> = {
    en: 'English',
    'zh-CN': '简体中文',
    'ja-JP': '日本語',
};

export const RTL_LOCALES: AppLocale[] = []; // Reserved for future RTL support

export function normalizeLocale(input?: string | null): AppLocale {
    if (!input) return DEFAULT_LOCALE;
    return LOCALE_FALLBACKS[input] ?? DEFAULT_LOCALE;
}

export async function loadMessages(locale: AppLocale) {
    const normalized = normalizeLocale(locale);
    switch (normalized) {
    case 'zh-CN':
        return (await import('./locales/zh-CN/common.json')).default;
    case 'ja-JP':
        return (await import('./locales/ja-JP/common.json')).default;
    case 'en':
    default:
        return (await import('./locales/en/common.json')).default;
    }
}

export function getDirection(locale: AppLocale): 'ltr' | 'rtl' {
    return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
}
