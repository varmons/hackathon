'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Github, Menu, X } from 'lucide-react';

export default function Header({ locale }: { locale: string }) {
    const t = useTranslations('Header');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href={`/${locale}`} className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                        <span className="text-blue-600">Hackathon</span>Showcase
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Link href={`/${locale}`} className="hover:text-gray-900 dark:hover:text-white">
                            {t('explore')}
                        </Link>
                        <Link href={`/${locale}/submit`} className="hover:text-gray-900 dark:hover:text-white">
                            {t('submit')}
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2">
                        <Link href="/en" className={`text-xs ${locale === 'en' ? 'font-bold' : ''}`}>EN</Link>
                        <Link href="/zh" className={`text-xs ${locale === 'zh' ? 'font-bold' : ''}`}>中文</Link>
                        <Link href="/ja" className={`text-xs ${locale === 'ja' ? 'font-bold' : ''}`}>JP</Link>
                    </div>

                    <div className="hidden md:block">
                        <Link
                            href={`/${locale}/submit`}
                            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            {t('submitProject')}
                        </Link>
                    </div>

                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950 md:hidden">
                    <nav className="flex flex-col gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Link href={`/${locale}`} onClick={() => setIsMenuOpen(false)}>
                            {t('explore')}
                        </Link>
                        <Link href={`/${locale}/submit`} onClick={() => setIsMenuOpen(false)}>
                            {t('submit')}
                        </Link>
                        <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <Link href="/en" className={locale === 'en' ? 'font-bold' : ''}>English</Link>
                            <Link href="/zh" className={locale === 'zh' ? 'font-bold' : ''}>中文</Link>
                            <Link href="/ja" className={locale === 'ja' ? 'font-bold' : ''}>日本語</Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
