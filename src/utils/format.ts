import {AppLocale} from '@/i18n';

export const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
};

export function formatDate(
    value: string | number | Date,
    locale: AppLocale,
    options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS,
) {
    return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}

export function formatNumber(value: number, locale: AppLocale) {
    return new Intl.NumberFormat(locale).format(value);
}
