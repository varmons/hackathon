'use client';

import Image from 'next/image';
import {MapPin} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {AppLocale} from '@/i18n';
import {formatDate} from '@/utils/format';

export type Idea = {
    id: string;
    title: string;
    summary: string;
    tags: string[];
    createdAt: string | Date;
    location?: string;
    thumbnail?: string;
};

type IdeaCardProps = {
    idea: Idea;
    locale: AppLocale;
};

export function IdeaCard({idea, locale}: IdeaCardProps) {
    const tCommon = useTranslations('component.common');

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            <div className="relative aspect-4/3 w-full overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-700">
                {idea.thumbnail ? (
                    <Image src={idea.thumbnail} alt={idea.title} fill className="object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-white/70">
                        {tCommon('ideaPlaceholder')}
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 text-xs uppercase tracking-wide text-gray-500">{formatDate(idea.createdAt, locale)}</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{idea.title}</h3>
                <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{idea.summary}</p>
                {idea.location && (
                    <div className="mb-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                        {idea.location}
                    </div>
                )}
                <div className="mt-auto flex flex-wrap gap-2">
                    {idea.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
