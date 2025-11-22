import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import {eventRepository} from '@/domain/events/eventRepository';
import {AppLocale, normalizeLocale} from '@/i18n';
import {EventGridClient} from '@/components/EventGridClient';

export default async function EventsPage({params}: { params: Promise<{ locale: string }> }) {
    const {locale} = await params;
    const normalizedLocale = normalizeLocale(locale) as AppLocale;
    const t = await getTranslations('event.list');
    const events = await eventRepository.list();
    const labels = {
        filterAll: t('filter.all'),
        sortLabel: t('sort.label'),
        sortUpcoming: t('sort.upcoming'),
        sortRecent: t('sort.recent'),
        status: {
            upcoming: t('status.upcoming'),
            running: t('status.running'),
            ended: t('status.ended'),
        },
        empty: t('empty'),
        placeholder: t('placeholder'),
    };

    return (
        <div className="container mx-auto max-w-5xl px-4 py-12 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
                </div>
                <Link
                    href={`/${normalizedLocale}/events/new`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    {t('create')}
                </Link>
            </div>

            <EventGridClient events={events} locale={normalizedLocale} labels={labels} />
        </div>
    );
}
