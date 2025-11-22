"use client";

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {MarkdownEditor} from './MarkdownEditor';
import {ImageUploader} from './ImageUploader';
import {TagSelector} from './TagSelector';
import {AttachmentUploader} from './AttachmentUploader';
import {httpClient} from '@/lib/httpClient';
import {AppLocale} from '@/i18n';

type StepKey = 1 | 2 | 3;

export function IdeaFormWizard({locale}: {locale: AppLocale}) {
    const t = useTranslations('idea.form');
    const router = useRouter();
    const [step, setStep] = useState<StepKey>(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const next = () =>
        setStep((prev) => {
            const nextVal = Math.min(prev + 1, 3) as StepKey;
            return nextVal;
        });
    const prev = () =>
        setStep((prev) => {
            const nextVal = Math.max(prev - 1, 1) as StepKey;
            return nextVal;
        });

    const submit = async () => {
        setError('');
        if (!title.trim()) {
            setError(t('missingTitle'));
            return;
        }
        setIsSubmitting(true);
        const payload = {
            title: title.trim(),
            description: description.trim(),
            images,
            tags,
        };
        const res = await httpClient.post<{id: string}>('/api/ideas', payload);
        if (!res.success) {
            setError(t('submitError'));
            setIsSubmitting(false);
            return;
        }
        router.push(`/${locale}/ideas/${res.data.id}`);
        router.refresh();
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <span
                                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                                    step === s ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-700'
                                }`}
                            >
                                {s}
                            </span>
                            {s < 3 && <span className="hidden h-px w-10 bg-gray-300 md:block" />}
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}

            {step === 1 && (
                <div className="space-y-4 rounded-2xl bg-gray-50 p-6 dark:bg-gray-900/60">
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">{t('fields.title')}</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={100}
                            className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            placeholder={t('placeholders.title')}
                        />
                        <div className="mt-1 text-xs text-gray-400">{title.length}/100</div>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">{t('fields.description')}</label>
                        <MarkdownEditor name="idea-description" placeholder={t('placeholders.description')} onChange={setDescription} />
                    </div>
                    <ul className="list-disc space-y-1 pl-4 text-xs text-gray-500 dark:text-gray-400">
                        <li>{t('tips.share')}</li>
                        <li>{t('tips.dev')}</li>
                        <li>{t('tips.edit')}</li>
                    </ul>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={next}
                            className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-900"
                        >
                            {t('next')}
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4 rounded-2xl bg-gray-50 p-6 dark:bg-gray-900/60">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('fields.images')}</div>
                    <ImageUploader value={images} onChange={setImages} />
                    <ul className="list-disc space-y-1 pl-4 text-xs text-gray-500 dark:text-gray-400">
                        <li>{t('tips.share')}</li>
                        <li>{t('tips.dev')}</li>
                        <li>{t('tips.edit')}</li>
                    </ul>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={prev}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            {t('prev')}
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-900"
                        >
                            {t('next')}
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4 rounded-2xl bg-gray-50 p-6 dark:bg-gray-900/60">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('fields.tags')}</div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t('optional')}</span>
                    </div>
                    <TagSelector value={tags} onChange={setTags} suggestions={['AI', 'Web3', 'DevOps', 'Game', 'Education', 'Social']} />
                    <AttachmentUploader />
                    <ul className="list-disc space-y-1 pl-4 text-xs text-gray-500 dark:text-gray-400">
                        <li>{t('tips.share')}</li>
                        <li>{t('tips.dev')}</li>
                        <li>{t('tips.edit')}</li>
                    </ul>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={prev}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            {t('prev')}
                        </button>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                                {t('saveDraft')}
                            </button>
                            <button
                                type="button"
                                onClick={submit}
                                disabled={isSubmitting}
                                className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-70"
                            >
                                {isSubmitting ? t('submitting') : t('submit')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
