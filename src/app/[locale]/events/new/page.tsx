import {EventForm} from '@/components/EventForm';
import {AppLocale, normalizeLocale} from '@/i18n';
import {getTranslations} from 'next-intl/server';

export default async function NewEventPage({params}: { params: Promise<{ locale: string }> }) {
    const {locale} = await params;
    const normalizedLocale = normalizeLocale(locale) as AppLocale;
    const t = await getTranslations('event.create');

    return (
        <div className="container mx-auto max-w-5xl px-4 py-12 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
            </div>
            <div className="rounded-2xl bg-white p-6 dark:bg-gray-950 md:p-10">
                <EventForm locale={normalizedLocale} />
            </div>
        </div>
    );
}
