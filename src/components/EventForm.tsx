'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Loader2} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {z} from 'zod';
import {httpClient} from '@/lib/httpClient';
import {AppLocale} from '@/i18n';
import {MarkdownEditor} from './MarkdownEditor';
import {ImageUploader} from './ImageUploader';
import {AttachmentUploader, AttachmentPayload} from './AttachmentUploader';

type EventFormProps = {
    locale: AppLocale;
};

const eventSchema = z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    startAt: z.string().min(1),
    endAt: z.string().min(1),
    registerLink: z.string().url().optional().or(z.literal('')),
    registerDeadline: z.string().optional(),
    capacity: z.string().optional(),
    bannerUrl: z.string().optional(),
    galleryUrls: z.array(z.string()).max(10).optional(),
    attachments: z.array(
        z.object({
            name: z.string(),
            type: z.string(),
            size: z.number(),
            content: z.string(),
        }),
    ).max(10).optional(),
    status: z.string().optional(),
});

const RequiredMark = () => (
    <span className="ml-1 text-red-500" aria-hidden="true">
        *
    </span>
);

export function EventForm({locale}: EventFormProps) {
    const t = useTranslations('event.form');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [gallery, setGallery] = useState<string[]>([]);
    const [attachments, setAttachments] = useState<AttachmentPayload[]>([]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        const form = new FormData(event.currentTarget);
        const payload = {
            title: (form.get('title') as string | null)?.trim() ?? '',
            subtitle: (form.get('subtitle') as string | null)?.trim() || undefined,
            summary: (form.get('summary') as string | null)?.trim() || undefined,
            description: (form.get('description') as string | null)?.trim() || undefined,
            location: (form.get('location') as string | null)?.trim() || undefined,
            startAt: (form.get('startAt') as string | null) ?? '',
            endAt: (form.get('endAt') as string | null) ?? '',
            registerLink: (form.get('registerLink') as string | null)?.trim() || undefined,
            registerDeadline: (form.get('registerDeadline') as string | null) || undefined,
            capacity: (form.get('capacity') as string | null) || undefined,
            bannerUrl: (form.get('bannerUrl') as string | null)?.trim() || undefined,
            galleryUrls: gallery,
            attachments,
            status: form.get('status') as string,
        };

        const validated = eventSchema.safeParse(payload);
        if (!validated.success) {
            setIsLoading(false);
            setError(t('validationError'));
            return;
        }

        const res = await httpClient.post('/api/events', validated.data);
        if (!res.success) {
            setIsLoading(false);
            setError(t('error'));
            return;
        }
        router.push(`/${locale}/events`);
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="space-y-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/60">
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">
                        {t('title')}
                        <RequiredMark />
                    </label>
                    <input
                        name="title"
                        required
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder={t('titlePlaceholder')}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">{t('subtitle')}</label>
                    <input
                        name="subtitle"
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder={t('subtitlePlaceholder')}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">{t('summary')}</label>
                    <textarea
                        name="summary"
                        rows={3}
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder={t('summaryPlaceholder')}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">{t('location')}</label>
                    <input
                        name="location"
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder={t('locationPlaceholder')}
                    />
                </div>
            </div>

            <div className="grid gap-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/60 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">
                        {t('startAt')}
                        <RequiredMark />
                    </label>
                    <input
                        type="datetime-local"
                        name="startAt"
                        required
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">
                        {t('endAt')}
                        <RequiredMark />
                    </label>
                    <input
                        type="datetime-local"
                        name="endAt"
                        required
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>
            </div>

            <div className="grid gap-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/60 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">{t('registerLink')}</label>
                    <input
                        name="registerLink"
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder={t('registerLinkPlaceholder')}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">{t('registerDeadline')}</label>
                    <input
                        type="datetime-local"
                        name="registerDeadline"
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">{t('capacity')}</label>
                    <input
                        name="capacity"
                        type="number"
                        min="0"
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder={t('capacityPlaceholder')}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">{t('status')}</label>
                    <select
                        name="status"
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        defaultValue="upcoming"
                    >
                        <option value="upcoming">{t('statusUpcoming')}</option>
                        <option value="running">{t('statusRunning')}</option>
                        <option value="ended">{t('statusEnded')}</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/60">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('descriptionLabel')}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('descriptionHelper')}</p>
                <MarkdownEditor name="description" placeholder={t('descriptionPlaceholder')} />
            </div>

            <div className="space-y-3 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/60">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('banner')}</div>
                <input
                    name="bannerUrl"
                    className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder={t('bannerPlaceholder')}
                />
            </div>

            <div className="space-y-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/60">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('gallery')}</div>
                <ImageUploader value={gallery} onChange={setGallery} />
            </div>

            <div className="space-y-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/60">
                <AttachmentUploader onChange={setAttachments} />
            </div>

            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                    {t('cancel')}
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('submit')}
                </button>
            </div>
        </form>
    );
}
