'use client';

import {useMemo, useState} from 'react';
import {X} from 'lucide-react';
import {useTranslations} from 'next-intl';

type TagSelectorProps = {
    value: string[];
    onChange: (tags: string[]) => void;
    suggestions?: string[];
};

const PRESETS = ['AI', 'Web3', 'Frontend', 'Backend', 'Mobile', 'OpenSource', 'DevOps', 'Game', 'Education', 'Social'];

export function TagSelector({value, onChange, suggestions = PRESETS}: TagSelectorProps) {
    const t = useTranslations('form.project.tagsField');
    const [input, setInput] = useState('');

    const available = useMemo(
        () => suggestions.filter((item) => !value.includes(item)),
        [suggestions, value],
    );

    const addTag = (tag: string) => {
        const next = tag.trim();
        if (!next) return;
        if (value.includes(next)) return;
        onChange([...value, next]);
        setInput('');
    };

    const removeTag = (tag: string) => {
        onChange(value.filter((item) => item !== tag));
    };

    return (
        <div className="space-y-3">
            <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">{t('title')}</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('hint')}</p>
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag(input);
                        }
                    }}
                    placeholder={t('placeholder')}
                    className="flex-1 rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                    type="button"
                    onClick={() => addTag(input)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    {t('create')}
                </button>
            </div>

            {value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {value.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-100"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="rounded-full p-1 text-blue-500 transition hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-800"
                                aria-label={t('remove', {tag})}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {available.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('suggestions')}</p>
                    <div className="flex flex-wrap gap-2">
                        {available.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => addTag(tag)}
                                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
