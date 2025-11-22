'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

type IdeaFiltersProps = {
    tags: string[];
    onFilter: (tag: string | 'all', sort: string) => void;
};

const SORT_OPTIONS = ['latest', 'hot', 'contribution'] as const;

export function IdeaFilters({tags, onFilter}: IdeaFiltersProps) {
    const t = useTranslations('idea.list');
    const [activeTag, setActiveTag] = useState<'all' | string>('all');
    const [sort, setSort] = useState<string>('latest');

    const handleTag = (tag: 'all' | string) => {
        setActiveTag(tag);
        onFilter(tag, sort);
    };

    const handleSort = (value: string) => {
        setSort(value);
        onFilter(activeTag, value);
    };

    return (
        <div className="flex flex-col gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-900/60">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                <span className="text-sm text-gray-500">{t('tagLabel')}</span>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => handleTag('all')}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                            activeTag === 'all'
                                ? 'border-black bg-black text-white'
                                : 'border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300'
                        }`}
                    >
                        {t('all')}
                    </button>
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handleTag(tag)}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                activeTag === tag
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                <span className="text-sm text-gray-500">{t('sortLabel')}</span>
                <div className="flex flex-wrap gap-2">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleSort(option)}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                sort === option
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300'
                            }`}
                        >
                            {t(`sort.${option}`)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
