import {getRequestConfig} from 'next-intl/server';
import {DEFAULT_LOCALE, SUPPORTED_LOCALES, loadMessages, normalizeLocale} from '.';

export default getRequestConfig(async ({requestLocale}) => {
    const rawLocale = await requestLocale;
    const normalized = normalizeLocale(rawLocale);

    const locale: typeof SUPPORTED_LOCALES[number] =
        SUPPORTED_LOCALES.includes(normalized) ? normalized : DEFAULT_LOCALE;

    return {
        locale,
        messages: await loadMessages(locale),
    };
});
