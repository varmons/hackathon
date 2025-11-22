import {AppLocale, SUPPORTED_LOCALES} from '@/i18n';

type BuildPathParams = {
    pathname?: string | null;
    targetLocale: AppLocale;
    searchParams?: string | null;
};

export function buildLocalizedPath({pathname, targetLocale, searchParams}: BuildPathParams) {
    const normalizedPath = pathname || '/';
    const segments = normalizedPath.split('/').filter(Boolean);

    if (segments.length > 0) {
        const first = segments[0];
        if (SUPPORTED_LOCALES.includes(first as AppLocale)) {
            segments[0] = targetLocale;
        } else {
            segments.unshift(targetLocale);
        }
    } else {
        segments.push(targetLocale);
    }

    const path = `/${segments.join('/')}`;
    return searchParams ? `${path}?${searchParams}` : path;
}
