import Image from 'next/image';
import {notFound} from 'next/navigation';
import {eventRepository} from '@/domain/events/eventRepository';
import {AppLocale, normalizeLocale} from '@/i18n';
import {formatDate} from '@/utils/format';
import {getTranslations} from 'next-intl/server';
import {EngagementBar} from '@/components/EngagementBar';

export default async function EventDetailPage({params}: { params: Promise<{ locale: string; id: string }> }) {
    const {locale, id} = await params;
    const normalizedLocale = normalizeLocale(locale) as AppLocale;
    const t = await getTranslations('event.detail');
    const event = await eventRepository.findByIdAndIncrementView(id);

    if (!event) {
        notFound();
    }

    return (
        <div className="container mx-auto max-w-5xl px-4 py-12 space-y-6">
            <div className="rounded-2xl bg-white p-6 dark:bg-gray-950">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{event.title}</h1>
                {event.subtitle && <p className="mt-1 text-gray-600 dark:text-gray-300">{event.subtitle}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatDate(event.startAt, normalizedLocale)}</span>
                    <span>-</span>
                    <span>{formatDate(event.endAt, normalizedLocale)}</span>
                    {event.location && (
                        <>
                            <span>-</span>
                            <span>{event.location}</span>
                        </>
                    )}
                </div>
                <div className="mt-4">
                    <EngagementBar
                        entity="event"
                        id={event.id}
                        initialViews={event.views ?? 0}
                        initialLikes={event.likes ?? 0}
                        labels={{views: t('views'), likes: t('likes')}}
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl">
                {event.bannerUrl ? (
                    <Image src={event.bannerUrl} alt={event.title} width={1200} height={600} className="h-auto w-full object-cover" />
                ) : (
                    <div className="flex aspect-[2/1] w-full items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-lg font-semibold text-white/75">
                        {t('placeholder')}
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <div className="rounded-2xl bg-white p-6 dark:bg-gray-950">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('detail')}</h3>
                        <div className="prose max-w-none whitespace-pre-wrap text-gray-800 dark:prose-invert dark:text-gray-100">
                            {event.description || t('noDescription')}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 dark:bg-gray-950">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('agenda')}</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{t('agendaPlaceholder')}</div>
                    </div>
                </div>

                <aside className="space-y-4">
                    <div className="rounded-2xl bg-white p-4 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-300">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('info')}</div>
                        <div className="mt-2 space-y-2">
                            <div>
                                <div className="text-xs uppercase text-gray-400">{t('time')}</div>
                                <div>
                                    {formatDate(event.startAt, normalizedLocale)} - {formatDate(event.endAt, normalizedLocale)}
                                </div>
                            </div>
                            {event.location && (
                                <div>
                                    <div className="text-xs uppercase text-gray-400">{t('location')}</div>
                                    <div>{event.location}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-300">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('register')}</div>
                        {event.registerLink ? (
                            <a
                                href={event.registerLink}
                                className="mt-2 inline-block rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t('registerCta')}
                            </a>
                        ) : (
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t('noRegister')}</p>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
