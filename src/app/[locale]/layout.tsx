import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Hackathon Showcase',
    description: 'Discover and share amazing hackathon projects',
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} className="h-full">
            <body className={`${inter.className} flex min-h-full flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}>
                <NextIntlClientProvider messages={messages}>
                    <Header locale={locale} />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
