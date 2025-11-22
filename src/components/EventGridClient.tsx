'use client';

import Link from 'next/link';
import {useMemo, useState} from 'react';
import {AppLocale} from '@/i18n';
import {formatDate} from '@/utils/format';

type EventItem = {
    id: string;
    title: string;
    subtitle?: string | null;
    status?: string | null;
    startAt: string | Date;
    endAt: string | Date;
    location?: string | null;
    bannerUrl?: string | null;
};

type Props = {
    events: EventItem[];
    locale: AppLocale;
    labels: {
        filterAll: string;
        sortLabel: string;
        sortUpcoming: string;
        sortRecent: string;
        status: {
            upcoming: string;
            running: string;
            ended: string;
        };
        empty: string;
        placeholder: string;
    };
};

const SORTS = [
    {key: 'upcoming', label: 'sort.upcoming'},
    {key: 'recent', label: 'sort.recent'},
] as const;

export function EventGridClient({events, locale, labels}: Props) {
    const [activeStatus, setActiveStatus] = useState<'all' | 'upcoming' | 'running' | 'ended'>('all');
    const [sort, setSort] = useState<'upcoming' | 'recent'>('upcoming');

    const statusList = useMemo(
        () => [
            {key: 'all', label: labels.filterAll},
            {key: 'upcoming', label: labels.status.upcoming},
            {key: 'running', label: labels.status.running},
            {key: 'ended', label: labels.status.ended},
        ],
        [labels],
    );

    const computeStatus = (item: EventItem): 'upcoming' | 'running' | 'ended' => {
        if (item.status === 'running' || item.status === 'ended' || item.status === 'upcoming') {
            return item.status;
        }
        const now = Date.now();
        const start = new Date(item.startAt).getTime();
        const end = new Date(item.endAt).getTime();
        if (end < now) return 'ended';
        if (start <= now && end >= now) return 'running';
        return 'upcoming';
    };

    const filtered = useMemo(() => {
        let list = events;
        if (activeStatus !== 'all') {
            list = events.filter((ev) => computeStatus(ev) === activeStatus);
        }
        if (sort === 'upcoming') {
            list = [...list].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
        } else {
            list = [...list].sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
        }
        return list;
    }, [events, activeStatus, sort]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                    {statusList.map((s) => (
                        <button
                            key={s.key}
                            type="button"
                            onClick={() => setActiveStatus(s.key as typeof activeStatus)}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                activeStatus === s.key
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300'
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>{labels.sortLabel}</span>
                    <select
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        value={sort}
                        onChange={(e) => setSort(e.target.value as typeof sort)}
                    >
                        {SORTS.map((s) => (
                            <option key={s.key} value={s.key}>
                                {labels[s.key === 'upcoming' ? 'sortUpcoming' : 'sortRecent']}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((event) => (
                    <Link
                        key={event.id}
                        href={`/${locale}/events/${event.id}`}
                        className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
                            {event.bannerUrl ? (
                                <img src={event.bannerUrl} alt={event.title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white/70">
                                    {labels.placeholder}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                            <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">
                                {labels.status[computeStatus(event)]}
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h2>
                            {event.subtitle && <p className="text-sm text-gray-600 dark:text-gray-400">{event.subtitle}</p>}
                            <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                                {formatDate(event.startAt, locale)} - {formatDate(event.endAt, locale)}
                            </div>
                            {event.location && <div className="text-sm text-gray-500 dark:text-gray-400">{event.location}</div>}
                        </div>
                    </Link>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-2 rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        {labels.empty}
                    </div>
                )}
            </div>
        </div>
    );
}
