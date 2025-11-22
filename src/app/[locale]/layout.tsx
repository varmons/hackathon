import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import '@/app/globals.css';
import {AppLocale, DEFAULT_LOCALE, getDirection, normalizeLocale} from '@/i18n';

export const metadata = {
    title: 'Hackathon Showcase',
    description: 'Discover and share amazing hackathon projects',
};

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const {locale} = await params;
    const normalizedLocale = (normalizeLocale(locale) as AppLocale) ?? DEFAULT_LOCALE;
    const messages = await getMessages();

    return (
        <html lang={normalizedLocale} dir={getDirection(normalizedLocale)} className="h-full">
            <body
                className={`font-sans flex min-h-full flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
            >
                <NextIntlClientProvider messages={messages} locale={normalizedLocale}>
                    <Header locale={normalizedLocale} />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
