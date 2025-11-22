'use client';

import {useMemo, useState} from 'react';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {usePathname} from 'next/navigation';
import {Menu, X} from 'lucide-react';
import {AppLocale} from '@/i18n';
import {LanguageSwitcher} from './LanguageSwitcher';

type HeaderProps = {
    locale: AppLocale;
};

export default function Header({locale}: HeaderProps) {
    const tNav = useTranslations('nav');
    const tBrand = useTranslations('brand');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const currentPath = useMemo(() => pathname || '/', [pathname]);
    const [brandPrimary, brandSecondary] = useMemo(() => {
        const parts = tBrand('name').split(' ');
        return [parts.shift() || '', parts.join(' ')];
    }, [tBrand]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"
                        aria-label={tBrand('name')}
                    >
                        <span className="text-blue-600">{brandPrimary}</span>
                        {brandSecondary && <span className="text-gray-900 dark:text-white">{brandSecondary}</span>}
                    </Link>

                    <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400 md:flex">
                        <Link
                            href={`/${locale}`}
                            className="hover:text-gray-900 dark:hover:text-white"
                            data-active={currentPath === `/${locale}`}
                        >
                            {tNav('home')}
                        </Link>
                        <Link href={`/${locale}/ideas`} className="hover:text-gray-900 dark:hover:text-white">
                            {tNav('ideas')}
                        </Link>
                        <Link href={`/${locale}/events`} className="hover:text-gray-900 dark:hover:text-white">
                            {tNav('events')}
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex md:items-center">
                        <LanguageSwitcher currentLocale={locale} />
                    </div>

                    <div className="hidden md:block">
                        <Link
                            href={`/${locale}/submit`}
                            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            {tNav('submitCta')}
                        </Link>
                    </div>

                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950 md:hidden">
                    <nav className="flex flex-col gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Link href={`/${locale}`} onClick={() => setIsMenuOpen(false)}>
                            {tNav('home')}
                        </Link>
                        <Link href={`/${locale}/ideas`} onClick={() => setIsMenuOpen(false)}>
                            {tNav('ideas')}
                        </Link>
                        <Link href={`/${locale}/events`} onClick={() => setIsMenuOpen(false)}>
                            {tNav('events')}
                        </Link>
                        <Link href={`/${locale}/submit`} onClick={() => setIsMenuOpen(false)}>
                            {tNav('submit')}
                        </Link>
                        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                            <span className="text-xs text-gray-500">{tNav('language')}</span>
                            <LanguageSwitcher currentLocale={locale} />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
