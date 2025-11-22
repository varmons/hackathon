'use client';

import {useTransition} from 'react';
import {useTranslations} from 'next-intl';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {AppLocale, LOCALE_LABELS, SUPPORTED_LOCALES} from '@/i18n';
import {buildLocalizedPath} from '@/utils/navigation';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

type Props = {
    currentLocale: AppLocale;
};

export function LanguageSwitcher({currentLocale}: Props) {
    const t = useTranslations('nav');
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const setLocale = (nextLocale: AppLocale) => {
        document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=${ONE_YEAR_SECONDS}`;
        const targetPath = buildLocalizedPath({
            pathname,
            searchParams: searchParams?.toString(),
            targetLocale: nextLocale,
        });
        startTransition(() => router.push(targetPath));
    };

    return (
        <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 text-xs dark:border-gray-700 dark:bg-gray-900">
            <span className="sr-only">{t('language')}</span>
            {SUPPORTED_LOCALES.map((code) => (
                <button
                    key={code}
                    type="button"
                    disabled={isPending || code === currentLocale}
                    onClick={() => setLocale(code)}
                    className={`rounded-full px-2 py-1 transition ${
                        code === currentLocale
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                >
                    {LOCALE_LABELS[code]}
                </button>
            ))}
        </div>
    );
}
